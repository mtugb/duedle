const header = document.querySelector("header");
const ext_dashboard = document.createElement("div");
ext_dashboard.setAttribute("id", "ext_dashboard");
ext_dashboard.classList.add("card-body");
//inside div - innerHTML
const extInner =
    `<button class="btn btn-secondary" id="displaybutton">課題表示を切り替える</button>
    <div id="filter" class="filter-group my-2 p-2 border-radius border">
        <fieldset id="fieldfilter">
            <label for="typeSelect" class="filterlabel mr-md-2 mb-md-0">種類</label>
            <select id="typeSelect" class="form-select form-select-sm w-auto custom-select mb-1 mb-md-0 mr-md-2"></select>
            <label for="statusSelect" class="filterlabel mr-md-2 mb-md-0">状態</label>
            <select id="statusSelect" class="form-select form-select-sm w-auto custom-select mb-1 mb-md-0 mr-md-2"></select>
            <label for="dueSelect" class="filterlabel mr-md-2 mb-md-0">期限</label>
            <select id="dueSelect" class="form-select form-select-sm w-auto custom-select mb-1 mb-md-0 mr-md-2"></select>
            <label for="showSelect" class="filterlabel mr-md-2 mb-md-0">表示</label>
            <select id="showSelect" class="form-select form-select-sm w-auto custom-select mb-1 mb-md-0 mr-md-2"></select>
            <button class="btn btn-primary" id="scrapebutton">課題情報を更新する</button>
        </fieldset>
        <fieldset id="fieldcolor">
        </fieldset>
    </div>
    <div id="display">
    </div>`;
ext_dashboard.innerHTML = extInner;
header.append(ext_dashboard);
const filter = document.querySelector("#filter")
const display = document.querySelector("#display");
const fieldset = document.querySelector("#fieldfilter");
const fieldcolor = document.querySelector("#fieldcolor");
const noexistmsg = "表示するものがありません";

//filters
//type filter
const typeValues = ["all", "assign_list", "quiz_list"];
const typeOptionsText = ["すべて", "提出課題", "小テスト"];
const typeSelect = document.querySelector("#typeSelect");
const typeLabel = document.querySelector("label[for='typeSelect']");
const typeOptions = typeValues.map((value, index) => {
    const option = document.createElement("option");
    option.value = value;
    option.textContent = typeOptionsText[index];
    return option;
});
typeOptions.forEach(option => typeSelect.appendChild(option));


//status filter
const statuses = ["すべて", "完了", "完了以外", "合格(小テストのみ)", "未提出", "行き詰まり(小テストのみ)", "期限切れ", "点数不明(小テストのみ)"];
const statusValues = ["all", "complete", "ex-complete", "qualify", "incomplete", "stuck", "expired", "unknown"];
const statusSelect = document.querySelector("#statusSelect");
const statusLabel = document.querySelector("label[for='statusSelect']");
const statusOptions = statusValues.map((value, index) => {
    const option = document.createElement("option");
    option.value = value;
    option.textContent = statuses[index];
    return option;
});
statusOptions.forEach(option => statusSelect.appendChild(option));

//due filter
const dueValues = ["all", "progressing", "week", "today", "dueweek", "overdue"];
const dueOptionsText = ["すべて", "進行中", "今週", "24時間以内", "1週間前までに終了", "終了"];
const dueSelect = document.querySelector("#dueSelect");
const dueLabel = document.querySelector("label[for='dueSelect']");
const dueOptions = dueValues.map((value, index) => {
    const option = document.createElement("option");
    option.value = value;
    option.textContent = dueOptionsText[index];
    return option;
});
dueOptions.forEach(option => dueSelect.appendChild(option));

//show filter
const showValues = ["all", "normal", "deleted"];
const showOptionsText = ["すべて", "通常", "表示削除済み"];
const showSelect = document.querySelector("#showSelect");
const showLabel = document.querySelector("label[for='showSelect']");
const showOptions = showValues.map((value, index) => {
    const option = document.createElement("option");
    option.value = value;
    option.textContent = showOptionsText[index];
    return option;
});
showOptions.forEach(option => showSelect.appendChild(option));

