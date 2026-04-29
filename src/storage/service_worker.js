importScripts("./class/StorageUtil.js");
importScripts("./class/scrape/Scrape.js");
importScripts("./class/scrape/ScrapeAssign.js");
importScripts("./class/scrape/ScrapeQuiz.js");
importScripts("../common/utils.js");

const ext = globalThis.browser ?? chrome;

// アラーム発火時
ext.runtime.onMessage.addListener(async (msg, sender) => {
  switch (msg.type) {
    case "SCRAPE_COURSE":
      console.log("Scraping Alarm Executed");
      runScraping();
      break;
    case "TAB_COURSE":
      console.log("tab scrape executed");
      runTabScraping();
      break;
  }

});

async function runScraping() {
  await ensureOffscreen();
  const { courseIds } = await ext.storage.local.get("courseIds");

  for (const courseId of courseIds) {
    await processCourse(courseId);
  }
  const url = "https://cms7.ict.nitech.ac.jp/moodle40a/my/";
  // 🔔 通知
  ext.notifications.create(url, {
    type: "basic",
    iconUrl: "icon.jpg",
    title: "スクレイピング完了",
    message: `課題の情報収集が完了しました`
  });

  ext.notifications.onClicked.addListener((notificationId) => {
    ext.tabs.create({
      url: notificationId
    });
  });
  console.log("Scrape Completed");
}

async function ensureOffscreen() {
  const exists = await ext.offscreen.hasDocument?.();

  if (!exists) {
    await ext.offscreen.createDocument({
      url: "storage/offscreen.html",
      reasons: ["DOM_PARSER"],
      justification: "Parse HTML"
    });
  }
}

async function fetchHTML(url) {
  try {
    const res = await fetch(url, {
      credentials: "include"
    });

    if (!res.ok) {
      throw new Error("HTTP error: " + res.status);
    }

    const buffer = await res.arrayBuffer();
    return new TextDecoder("utf-8").decode(buffer);
  } catch (e) {
    console.error("fetch失敗:", url, e);
    return null;
  }
}
function parseHTML(type, html) {
  return new Promise(resolve => {
    ext.runtime.sendMessage({ type, html }, resolve);
  });
}

async function processCourse(courseId) {
  const url = `https://cms7.ict.nitech.ac.jp/moodle40a/course/view.php?id=${courseId}`;

  const html = await fetchHTML(url);
  const items = await parseHTML("parse-course", html);

  for (const item of items) {
    await processItem(item);
  }
}

async function processItem(item) {
  const url =
    item.type === "assign"
      ? `https://cms7.ict.nitech.ac.jp/moodle40a/mod/assign/view.php?id=${item.id}`
      : `https://cms7.ict.nitech.ac.jp/moodle40a/mod/quiz/view.php?id=${item.id}`;

  const html = await fetchHTML(url);
  const detail =
    item.type === "assign"
      ? await parseHTML("parse-assign", html)
      : await parseHTML("parse-quiz", html);

  const data = {
    ...detail
  };
  if (data.courseName) {
    if (item.type === "assign") {
      data.assignId = item.id;
      StorageUtil.saveData("assign_list", "assignId", data);
    } else {
      data.quizId = item.id;
      StorageUtil.saveData("quiz_list", "quizId", data);
    }
  }

}




async function runTabScraping() {
  // Moodleページを開く
  ext.storage.local.get(["courseIds"], async (result) => {
    for (const courseId of result.courseIds) {
      await processTabCourse(courseId);
    }
  });
}

async function processTabCourse(courseId) {
  const tab = await ext.tabs.create({
    url: `https://cms7.ict.nitech.ac.jp/moodle40a/course/view.php?id=${courseId}`,
    active: false
  });
  console.log("opening courseId:" + courseId);
  // 読み込み待ち
  await waitTab(tab.id);

  // スクリプト注入
 // 注入ではなくメッセージ
  const items = await sendTabMessage(
    tab.id,
    { type:"SCRAPE_COURSE" }
  );

  // タブ閉じる
  ext.tabs.remove(tab.id);

  // 次のページ処理
  for (const item of items) {
    await processTabItem(item);
  }
}

