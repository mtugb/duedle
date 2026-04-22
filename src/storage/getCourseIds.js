//data-course-idが後で生成されるので、mutation
let timeout;
const seen = new Set();
async function scanCourses() {
    const coursefilter = document.querySelector("span[data-active-item-text]").textContent.trim();
    if(coursefilter.includes("削除済み")){
        return;
    }

    const courses = document.querySelectorAll("li.course-listitem[data-course-id]");
    if(courses.length<1){
        return;
    }

    courses.forEach(course => {
        const id = Number(course.getAttribute("data-course-id"));

        // 重複防止
        if (!seen.has(id)) {
            seen.add(id);
        }
    });
    //idをchrome.storage.syncに保存　以前あっても現在なければ格納しないので単純に上書き
    await chrome.storage.local.set({ courseIds: Array.from(seen) });
    //chrome.runtime.sendMessage({ type: "SAVE_IDS", ids: Array.from(seen) });
}

const observer = new MutationObserver(() => {
    clearTimeout(timeout);
    timeout = setTimeout(scanCourses, 1000);
});

//実行
scanCourses();
// 監視開始
observer.observe(document.body, {
    childList: true,
    subtree: true
});
