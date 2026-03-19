//余計な文章の変更
const message = document.querySelector(".box.py-3.generalbox p");
if (message && message.textContent.includes("2023年度より、本サーバを Moodle サーバとして運用します。")) {
    message.textContent = "2023年度より、本サーバを Moodle サーバとして運用しています。";
    message.style.fontWeight = "bold";
}

const login = document.querySelector("span.login.nav-link");
if (login && login.textContent.includes("あなたはログインしていません。")) {
    login.textContent = login.textContent.replace("。", "");
}

