//余計な文章の変更
const message = document.querySelector(".box.py-3.generalbox p");
if (message && message.textContent.includes("2023年度より、本サーバを Moodle サーバとして運用します。")) {
    message.textContent = "2023年度より、本サーバを Moodle サーバとして運用しています。";
    message.style.fontWeight = "bold";
}

//デザインの微調整
const login = document.querySelector("span.login.nav-link");
if (login && login.textContent.includes("あなたはログインしていません。")) {
    login.textContent = login.textContent.replace("。", "");
}

const row = document.querySelector(".row");
if (row) row.remove();

const space = document.querySelector(".box.py-3.generalbox");
console.log(space);
space.style.marginTop = "100px";