//filter effect
typeSelect.addEventListener("change", async () => {
    chrome.storage.sync.set({ "selectedType": typeSelect.value }); // 選択した値をローカルストレージに保存
    rerender();
});
statusSelect.addEventListener("change", async () => {
    chrome.storage.sync.set({ "selectedStatus": statusSelect.value }); // 選択した値をローカルストレージに保存
    rerender();
});
dueSelect.addEventListener("change", async () => {
    chrome.storage.sync.set({ "selectedDue": dueSelect.value }); // 選択した値をローカルストレージに保存
    rerender();
});
showSelect.addEventListener("change", async () => {
    chrome.storage.sync.set({ "selectedShow": showSelect.value }); // 選択した値をローカルストレージに保存
    rerender();
});




//buttonEvent
//display runscraping button   cooldown: 3h
const scrapebutton = document.querySelector("#scrapebutton");
scrapebutton.addEventListener("click", async () => {
    scrapebutton.disabled = true;
    const now = new Date();
    await chrome.storage.local.set({ scrapeCooldown: now.toISOString() });
    await chrome.runtime.sendMessage({
        type: "SCRAPE_COURSE"
    });
    scrapebutton.textContent = "クールダウン: 残り3時間";
});
chrome.storage.local.get("scrapeCooldown", (item) => {
    const prev = new Date(item.scrapeCooldown);
    const next = new Date(prev.getTime() + (1000 * 60 * 60 * 3));
    const now = new Date();
    const remain = Math.ceil((next - now) / (1000 * 60 * 60 * 24));
    if (remain > 0) {
        scrapebutton.textContent = "クールダウン: " + formatRemainingTime(next);
        scrapebutton.disabled = true;
    }
});

//display show button
const displaybutton = document.querySelector("#displaybutton");
displaybutton.addEventListener("click", () => {
    if (!display.hasAttribute("hidden")) {
        display.setAttribute("hidden", "");
        filter.setAttribute("hidden", "");
    } else {
        display.removeAttribute("hidden");
        filter.removeAttribute("hidden");
    }
    chrome.storage.sync.set({ displayShow: !display.hasAttribute("hidden") });
});




//setting color
const colorTypesValue = ["complete", "qualify", "incomplete", "stuck", "warning", "expired", "unknown", "unvisited"];
const colorTypesLabel = ["完了", "合格", "未提出", "行き詰まり", "期限近い", "期限切れ", "不明", "未参照"];
const colorTypesTitle = [
    "提出が完了している / 満点をとっている",
    "必要点数に達しているが満点ではない (小テストのみ)",
    "提出していない / 小テストに答えていない",
    "テスト回数上限に達したが合格していない (小テストのみ)",
    "期限が3日以内だが未提出",
    "期限を過ぎている",
    "点数が非公開のため評価できない (小テストのみ)",
    "まだ確認していないタスク"
];
colorTypesValue.map((value, index) => {
    const input = document.createElement("input");
    input.type = "color";
    input.name = value;
    input.id = "colorSelect_" + value;
    input.classList.add("form-select", "form-select-sm", "mb-1", "mb-md-0", "mr-md-2");
    const colorLabel = document.createElement("label");
    colorLabel.textContent = colorTypesLabel[index];
    colorLabel.setAttribute("for", input.id);
    colorLabel.classList.add("filterlabel", "mr-md-2", "mb-md-0");
    colorLabel.title = colorTypesTitle[index];
    fieldcolor.appendChild(colorLabel);
    fieldcolor.appendChild(input);

    input.addEventListener("change", async () => {
        if (document.querySelector(".darkmode")) {
            await chrome.storage.sync.set({ ["colorSelect_dark_" + value]: input.value }); // 選択した値をローカルストレージに保存
        } else {
            await chrome.storage.sync.set({ ["colorSelect_light_" + value]: input.value });
        }
        applyColor(value, input.value);
    });
});





