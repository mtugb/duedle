//inside filter div
filter.classList.add("filter-group", "my-2", "p-2", "border-radius", "border");
const fieldset = document.createElement("fieldset");
filter.appendChild(fieldset);
/*
const debug = document.createElement("div");
filter.appendChild(debug);
debug.textContent = localStorage.getItem("selectedType");
*/

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
const showValues = ["all","normal","deleted"];
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


//setting color



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
