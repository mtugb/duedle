function hide_tabs() {
    const expand = document.querySelectorAll(".btn.btn-icon.mr-1.icons-collapse-expand.justify-content-center.stretched-link.collapsed");
    expand.forEach((el) => {
        const tab = el.closest(".section.course-section.main.clearfix");
        if (tab) {
            tab.style.display = "none";
        }
    });
}

hide_tabs();

const btn = document.querySelectorAll(".btn.btn-icon.mr-1.icons-collapse-expand.justify-content-center.stretched-link");
btn.forEach((el) => {
    el.addEventListener("click", () => {
        setTimeout(hide_tabs, 0);
    });
});