function hide_tabs() {
    const tabs = document.querySelectorAll(".btn.btn-icon.mr-1.icons-collapse-expand.justify-content-center.stretched-link.collapsed");
    tabs.forEach((el) => {
        const tab = el.closest(".section.course-section.main.clearfix");
        if (tab) {
            if (show_closed_tabs) {
            tab.style.display = "";
            } else {
            tab.style.display = "none";
            }
        }
    });
}

function create_button() {
    const btn = document.createElement("button");
    btn.textContent = show_closed_tabs ? "閉じたタブ：表示中" : "閉じたタブ：非表示中";

    btn.addEventListener("click", () => {
        show_closed_tabs = !show_closed_tabs;
        save();
        btn.textContent = show_closed_tabs ? "閉じたタブ：表示中" : "閉じたタブ：非表示中";
        hide_tabs();
    });

    const titles = document.querySelectorAll("h5");
    let card = null;

    titles.forEach((el) => {
        if(el.textContent === "シラバス") {
            card = el.closest(".card");
        } else if (el.textContent === "管理") {
            card = el.closest(".card");
        }
    });
    if (card) {
    card.insertAdjacentElement("beforebegin", btn);
    }
    btn.classList.add("buttonOutline");
}

function save() {
    localStorage.setItem("hide", show_closed_tabs);
}

let show_closed_tabs = localStorage.getItem("hide") !== "false";
create_button();
hide_tabs(show_closed_tabs);

const tabs = document.querySelectorAll(".btn.btn-icon.mr-1.icons-collapse-expand.justify-content-center.stretched-link");
tabs.forEach((el) => {
    el.addEventListener("click", () => {
        setTimeout(hide_tabs, 0);
    });
});