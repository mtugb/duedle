const title = document.querySelector(".page-header-headings h1");
if (title) title.textContent = "Duedle開発テスト中😋✌️";

const sub_title = document.querySelectorAll("a");
sub_title.forEach((el) => {
    if(el.hasAttribute("href") && el.textContent.includes("ダッシュボード")) {
        el.textContent = "メニュー";
    }
});