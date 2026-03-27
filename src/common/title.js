//メニュー画面をかわいく
const title = document.querySelector(".page-header-headings h1");
if (title && title.textContent.includes("ダッシュボード")) {
    title.textContent = "Duedle開発テスト中😋✌️";
}

//navbarのタイトル
if (!document.URL.match(/login/)||document.URL.match("auth_")) {
    const navbar = document.querySelector(".navbar-brand");
    navbar.textContent = "Moodle: Extended"
}


//マイコースとコースの非表示
const my_cource = document.querySelectorAll(".breadcrumb-item");
my_cource.forEach((el) => {
    if (el.textContent.includes("マイコース") || el.textContent.includes("コース")) {
        el.remove();
    }
});