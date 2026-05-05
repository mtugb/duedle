//data-course-idが後で生成されるので、mutation
let timeout;
const seen = new Set();
async function scanCourses() {
    const coursefilter = document.querySelector("span[data-active-item-text]").textContent.trim();
    if(coursefilter.includes("削除済み")){
        return;
    }

    const courses = document.querySelectorAll("li.course-listitem[data-course-id]");
    if(!courses.length){
        return;
    }

    const ids = [...courses].map(
        c => Number(c.dataset.courseId)
    );

    await ext.storage.local.set({
        courseIds: ids
    });
}

const observer = new MutationObserver(() => {
    clearTimeout(timeout);
    timeout = setTimeout(scanCourses, 300);
});

//実行
window.addEventListener("load", scanCourses);
// 監視開始
observer.observe(document.body, {
    childList: true,
    subtree: true
});
