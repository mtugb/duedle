//inside filter div
filter.classList.add("filter-group", "my-2", "p-2", "border-radius", "border");
const fieldset = document.createElement("fieldset");
filter.appendChild(fieldset);
const fieldcolor = document.createElement("fieldset");
fieldcolor.classList.add("fieldcolor");
filter.appendChild(fieldcolor);
/*
const debug = document.createElement("div");
filter.appendChild(debug);
debug.textContent = localStorage.getItem("selectedType");
*/

//display show button
const displaybutton = document.createElement("button");
displaybutton.classList.add("btn", "btn-secondary");
displaybutton.id = "displaybutton";
displaybutton.textContent = "リスト表示を切り替える"
displaybutton.addEventListener("click", () => {
    if (!display.hasAttribute("hidden")) {
        display.setAttribute("hidden", "");
    } else {
        display.removeAttribute("hidden");
    }
    localStorage.setItem("displayShow", !display.hasAttribute("hidden")); //type!=boolean
});


//type filter
const typeValues = ["all", "assign_list", "quiz_list"];
const typeOptionsText = ["すべて", "提出課題", "小テスト"];
const typeSelect = document.createElement("select");
typeSelect.id = "typeSelect";
typeSelect.classList.add("form-select", "form-select-sm", "w-auto", "custom-select", "mb-1", "mb-md-0", "mr-md-2");
const typeLabel = document.createElement("label");
typeLabel.textContent = "種類";
typeLabel.setAttribute("for", "typeSelect");
typeLabel.classList.add("filterlabel", "mr-md-2", "mb-md-0");
fieldset.appendChild(typeLabel);
fieldset.appendChild(typeSelect);
const typeOptions = typeValues.map((value, index) => {
    const option = document.createElement("option");
    option.value = value;
    option.textContent = typeOptionsText[index];
    return option;
});
typeOptions.forEach(option => typeSelect.appendChild(option));


//status filter
const status = ["すべて", "完了", "合格(小テストのみ)", "未提出", "行き詰まり(小テストのみ)", "期限切れ", "点数不明(小テストのみ)"];
const statusValues = ["all", "complete", "qualify", "incomplete", "stuck", "expired", "unknown"];
const statusSelect = document.createElement("select");
statusSelect.id = "statusSelect";
statusSelect.classList.add("form-select", "form-select-sm", "w-auto", "custom-select", "mb-1", "mb-md-0", "mr-md-2");
const statusLabel = document.createElement("label");
statusLabel.textContent = "状態";
statusLabel.setAttribute("for", "statusSelect");
statusLabel.classList.add("filterlabel", "mr-md-2", "mb-md-0");
fieldset.appendChild(statusLabel);
fieldset.appendChild(statusSelect);
const statusOptions = statusValues.map((value, index) => {
    const option = document.createElement("option");
    option.value = value;
    option.textContent = status[index];
    return option;
});
statusOptions.forEach(option => statusSelect.appendChild(option));

//due filter
const dueValues = ["all", "progressing", "week", "today", "dueweek", "overdue"];
const dueOptionsText = ["すべて", "進行中", "今週", "24時間以内", "1週間前までに終了", "終了"];
const dueSelect = document.createElement("select");
dueSelect.id = "dueSelect";
dueSelect.classList.add("form-select", "form-select-sm", "w-auto", "custom-select", "mb-1", "mb-md-0", "mr-md-2");
const dueLabel = document.createElement("label");
dueLabel.textContent = "期限";
dueLabel.setAttribute("for", "dueSelect");
dueLabel.classList.add("filterlabel", "mr-md-2", "mb-md-0");
fieldset.appendChild(dueLabel);
fieldset.appendChild(dueSelect);
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
const showSelect = document.createElement("select");
showSelect.id = "showSelect";
showSelect.classList.add("form-select", "form-select-sm", "w-auto", "custom-select", "mb-1", "mb-md-0", "mr-md-2");
const showLabel = document.createElement("label");
showLabel.textContent = "表示状態";
showLabel.setAttribute("for", "showSelect");
showLabel.classList.add("filterlabel", "mr-md-2", "mb-md-0");
fieldset.appendChild(showLabel);
fieldset.appendChild(showSelect);
const showOptions = showValues.map((value, index) => {
    const option = document.createElement("option");
    option.value = value;
    option.textContent = showOptionsText[index];
    return option;
});
showOptions.forEach(option => showSelect.appendChild(option));

