const nav = document.querySelectorAll("a");
nav.forEach((el) => {
    if(el.getAttribute("tabindex")) {
        if (el.getAttribute("title")) {
            el.textContent = el.getAttribute("title");
        }

        if(el.textContent.includes("マイコース")) {
            el.removeAttribute("href");
        }
    }
});

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

const dashboard = document.querySelectorAll(".tree_item.branch.active_tree_node.navigation_node");
dashboard.forEach(el => {
    el.remove();
});

document.querySelectorAll("p.tree_item.branch").forEach(el => {
    el.style.paddingLeft = "0";
    el.style.marginLeft = "0";
});