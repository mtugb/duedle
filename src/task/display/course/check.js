changeActColor = (item) => {
    if (item._store === "assign_list") {
        const actbox = document.querySelectorAll(`[data-activityname="${item.assignName.replace("&", "&amp;")}"]`);
        if (actbox[0]) {
            actbox[0].classList.add(item.status);
        }

    } else if (item._store === "quiz_list") {
        const actbox = document.querySelectorAll(`[data-activityname="${item.quizName.replace("&", "&amp;")}"]`);
        if (actbox[0]) {
            actbox[0].classList.add(item.status);
        }
    }
}

//unvisited
checkUnvisited = () => {
    const unvisitedboxes = Array.from(document.querySelectorAll(`[data-activityname]:not(.activity-information,.complete,.incomplete,.unknown,.expired,.stuck,.qualify,.warning,.unvisited)`));
    unvisitedboxes.map((item) => {
        if ((item.querySelector("span").textContent.includes(" 課題") || item.querySelector("span").textContent.includes(" 小テスト"))) {
            item.classList.add("unvisited");
        }
    });
}
