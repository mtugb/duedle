
const displaybox = async (data) => {
    if (data) {
        await Promise.all(data.map(async item => {
            //condition
            const savedType = (await chrome.storage.sync.get(["selectedType"])).selectedType;
            const savedStatus = (await chrome.storage.sync.get(["selectedStatus"])).selectedStatus;
            const savedDue = (await chrome.storage.sync.get(["selectedDue"])).selectedDue;
            const savedShow = (await chrome.storage.sync.get(["selectedShow"])).selectedShow;
            const courseName = document.querySelector("h1").textContent.trim();
            if (item.start) { item.start = new Date(item.start); }
            if (item.due) { item.due = new Date(item.due); }
            //ほかのコースはスキップ
            if (courseName !== item.courseName) {
                return;
            }
            changeActColor(item);

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
                displaybox_assign_list(item);
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

//unvisited
const checkUnvisited = () => {
    const unvisitedboxes = Array.from(document.querySelectorAll(`[data-activityname]:not(.activity-information,.complete,.incomplete,.unknown,.expired,.stuck,.qualify,.warning,.unvisited)`));
    unvisitedboxes.map((item) => {
        if (!item.querySelector(".content") &&
            (item.textContent.includes(" 課題") || item.textContent.includes(" 小テスト"))) {
            item.classList.add("unvisited");
        }
    });
}

const colorReload = () => {
    colorTypesValue.map(async (value, index) => {
        const query = document.querySelector("#colorSelect_" + value);
        query.value = document.querySelector(".darkmode") ? (await chrome.storage.sync.get(["colorSelect_dark_" + value]))["colorSelect_dark_" + value] : (await chrome.storage.sync.get(["colorSelect_light_" + value]))["colorSelect_light_" + value];
        applyColor(value, query.value);
    });
};

(async () => {
    const alldata = await getAllData();
    display.textContent = "表示するものがありません";
    displaybox(alldata);
})();