function sendTabMessage(tabId, msg) {
  return new Promise((resolve,reject)=>{
    ext.tabs.sendMessage(
      tabId,
      msg,
      response => {
        if (chrome.runtime.lastError) {
          reject(chrome.runtime.lastError);
          return;
        }

        resolve(response);
      }
    );
  });
}



async function processTabItem(item) {
  const url =
    item.type === "assign"
      ? `https://cms7.ict.nitech.ac.jp/moodle40a/mod/assign/view.php?id=${item.id}`
      : `https://cms7.ict.nitech.ac.jp/moodle40a/mod/quiz/view.php?id=${item.id}`;

  const tab = await ext.tabs.create({ url, active: false });

  await waitTab(tab.id);
  //csが自動で収集してくれる
  ext.tabs.remove(tab.id);
}

function waitTab(tabId) {
  return new Promise(resolve => {
    ext.tabs.onUpdated.addListener(function listener(id, info) {
      if (id === tabId && info.status === "complete") {
        ext.tabs.onUpdated.removeListener(listener);
        resolve();
      }
    });
  });
}



ext.runtime.onInstalled.addListener(() => {
  ext.tabs.query({}, (tabs) => {
    tabs.forEach((tab) => {
      if (tab.url && tab.url.includes("cms7.ict.nitech.ac.jp/moodle40a")) {
        ext.tabs.reload(tab.id);
      }
    });
  });
});


//notification
ext.alarms.create("task_notice", { periodInMinutes: 10 });

ext.alarms.onAlarm.addListener(async (alarm) => {
  if (alarm.name === "task_notice") {
    const now = new Date();
    let updated = false;

    const assign_result = await ext.storage.local.get("assign_list");
    const assign_data = assign_result.assign_list || [];

    for (let item of assign_data) {
      if (!item.due) {
        continue;
      }
      // 例：締切24時間以内 & 未通知
      const due = new Date(item.due);
      const diff = (due - now) / (1000 * 60 * 60);

      if (diff <= 24 && diff > 0 && !item.notified && item.status !== "complete") {
        const url = "https://cms7.ict.nitech.ac.jp/moodle40a/mod/assign/view.php?id=" + item.assignId;
        // 🔔 通知
        newNotification(url, item.courseName, item.assignName);

        // ✅ 通知済みに更新
        item.notified = true;
        updated = true;
      }
    }
    // 💾 storage更新
    if (updated) {
      await ext.storage.local.set({ assign_list: assign_data });
    }

    updated = false;

    const quiz_result = await ext.storage.local.get("quiz_list");
    const quiz_data = quiz_result.quiz_list || [];

    for (let item of quiz_data) {
      if (!item.due) {
        continue;
      }
      // 例：締切24時間以内 & 未通知
      const due = new Date(item.due);
      const diff = (due - now) / (1000 * 60 * 60);

      if (diff <= 24 && diff > 0 && !item.notified && item.status !== "complete") {
        const url = "https://cms7.ict.nitech.ac.jp/moodle40a/mod/quiz/view.php?id=" + item.quizId;
        // 🔔 通知
        newNotification(url, item.courseName, item.quizName);

        // ✅ 通知済みに更新
        item.notified = true;
        updated = true;
      }
    }
    // 💾 storage更新
    if (updated) {
      await ext.storage.local.set({ quiz_list: quiz_data });
    }

  }

});
function newNotification(url, courseName, taskName) {
  ext.notifications.create(url, {
    type: "basic",
    iconUrl: "icon.jpg",
    title: "締切間近",
    message: `${courseName} コースの ${taskName} の締切が近いです`
  });

  ext.notifications.onClicked.addListener((notificationId) => {
    ext.tabs.create({
      url: notificationId
    });
  });
}