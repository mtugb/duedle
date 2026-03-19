//言語選択ボタン
const el = document.querySelector(".list-unstyled.pt-3");
if(el) el.remove();

//Homeボタン
const home = document.querySelectorAll("a");
home.forEach((el) => {
    if(el.hasAttribute("href") && el.textContent.includes("Home")) {
        el.remove();
    }
})