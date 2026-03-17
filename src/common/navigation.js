const els = document.querySelectorAll("a[href*='course/view.php']");

els.forEach(el => {
    console.log(el.textContent);
});