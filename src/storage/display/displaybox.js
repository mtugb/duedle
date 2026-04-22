const displaybox = async (data) => {
    if (data) {
        await Promise.all(data.map(async item => {
            //condition
            const savedType = (await chrome.storage.sync.get(["selectedType"])).selectedType;
            const savedStatus = (await chrome.storage.sync.get(["selectedStatus"])).selectedStatus;
            const savedDue = (await chrome.storage.sync.get(["selectedDue"])).selectedDue;
            const savedShow = (await chrome.storage.sync.get(["selectedShow"])).selectedShow;
            if (location.href.includes("https://cms7.ict.nitech.ac.jp/moodle40a/course/view.php?id=")) {
                const courseName = document.querySelector("h1").textContent.trim();
                if (courseName !== item.courseName) {
                    return;
                }
                changeActColor(item);
            }

            if (item.start) { item.start = new Date(item.start); }
            if (item.due) { item.due = new Date(item.due); }
            changeAct(item);

            //表示状態確認
            if (savedShow === "normal" && !item.show) {
                return;
            }
            if (savedShow === "deleted" && item.show) {
                return;
            }

            if (savedType !== "all" && item.group !== savedType) {
                return; // タイプが一致しない場合はスキップ
            }
            if (savedStatus !== "all" && savedStatus !== "ex-complete" && item.status !== savedStatus) {
                return; // 状態が一致しない場合はスキップ
            }
            if (savedStatus === "ex-complete" && item.status === "complete") {
                return;
            }
            const remainhours = (item.due - Date.now()) / (1000 * 60 * 60); // 締切までの残り時間を計算
            if (savedDue !== "all" || savedDue !== "progressing") {
                // 期限フィルタのロジックをここに追加

                if (savedDue === "today" && (remainhours > 24 || remainhours < 0)) {
                    return; // 24時間以内でない場合はスキップ
                }
                if (savedDue === "week" && (remainhours > 24 * 7 || remainhours < 0)) {
                    return; // 今週以内でない場合はスキップ
                }
                if (savedDue === "overdue" && remainhours >= 0) {
                    return; // 期限切れでない場合はスキップ
                }
                if (savedDue === "dueweek" && (remainhours >= 0 || remainhours < 24 * 7)) {
                    return;
                }
            }
            if (savedDue === "progressing" && remainhours < 0) {
                return;
            }
            if (display.textContent === noexistmsg) {
                display.textContent = "";
            }

            if (item.group === "assign_list") {
                if (item.start) { item.start = new Date(item.start); }
                if (item.due) { item.due = new Date(item.due); }
                const assignbox = new AssignBox(item);
                const assign = await assignbox.getElement();
                display.appendChild(assign);
            } else if (item.group === "quiz_list") {
                displaybox_quiz_list(item);
            }
        }));
    }
    checkUnvisited();
    colorReload();
};

const changeActColor = (item) => {
    if (item.group === "assign_list") {
        const actbox = document.querySelectorAll(`[data-activityname="${item.assignName.replace("&", "&amp;")}"]`);
        if (actbox[0]) {
            actbox[0].classList.add(item.status);
        }

    } else if (item.group === "quiz_list") {
        const actbox = document.querySelectorAll(`[data-activityname="${item.quizName.replace("&", "&amp;")}"]`);
        if (actbox[0]) {
            actbox[0].classList.add(item.status);
        }
    }
}

const changeAct = (item) => {
    const actbox = Array.from(document.querySelectorAll(`.event`));
    actbox.map((i) => {
        if ((item.group === "assign_list" && i.textContent.includes(item.assignName)) || (item.group === "quiz_list" && i.textContent.includes(item.quizName))) {
            i.classList.add(item.status);
            const link = i.querySelector("a");
            link.removeAttribute("data-action");
            if (item.group === "quiz_list") {
                link.setAttribute("href", `https://cms7.ict.nitech.ac.jp/moodle40a/mod/quiz/view.php?id=${item.quizId}`);
            } else if (item.group === "assign_list") {
                link.setAttribute("href", `https://cms7.ict.nitech.ac.jp/moodle40a/mod/assign/view.php?id=${item.assignId}`);
            }
        }
        const i_datetxt = i.querySelector(".date").textContent;
        const due = transDue(i_datetxt);
        if (due) {
            i.querySelector(".date").textContent = formatRemainingTime(due);
        }
        const i_title = i.querySelector("a.text-truncate");
        if (i_title) i_title.setAttribute("title", i_title.textContent);

    });
};

//unvisited
const checkUnvisited = () => {
    const unvisitedboxes = Array.from(document.querySelectorAll(`[data-activityname]:not(.activity-information,.complete,.incomplete,.unknown,.expired,.stuck,.qualify,.warning,.unvisited)`));
    unvisitedboxes.map((item) => {
        if (!item.querySelector(".content") &&
            (item.textContent.includes(" 課題") || item.textContent.includes(" 小テスト"))) {
            item.classList.add("unvisited");
        }
    });
    const unvisitedboxes_ = Array.from(document.querySelectorAll(`.event:not(.complete,.incomplete,.unknown,.expired,.stuck,.qualify,.warning)`));
    unvisitedboxes_.map((i) => {
        i.classList.add("unvisited");
        const i_datetxt = i.querySelector(".date").textContent;
        const due = transDue(i_datetxt);
        if (due) {
            i.querySelector(".date").textContent = formatRemainingTime(due);
        }
        const i_title = i.querySelector("a.text-truncate");
        i_title.setAttribute("title", i_title.textContent);
    });

    const unvisitedboxesh6 = Array.from(document.querySelectorAll(`h6.d-flex.mb-1`));
    unvisitedboxesh6.map((item) => {
        item.classList.remove("mb-1");
    });
}

const colorReload = () => {
    colorTypesValue.map(async (value, index) => {
        const query = document.querySelector("#colorSelect_" + value);
        query.value = document.querySelector(".darkmode") ? (await chrome.storage.sync.get(["colorSelect_dark_" + value]))["colorSelect_dark_" + value] : (await chrome.storage.sync.get(["colorSelect_light_" + value]))["colorSelect_light_" + value];
        applyColor(value, query.value);
    });
};

const transDue = (txt) => {
    if (txt.includes("今日")) {
        const time = txt.match(/今日,\s*(\d{2}):(\d{2})/);
        const [, hour, minute] = time;
        const now = new Date();
        return new Date(
            now.getFullYear(),
            now.getMonth(),
            now.getDate(),
            Number(hour),
            Number(minute)
        );
    } else if (txt.includes("明日")) {
        const time = txt.match(/明日,\s*(\d{2}):(\d{2})/);
        const [, hour, minute] = time;
        const today = new Date();
        const tomorrow = new Date(today);
        tomorrow.setDate(today.getDate() + 1);
        return new Date(
            tomorrow.getFullYear(),
            tomorrow.getMonth(),
            tomorrow.getDate(),
            Number(hour),
            Number(minute)
        );
    } else {
        const time = txt.match(/(\d{4})年\s*(\d{1,2})月\s*(\d{1,2})日,\s*(\d{1,2}):(\d{2})/);
        if (time) {
            const [, year, month, day, hour, minute] = time;
            return new Date(
                Number(year),
                Number(month) - 1, // 月は0始まり
                Number(day),
                Number(hour),
                Number(minute)
            );
        }

    }
};

(async () => {
    const alldata = await StorageUtil.getAllData();
    display.textContent = "表示するものがありません";
    displaybox(alldata);
})();