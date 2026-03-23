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

function create_card() {
    const new_card = document.createElement("section");
    new_card.classList.add("block_html", "block", "card", "mb-3");

    const new_card_body = document.createElement("div");
    new_card_body.classList.add("card-body", "p-3");

    const title = document.createElement("h5");
    title.textContent = "閉じたタブの表示";

    const btn = document.createElement("button");
    btn.textContent = show_closed_tabs ? "ON" : "OFF";

    btn.addEventListener("click", () => {
        show_closed_tabs = !show_closed_tabs;
        save();
        btn.textContent = show_closed_tabs ? "ON" : "OFF";
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
        card.insertAdjacentElement("beforebegin", new_card);
    }
    btn.classList.add("btn", "btn-outline-secondary");

    new_card.appendChild(new_card_body);
    new_card_body.appendChild(title);
    new_card_body.appendChild(btn);
}

function save() {
    localStorage.setItem("hide", show_closed_tabs);
}

let show_closed_tabs = localStorage.getItem("hide") !== "false";
create_card();
hide_tabs();

const tabs = document.querySelectorAll(".btn.btn-icon.mr-1.icons-collapse-expand.justify-content-center.stretched-link");
tabs.forEach((el) => {
    el.addEventListener("click", () => {
        setTimeout(hide_tabs, 0);
    });
});