fieldset.appendChild(displaybutton);

//filter effect
typeSelect.addEventListener("change", () => {
    localStorage.setItem("selectedType", typeSelect.value); // 選択した値をローカルストレージに保存
    document.querySelector("#display").innerHTML = ""; // 表示をクリア
    displayData(); // データを再表示
});
statusSelect.addEventListener("change", () => {
    localStorage.setItem("selectedStatus", statusSelect.value); // 選択した値をローカルストレージに保存
    document.querySelector("#display").innerHTML = ""; // 表示をクリア
    displayData(); // データを再表示
});
dueSelect.addEventListener("change", () => {
    localStorage.setItem("selectedDue", dueSelect.value); // 選択した値をローカルストレージに保存
    document.querySelector("#display").innerHTML = ""; // 表示をクリア
    displayData(); // データを再表示
});
showSelect.addEventListener("change", () => {
    localStorage.setItem("selectedShow", showSelect.value); // 選択した値をローカルストレージに保存
    document.querySelector("#display").innerHTML = ""; // 表示をクリア
    displayData(); // データを再表示
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

    input.addEventListener("change", () => {
        if (document.querySelector(".darkmode")) {
            localStorage.setItem("colorSelect_dark_" + value, input.value); // 選択した値をローカルストレージに保存
        } else {
            localStorage.setItem("colorSelect_light_" + value, input.value);
        }
        applyColor(value, input.value);
    });
});





// ページ読み込み時にローカルストレージから選択状態を復元
window.addEventListener("load", () => {
    const savedType = localStorage.getItem("selectedType");
    const savedStatus = localStorage.getItem("selectedStatus");
    const savedDue = localStorage.getItem("selectedDue");
    const savedShow = localStorage.getItem("selectedShow");
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
const savedDisplayShow = localStorage.getItem("displayShow");
if (savedDisplayShow === "false") {
    display.setAttribute("hidden", "");
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
const colorReload = () => {
    colorTypesValue.map((value, index) => {
        const query = document.querySelector("#colorSelect_" + value);
        query.value = document.querySelector(".darkmode") ? localStorage.getItem("colorSelect_dark_" + value) : localStorage.getItem("colorSelect_light_" + value);
        applyColor(value, query.value);
    });
};

//初期状態のlocalstorage
if (!localStorage.getItem("selectedType")) {
    localStorage.setItem("selectedType", "all");
}
if (!localStorage.getItem("selectedStatus")) {
    localStorage.setItem("selectedStatus", "all");
}
if (!localStorage.getItem("selectedDue")) {
    localStorage.setItem("selectedDue", "all");
}
if (!localStorage.getItem("selectedShow")) {
    localStorage.setItem("selectedShow", "normal");
}
if (!localStorage.getItem("displayShow")) {
    localStorage.setItem("displayShow", true);
}
const colorDefault_light = ["#90ee90", "#add8e6", "#ffffe0", "#ffffff", "#ffb681", "#ff9090", "#c8c8c8", "#eac1ff"];
const colorDefault_dark = ["#063906", "#12515e", "#57422a", "#000000", "#7c3316", "#821f1f", "#454545", "#4a1745"];
colorTypesValue.map((value, index) => {
    const lsName_light = "colorSelect_light_" + value;
    const lsName_dark = "colorSelect_dark_" + value;
    if (!localStorage.getItem(lsName_light)) {
        localStorage.setItem(lsName_light, colorDefault_light[index]);
    }
    if (!localStorage.getItem(lsName_dark)) {
        localStorage.setItem(lsName_dark, colorDefault_dark[index]);
    }

});

