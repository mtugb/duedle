changeAct = (item) => {
    const actbox = Array.from(document.querySelectorAll(`.event`));
    actbox.map((i) => {
        if ((item._store === "assign_list" && i.textContent.includes(item.assignName)) || (item._store === "quiz_list" && i.textContent.includes(item.quizName))) {
            i.classList.add(item.status);
            const link = i.querySelector("a");
            link.removeAttribute("data-action");
            if (item._store === "quiz_list") {
                link.setAttribute("href", `https://cms7.ict.nitech.ac.jp/moodle40a/mod/quiz/view.php?id=${item.quizId}`);
            } else if (item._store === "assign_list") {
                link.setAttribute("href", `https://cms7.ict.nitech.ac.jp/moodle40a/mod/assign/view.php?id=${item.assignId}`);
            }
        }
        const i_date = i.querySelector(".date").textContent.match(/(\d{4})年\s*(\d{2})月\s*(\d{2})日,\s*(\d{2}):(\d{2})/);
        if (i_date) {
            const [, year, month, day, hour, minute] = i_date;

            const due = new Date(
                Number(year),
                Number(month) - 1, // 月は0始まり
                Number(day),
                Number(hour),
                Number(minute)
            );
            i.querySelector(".date").textContent = i_date[0] + ": " + formatRemainingTime(due);
        }

    });
}

//unvisited
checkUnvisited = () => {
    const unvisitedboxes = Array.from(document.querySelectorAll(`.event:not(.complete,.incomplete,.unknown,.expired,.stuck,.qualify,.warning)`));
    unvisitedboxes.map((item) => {
        item.classList.add("unvisited");
    })

    const unvisitedboxesh6 = Array.from(document.querySelectorAll(`h6.d-flex.mb-1`));
    unvisitedboxesh6.map((item) => {
        item.classList.remove("mb-1");
    })
}