// ページ読み込み時にローカルストレージから選択状態を復元
window.addEventListener("load", async () => {
    const savedType = (await chrome.storage.sync.get(["selectedType"])).selectedType;
    const savedStatus = (await chrome.storage.sync.get(["selectedStatus"])).selectedStatus;
    const savedDue = (await chrome.storage.sync.get(["selectedDue"])).selectedDue;
    const savedShow = (await chrome.storage.sync.get(["selectedShow"])).selectedShow;
    if (savedType) {
        typeSelect.value = savedType;
    }
    if (savedStatus) {
        statusSelect.value = savedStatus;
    }
    if (savedDue) {
        dueSelect.value = savedDue;
    }
    if (savedShow) {
        showSelect.value = savedShow;
    }
});

//display appendまで待機
(async () => {
    const savedDisplayShow = (await chrome.storage.sync.get(["displayShow"])).displayShow;
    if (savedDisplayShow === undefined) {
        display.setAttribute("hidden", "");
    }
})();

async function rerender() {
    document.querySelector("#display").innerHTML = ""; // 表示をクリア
    const alldata = await getAllData();
    display.textContent = noexistmsg;
    displaybox(alldata); // データを再表示
    colorReload();
}


//色適用
const applyColor = (type, toColor) => {
    if (document.querySelector(".darkmode")) {
        const q = Array.from(document.querySelectorAll(
            ".darkmode ." + type + ", .darkmode ." + type + ".type, .darkmode ." + type + " .title, .darkmode ." + type + " .info, .darkmode ."
            + type + " .date, .darkmode ." + type + " h6, .darkmode ." + type + " .overflow-auto, .darkmode ." + type + " div:not(.activityiconcontainer)"
        ));
        q.map((item) => {
            item.style.background = toColor;
        })
    } else {
        const q = Array.from(document.querySelectorAll(
            "." + type + ", ." + type + ".type, ." + type + " .title, ." + type + " .info, ."
            + type + " .date, ." + type + " h6, ." + type + " .overflow-auto, ." + type + " div:not(.activityiconcontainer)"

        ));
        q.map((item) => {
            item.style.background = toColor;
        })
    }
};


//初期状態のlocalstorage
chrome.storage.sync.get(["selectedType"], (result) => {
    if (result.selectedType === undefined) {
        chrome.storage.sync.set({ selectedType: "all" });
    }
});
chrome.storage.sync.get(["selectedStatus"], (result) => {
    if (result.selectedStatus === undefined) {
        chrome.storage.sync.set({ selectedStatus: "all" });
    }
});
chrome.storage.sync.get(["selectedDue"], (result) => {
    if (result.selectedDue === undefined) {
        chrome.storage.sync.set({ selectedDue: "all" });
    }
});
chrome.storage.sync.get(["selectedShow"], (result) => {
    if (result.selectedShow === undefined) {
        chrome.storage.sync.set({ selectedShow: "normal" });
    }
});
chrome.storage.sync.get(["displayShow"], (result) => {
    if (result.displayShow === undefined) {
        chrome.storage.sync.set({ displayShow: true });
    }
});

const colorDefault_light = ["#90ee90", "#add8e6", "#ffffe0", "#ffffff", "#ffb681", "#ff9090", "#c8c8c8", "#eac1ff"];
const colorDefault_dark = ["#063906", "#12515e", "#57422a", "#000000", "#7c3316", "#821f1f", "#454545", "#4a1745"];
colorTypesValue.map(async (value, index) => {
    const lsName_light = "colorSelect_light_" + value;
    const lsName_dark = "colorSelect_dark_" + value;
    if (!(await chrome.storage.sync.get([lsName_light]))[lsName_light]) {
        await chrome.storage.sync.set({ [lsName_light]: colorDefault_light[index] });
    }
    if (!(await chrome.storage.sync.get([lsName_dark]))[lsName_dark]) {
        await chrome.storage.sync.set({ [lsName_dark]: colorDefault_dark[index] });
    }
});
