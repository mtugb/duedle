const header = document.querySelector("header");
const ext_dashboard = document.createElement("div");
ext_dashboard.setAttribute("id", "ext_dashboard");
ext_dashboard.classList.add("card-body");


//inside div - innerHTML
const extInner =
    `
    <button class="btn btn-primary" id="scrapebutton">課題情報を更新する</button>
    <button class="btn btn-secondary" id="displaybutton">課題メニュー表示を切り替える</button>
    <button class="btn btn-secondary" id="deletebutton"></button>
    <div id="filter" class="filter-group my-2 p-2 border-radius border">
        <fieldset id="fieldfilter">
        </fieldset>
        <fieldset id="fieldcolor">
        </fieldset>
    </div>
    <div id="display">
    </div>`;
ext_dashboard.insertAdjacentHTML("beforeend", extInner);
header.after(ext_dashboard);

const filter = document.querySelector("#filter")
const display = document.querySelector("#display");
const fieldset = document.querySelector("#fieldfilter");
const fieldcolor = document.querySelector("#fieldcolor");
const scrapebutton = document.querySelector("#scrapebutton");
const noexistmsg = "表示するものがありません";

//scrape mode
const scrapeModeValues = ["scrape", "tab"];
const scrapeModeText = ["offscreen収集(PCのみ)", "タブで収集"];
const scrapeFilter = new FilterSelect("scrapeModeSelect", "収集モード", scrapeModeValues, scrapeModeText, "scrapeMode");
scrapeFilter.applyDefault("scrape");
(async () => {
    const scrapeFilterel = await scrapeFilter.getElement();
    scrapeFilterel.map((el) => {
        fieldset.appendChild(el);
    });
})();

//filters
//type filter
const typeValues = ["all", "assign_list", "quiz_list"];
const typeOptionsText = ["すべて", "提出課題", "小テスト"];
const typeFilter = new FilterSelect("typeSelect", "種類", typeValues, typeOptionsText, "selectedType");
typeFilter.applyDefault("all");
(async () => {
    const typeFilterel = await typeFilter.getElement();
    typeFilterel.map((el) => {
        fieldset.appendChild(el);
    });
})();

//status filter
const statusValues = ["all", "complete", "ex-complete", "qualify", "incomplete", "stuck", "expired", "unknown"];
const statusOptionsText = ["すべて", "完了", "完了以外", "合格(小テストのみ)", "未提出", "行き詰まり(小テストのみ)", "期限切れ", "点数不明(小テストのみ)"];
const statusFilter = new FilterSelect("statusSelect", "状態", statusValues, statusOptionsText, "selectedStatus");
statusFilter.applyDefault("all");
(async () => {
    const statusFilterel = await statusFilter.getElement();
    statusFilterel.map((el) => {
        fieldset.appendChild(el);
    });
})();

//due filter
const dueValues = ["all", "progressing", "week", "today", "dueweek", "overdue"];
const dueOptionsText = ["すべて", "進行中", "今週", "24時間以内", "1週間前までに終了", "終了"];
const dueFilter = new FilterSelect("dueSelect", "期限", dueValues, dueOptionsText, "selectedDue");
dueFilter.applyDefault("all");
(async () => {
    const dueFilterel = await dueFilter.getElement();
    dueFilterel.map((el) => {
        fieldset.appendChild(el);
    });
})();

//show filter
const showValues = ["all", "normal", "deleted"];
const showOptionsText = ["すべて", "通常", "表示削除済み"];
const showFilter = new FilterSelect("showSelect", "表示", showValues, showOptionsText, "selectedShow");
showFilter.applyDefault("normal");
(async () => {
    const showFilterel = await showFilter.getElement();
    showFilterel.map((el) => {
        fieldset.appendChild(el);
    });
})();



//buttonEvent
//display runscraping button   cooldown: 3h
scrapebutton.addEventListener("click", async () => {
    scrapebutton.disabled = true;
    const now = new Date();
    await ext.storage.local.set({ scrapeCooldown: now.toISOString() });
    ext.storage.sync.get("scrapeMode", async (item) => {
        if (item.scrapeMode === "scrape") {
            await ext.runtime.sendMessage({
                type: "SCRAPE_COURSE"
            });
        } else if (item.scrapeMode === "tab"){
            await ext.runtime.sendMessage({
                type: "TAB_COURSE"
            });
        }

        scrapebutton.textContent = "クールダウン: 残り3時間";
    });

});
ext.storage.local.get("scrapeCooldown", (item) => {
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
    ext.storage.sync.set({ displayShow: !display.hasAttribute("hidden") });
});

//deletebutton
let deletebutton_count = 5;
const deletebutton = document.querySelector("#deletebutton");
deletebutton.textContent = `一括表示切り替え(${deletebutton_count}クリック)`;
deletebutton.addEventListener("click", async () => {
    if (deletebutton_count !== 1) {
        deletebutton_count--;
    } else {
        const tasklink = Array.from(document.querySelectorAll("#display a"));
        for (const item of tasklink) {
            const link = item.getAttribute("href");
            const id = parseInt(link.match(/\d+$/)?.[0], 10);
            const ss = await ext.storage.sync.get("selectedShow");
            const showsetting = ss.selectedShow;
            if (link.includes("assign")) {
                if (showsetting === "normal") {
                    await StorageUtil.editData('assign_list', "assignId", id, "show", false);
                } else if (showsetting === "deleted") {
                    await StorageUtil.editData('assign_list', "assignId", id, "show", true);
                }
            } else if (link.includes("quiz")) {
                if (showsetting === "normal") {
                    await StorageUtil.editData('quiz_list', "quizId", id, "show", false);
                } else if (showsetting === "deleted") {
                    await StorageUtil.editData('quiz_list', "quizId", id, "show", true);
                }
            }
        }
        rerender();
        deletebutton_count = 5;
    }
    deletebutton.textContent = `表示中の課題を一括表示切り替え(${deletebutton_count})`;
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
            await ext.storage.sync.set({ ["colorSelect_dark_" + value]: input.value }); // 選択した値をローカルストレージに保存
        } else {
            await ext.storage.sync.set({ ["colorSelect_light_" + value]: input.value });
        }
        applyColor(value, input.value);
    });
});



//display appendまで待機
(async () => {
    const savedDisplayShow = (await ext.storage.sync.get(["displayShow"])).displayShow;
    if (savedDisplayShow === undefined) {
        display.setAttribute("hidden", "");
    }
})();

async function rerender() {
    document.querySelector("#display").innerHTML = ""; // 表示をクリア
    const alldata = await StorageUtil.getAllData();
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
ext.storage.sync.get(["displayShow"], (result) => {
    if (result.displayShow === undefined) {
        ext.storage.sync.set({ displayShow: true });
    }
});

const colorDefault_light = ["#90ee90", "#add8e6", "#ffffe0", "#ffffff", "#ffb681", "#ff9090", "#c8c8c8", "#eac1ff"];
const colorDefault_dark = ["#063906", "#12515e", "#57422a", "#000000", "#7c3316", "#821f1f", "#454545", "#4a1745"];
colorTypesValue.map(async (value, index) => {
    const lsName_light = "colorSelect_light_" + value;
    const lsName_dark = "colorSelect_dark_" + value;
    if (!(await ext.storage.sync.get([lsName_light]))[lsName_light]) {
        await ext.storage.sync.set({ [lsName_light]: colorDefault_light[index] });
    }
    if (!(await ext.storage.sync.get([lsName_dark]))[lsName_dark]) {
        await ext.storage.sync.set({ [lsName_dark]: colorDefault_dark[index] });
    }
});
