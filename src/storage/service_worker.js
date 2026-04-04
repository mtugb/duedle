importScripts('./scrapeAssign.js', './scrapeQuiz.js', '../common/utils.js');

// 一定時間ごとに実行
chrome.alarms.create("scrape", {
    periodInMinutes: 1440
});

// アラーム発火時
chrome.alarms.onAlarm.addListener((alarm) => {
    if (alarm.name === "scrape") {
        ccount = 0;
        runScraping();
        console.log("Executing Scraping");
    }
});


//すべてのコースページからscrape
async function runScraping() {
    // Moodleページを開く
    chrome.storage.local.get(["courseIds"], async (result) => {
        for (const courseId of result.courseIds) {
            await processCourse(courseId);
        }
    });
}
async function processCourse(courseId) {
    const tab = await chrome.tabs.create({
        url: `https://cms7.ict.nitech.ac.jp/moodle40a/course/view.php?id=${courseId}`,
        active: false
    });
    console.log("opening courseId:" + courseId);
    // 読み込み待ち
    await waitTab(tab.id);

    // スクリプト注入
    const results = await chrome.scripting.executeScript({
        target: { tabId: tab.id },
        func: () => {
            return [
                ...document.querySelectorAll("li.assign, li.quiz")
            ].map(el => ({
                id: el.getAttribute("data-id"),
                type: el.classList.contains("assign") ? "assign" : "quiz"
            }));
        }
    });
    const items = results[0].result;

    // タブ閉じる
    chrome.tabs.remove(tab.id);

    // 次のページ処理
    for (const item of items) {
        await processItem(item);
    }
}

async function processItem(item) {
    const url =
        item.type === "assign"
            ? `https://cms7.ict.nitech.ac.jp/moodle40a/mod/assign/view.php?id=${item.id}`
            : `https://cms7.ict.nitech.ac.jp/moodle40a/mod/quiz/view.php?id=${item.id}`;

    const tab = await chrome.tabs.create({ url, active: false });

    await waitTab(tab.id);

    const result = await chrome.scripting.executeScript({
        target: { tabId: tab.id },
        func: () => {
            if(item.type === "assign"){
                scrapeAssign();
            } else {
                scrapeQuiz();
            }
        }
    });

    chrome.tabs.remove(tab.id);
}


function waitTab(tabId) {
  return new Promise(resolve => {
    chrome.tabs.onUpdated.addListener(function listener(id, info) {
      if (id === tabId && info.status === "complete") {
        chrome.tabs.onUpdated.removeListener(listener);
        resolve();
      }
    });
  });
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

