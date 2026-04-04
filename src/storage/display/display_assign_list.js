displaybox_assign_list = async (data) => {
    if (data.start) { data.start = new Date(data.start); }
    if (data.due) { data.due = new Date(data.due); }
    const assign = document.createElement("div");
    assign.classList.add("assign");
    display.appendChild(assign);
    const type = document.createElement("div");
    type.classList.add("type");
    assign.appendChild(type);
    type.textContent = "提出課題";
    //showmodifybutton
    if ((await chrome.storage.sync.get(["selectedShow"])).selectedShow !== "all") {
        const btndiv_1 = document.createElement("div");
        btndiv_1.classList.add("col-md-1", "p-0", "d-flex", "menu");
        type.appendChild(btndiv_1);
        const btndiv_2 = document.createElement("div");
        btndiv_2.classList.add("ml-auto", "dropdown");
        btndiv_1.appendChild(btndiv_2);
        const btnin = document.createElement("button");
        btnin.classList.add("btn", "btn-link", "btn-icon", "icon-size-3", "coursemenubtn");
        btnin.setAttribute("type", "button");
        btnin.setAttribute("data-toggle", "dropdown");
        btnin.setAttribute("aria-haspopup", "true");
        btnin.setAttribute("aria-expanded", "false");
        btndiv_2.appendChild(btnin);
        const icon = document.createElement("i");
        icon.classList.add("icon", "fa", "fa-ellipsis-v", "fa-fw", "m-0");
        icon.setAttribute("aria-hidden", "true");
        btnin.appendChild(icon);
        const dropdiv = document.createElement("div");
        dropdiv.classList.add("dropdown-menu", "dropdown-menu-right");
        dropdiv.setAttribute("style", "will-change: transform;");
        btndiv_2.appendChild(dropdiv);
        const menu = document.createElement("a");
        menu.href = "#";
        if (data.show) {
            menu.addEventListener("click", async (e) => {
                await editData('assign_list', "assignId", data.assignId, "show", false);
                e.target.closest(".assign").remove();
            });
            menu.textContent = "一覧から削除する";
        } else {
            menu.addEventListener("click", async (e) => {
                await editData('assign_list', "assignId", data.assignId, "show", true);
                e.target.closest(".assign").remove();
            });
            menu.textContent = "一覧に戻す";
        }

        dropdiv.appendChild(menu);

    }
    const course = document.createElement("div");
    course.classList.add("title");
    assign.appendChild(course);
    const courseName = data.courseName;
    course.textContent = courseName.match(/^(.+?)\s\d/)[1].trim();

    const assignbox = document.createElement("div");
    assignbox.classList.add("assignbox");
    assign.appendChild(assignbox);
    const url = "https://cms7.ict.nitech.ac.jp/moodle40a/mod/assign/view.php?id=" + data.assignId;
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.textContent = data.assignName;
    assignbox.appendChild(link);

    const info = document.createElement("div");
    info.classList.add("info");
    assign.appendChild(info);
    const infoul = document.createElement("ul");
    info.appendChild(infoul);
    const startli = document.createElement("li");
    startli.textContent = "開始: " + (data.start ? new Date(data.start).toLocaleString() : "不明");
    infoul.appendChild(startli);
    const dueli = document.createElement("li");
    dueli.textContent = "期限: " + (data.due ? new Date(data.due).toLocaleString() : "不明");
    infoul.appendChild(dueli);
    const filename = data.file ? data.file : "不明";
    const filenameli = document.createElement("li");
    filenameli.textContent = "最初のファイル名: " + filename;
    infoul.appendChild(filenameli);
    const filenumli = document.createElement("li");
    filenumli.textContent = "提出ファイル数: " + data.filenum;
    infoul.appendChild(filenumli);
    const statusli = document.createElement("li");
    infoul.appendChild(statusli);

    setremain = () => {
        const remain = data.due ? Math.ceil((data.due - Date.now()) / (1000 * 60 * 60 * 24)) : null;
        if (data.status !== "complete" && remain !== null && remain < 0) {
            data.status = "expired";
        }
        const remainoutput = formatRemainingTime(data.due);
        if (remain !== null) {
            const remainli = document.createElement("li");
            infoul.appendChild(remainli);
            remainli.textContent = remainoutput;
        } else {
            const remainli = document.createElement("li");
            infoul.appendChild(remainli);
            remainli.textContent = "残り時間: 不明";
        }
        return remain;

    }
    const remain = setremain();


    switch (data.status) {
        case "complete":
            statusli.textContent = "状態: 提出済み";
            assign.classList.add("complete"); //cssの関係でcompleteクラスを流用
            course.textContent = "✓ " + course.textContent;
            break;
        case "incomplete":
            statusli.textContent = "状態: 未提出";
            assign.classList.add("incomplete");
            break;
        case "warning":
            statusli.textContent = "状態: 要注意";
            course.textContent = "⚠️ " + course.textContent;
            assign.classList.add("warning");
            break;
        case "expired":
            statusli.textContent = "状態: 期限切れ";
            assign.classList.add("expired");
            course.textContent = "❌ " + course.textContent;
            break;
        case "unknown":
            statusli.textContent = "状態: 不明";
            assign.classList.add("unknown");
            course.textContent = "? " + course.textContent;
            break;
    }


}
