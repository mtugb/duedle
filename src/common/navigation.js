const navi = document.querySelectorAll("a");

navi.forEach((item) => {
    if (item.getAttribute("title") !== null && item.getAttribute("tabindex") !== null) {
        item.textContent = item.getAttribute("title");
    }

});
