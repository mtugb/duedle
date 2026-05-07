// //メニュー画面をかわいく
// const title = document.querySelector(".page-header-headings h1");
// if (title && title.textContent.includes("ダッシュボード")) {
//     title.textContent = "Duedle開発テスト中😋✌️";
// }

//navbarのタイトル
if (document.querySelector(".navbar-brand") && (!document.URL.match(/login/) || document.URL.match("auth_"))) {
    const navbar = document.querySelector(".navbar-brand");
    navbar.textContent = "Duedle: Extended"
}

//navbarに時間を
const time = document.createElement("div");
time.id = "realtime";
time.classList.add("navbar-brand","d-flex","align-items-center","my-1");
time.style.position = "absolute";
time.style.left = "50%";
time.style.transform = "translateX(-50%)";
const sel = document.querySelector("ul.navbar-nav");
sel.after(time);

function twoDigit(num) {
    let ret;
    if (num < 10)
        ret = "0" + num;
    else
        ret = num;
    return ret;
}
function showClock() {
    let nowTime = new Date();
    let nowHour = twoDigit(nowTime.getHours());
    let nowMin = twoDigit(nowTime.getMinutes());
    let nowSec = twoDigit(nowTime.getSeconds());
    let msg = nowHour + ":" + nowMin + ":" + nowSec;
    document.getElementById("realtime").innerHTML = msg;
}
setInterval('showClock()', 1000);

//navbarに追加
const extensionMenu = document.createElement("div");
sel.before(extensionMenu);
extensionMenu.classList.add("extension-menu","my-1","navbar-nav");
const menuStruct = `
    <div class="menu-guide">
        <a class="nav-link icon-no-margin" href=${ext.runtime.getURL("pages/guide.html")} target="_blank">
        <img src="https://cms7.ict.nitech.ac.jp/moodle40a/theme/image.php/classic/mod_forum/1681978623/monologo" alt="拡張機能ガイド">
        </a>
    </div>
    <div class="menu-setting">
        <a class="nav-link icon-no-margin" href=${ext.runtime.getURL("pages/setting.html")} target="_blank">
        <i class="icon fa fa-cog fa-fw" title="拡張機能の設定">
        </i>
        </a>
    </div>
`;
extensionMenu.insertAdjacentHTML("beforeEnd",menuStruct);
console.log(ext.runtime.getURL("pages/guide.html"));



//マイコースとコースの非表示
const my_cource = document.querySelectorAll(".breadcrumb-item");
my_cource.forEach((el) => {
    if (el.textContent.includes("マイコース") || el.textContent.includes("コース")) {
        el.remove();
    }
});