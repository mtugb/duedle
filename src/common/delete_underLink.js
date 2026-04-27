//言語選択ボタン
const el = document.querySelector(".list-unstyled.pt-3");
if(el) el.remove();

//Homeボタン
const home = document.querySelectorAll("footer a");
home.forEach((el) => {
    if (el.hasAttribute("href") && el.textContent.trim() === "Home") {
        el.remove();
    }
});

//ログイン表示
const logininfo = document.querySelector(".logininfo");
if (logininfo) {
    logininfo.remove();
}

//ログイン表示まわりの空行
const icon = document.querySelector("i.fa-envelope-o");
if (icon) {
    const space = icon.closest("div.pb-3");
    if (space) {
        space.style.height = "22.06px";
    }
}