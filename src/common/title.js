//メニュー画面をかわいく
const title = document.querySelector(".page-header-headings h1");
if (title && title.textContent.includes("ダッシュボード")) {
    title.textContent = "Duedle開発テスト中😋✌️";
}

//ダッシュボードをメニューへ
const sub_title = document.querySelectorAll("a");
sub_title.forEach((el) => {
    if (el.hasAttribute("href") && el.textContent.includes("ダッシュボード")) {
        el.textContent = "メニュー";
    }
});

//マイコースとコースの非表示
const my_cource = document.querySelectorAll(".breadcrumb-item");
my_cource.forEach((el) => {
    if (el.textContent.includes("マイコース") || el.textContent.includes("コース")) {
        el.remove();
    }
});