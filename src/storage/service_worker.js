// 一定時間ごとに実行
chrome.alarms.create("scrape", {
  periodInMinutes: 360
});

// アラーム発火時
chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name === "scrape") {
    console.log("Scraping Alarm Executed");
    runScraping();
  }
});

async function runScraping() {
  await ensureOffscreen();
  const { courseIds } = await chrome.storage.local.get("courseIds");

  for (const courseId of courseIds) {
    await processCourse(courseId);
  }

  console.log("Scraping complete");
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
          data.show = assign.show ? assign.show : true;
          data.notified = assign.notified ? assign.notified : false;
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
          data.show = quiz.show ? quiz.show : true;
          data.notified = quiz.notified ? quiz.notified : false;
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

