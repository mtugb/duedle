

// アラーム発火時
chrome.runtime.onMessage.addListener(async (msg, sender) => {
  console.log("Scraping Alarm Executed");
  runScraping();
});

async function runScraping() {
  await ensureOffscreen();
  const { courseIds } = await chrome.storage.local.get("courseIds");

  for (const courseId of courseIds) {
    await processCourse(courseId);
  }
const url = "https://cms7.ict.nitech.ac.jp/moodle40a/my/";
        // 🔔 通知
        chrome.notifications.create(url, {
          type: "basic",
          iconUrl: "icon.jpg",
          title: "スクレイピング完了",
          message: `課題の情報収集が完了しました`
        });

        chrome.notifications.onClicked.addListener((notificationId) => {
          chrome.tabs.create({
            url: notificationId
          });
        });
        console.log("Scrape Completed");
}

async function ensureOffscreen() {
  const exists = await chrome.offscreen.hasDocument?.();

  if (!exists) {
    await chrome.offscreen.createDocument({
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
    chrome.runtime.sendMessage({ type, html }, resolve);
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
  console.log(data);
  if (item.type === "assign") {
    data.assignId = item.id;
    chrome.storage.local.get(["assign_list"], (result) => {
      const assign_list = result.assign_list || [];
      assign_list.map(assign => {
        if (assign.assignId === item.id) {
          data.show = assign.show !== undefined ? assign.show : true;
          data.notified = assign.notified !== undefined ? assign.notified : false;
          return { ...assign, ...data };
        }
        return assign;
      });
    });
    await upsertAssign(data);

  } else {
    data.quizId = item.id;
    chrome.storage.local.get(["quiz_list"], (result) => {
      const quiz_list = result.quiz_list || [];
      quiz_list.map(quiz => {
        if (quiz.quizId === item.id) {
          data.show = quiz.show !== undefined ? quiz.show : true;
          data.notified = quiz.notified !== undefined ? quiz.notified : false;
          return { ...quiz, ...data };
        }
        return quiz;
      });
    });
    await upsertQuiz(data);
  }
}



async function upsertAssign(newItem) {
  const { assign_list } = await chrome.storage.local.get("assign_list");
  const data = assign_list || [];

  const index = data.findIndex(item => Number(item.assignId) === Number(newItem.assignId));

  if (index !== -1) {
    // 更新（マージ）
    data[index] = {
      ...data[index],
      ...newItem
    };
  } else {
    // 新規追加
    data.push(newItem);
  }

  await chrome.storage.local.set({ assign_list: data });
}

async function upsertQuiz(newItem) {
  const { quiz_list } = await chrome.storage.local.get("quiz_list");
  const data = quiz_list || [];

  const index = data.findIndex(item => Number(item.quizId) === Number(newItem.quizId));

  if (index !== -1) {
    // 更新（マージ）
    data[index] = {
      ...data[index],
      ...newItem
    };
  } else {
    // 新規追加
    data.push(newItem);
  }

  await chrome.storage.local.set({ quiz_list: data });
}

chrome.runtime.onInstalled.addListener(() => {
  chrome.tabs.query({}, (tabs) => {
    tabs.forEach((tab) => {
      if (tab.url && tab.url.includes("cms7.ict.nitech.ac.jp/moodle40a")) {
        chrome.tabs.reload(tab.id);
      }
    });
  });
});


//notification
chrome.alarms.create("task_notice", { periodInMinutes: 10 });

chrome.alarms.onAlarm.addListener(async (alarm) => {
  if (alarm.name === "task_notice") {
    const now = new Date();
    let updated = false;

    const assign_result = await chrome.storage.local.get("assign_list");
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
        chrome.notifications.create(url, {
          type: "basic",
          iconUrl: "icon.jpg",
          title: "締切間近",
          message: `${item.courseName} コースの ${item.assignName} の締切が近いです`
        });

        chrome.notifications.onClicked.addListener((notificationId) => {
          chrome.tabs.create({
            url: notificationId
          });
        });

        // ✅ 通知済みに更新
        item.notified = true;
        updated = true;
      }
    }
    // 💾 storage更新
    if (updated) {
      await chrome.storage.local.set({ assign_list: assign_data });
    }

    updated = false;

    const quiz_result = await chrome.storage.local.get("quiz_list");
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
        chrome.notifications.create(url, {
          type: "basic",
          iconUrl: "icon.jpg",
          title: "締切間近",
          message: `${item.courseName} コースの ${item.quizName} の締切が近いです`
        });
        chrome.notifications.onClicked.addListener((notificationId) => {
          chrome.tabs.create({
            url: notificationId
          });
        });

        // ✅ 通知済みに更新
        item.notified = true;
        updated = true;
      }
    }
    // 💾 storage更新
    if (updated) {
      await chrome.storage.local.set({ quiz_list: quiz_data });
    }

  }

});