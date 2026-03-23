//マイコースリンクの非表示
const nav = document.querySelectorAll("a");
nav.forEach((el) => {
    if (el.getAttribute("tabindex")) {
        if (el.getAttribute("title")) {
            el.textContent = el.getAttribute("title");
        }

        if (el.textContent === "マイコース") {
            el.removeAttribute("href");
            el.style.pointerEvents = "none";
        }
    }
});

//さらにとサイトホーム, まわりのアイコンやプルダウンタブの削除
document.querySelectorAll(".item-content-wrap").forEach(el => {
    if (el.textContent.includes("さらに") || el.textContent.includes("サイトホーム") || el.textContent.includes("マイコース")) {
        el.remove();
    }
});
document.querySelectorAll(".icon.fa.fa-square.fa-fw.navicon").forEach(el => {
    el.remove();
});
document.querySelectorAll(".icon.fa.fa-home.fa-fw.navicon").forEach(el => {
    el.remove();
});

//ダッシュボードリンクの削除
const dashboard = document.querySelectorAll(".tree_item.branch.active_tree_node.navigation_node");
dashboard.forEach(el => {
    el.remove();
});

//タブ左の感覚の調整
document.querySelectorAll("p.tree_item.branch").forEach(el => {
    el.style.paddingLeft = "0";
    el.style.marginLeft = "0";
});

//遷移先にメニューが表示されないように
const menu = document.querySelector(".tree_item.branch.navigation_node");
if(menu) {
    menu.remove();
}