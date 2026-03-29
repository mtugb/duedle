setupT_assign_list = () => {
    if (taskdb.objectStoreNames.contains("assign_list")) {
        taskdb.deleteObjectStore("assign_list");
    }

    const assign_objectStore = taskdb.createObjectStore("assign_list", {
        keyPath: "assignId"
    });
    // assign_objectStore にどのようなデータ項目を格納するかを定義します。
    assign_objectStore.createIndex("courseName", "courseName", { unique: false });
    assign_objectStore.createIndex("assignName", "assignName", { unique: false });
    assign_objectStore.createIndex("start", "start", { unique: false });
    assign_objectStore.createIndex("submit", "submit", { unique: false });
    assign_objectStore.createIndex("due", "due", { unique: false });
    assign_objectStore.createIndex("file", "file", { unique: false });
    assign_objectStore.createIndex("filenum", "filenum", { unique: false });
    assign_objectStore.createIndex("status", "status", { unique: false });
    assign_objectStore.createIndex("show", "show", { unique: false });
}

displaybox_assign_list = (data) => {
    const assign = document.createElement("div");
    assign.classList.add("assign");
    display.appendChild(assign);
    const type = document.createElement("div");
    type.classList.add("type");
    assign.appendChild(type);
    type.textContent = "提出課題";
    //showmodifybutton
    if (localStorage.getItem("selectedShow") !== "all") {
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
        menu.href="#";
        if (data.show) {
            menu.addEventListener("click", (e) => {
                updateData('assign_list', data.assignId, false);
                e.target.closest(".assign").remove();
            });
            menu.textContent = "一覧から削除する";
        } else {
            menu.addEventListener("click", (e) => {
                updateData('assign_list', data.assignId, true);
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
    const remain = data.due ? Math.ceil((data.due - Date.now()) / (1000 * 60 * 60 * 24)) : null;
    if (remain !== null) {
        if (remain > 0) {
            const statusdisplay = data.status === "complete" ? "完了" : "未提出";
            statusli.textContent = "状態: " + statusdisplay;
            if (data.status === "complete") {
                assign.classList.add("complete");
                course.textContent = "✓ " + course.textContent;
            } else if (remain <= 3) {
                assign.classList.add("warning");
                course.textContent = "⚠️ " + course.textContent;
            } else {
                assign.classList.add("incomplete");
            }
        } else if (remain === 0) {
            if (data.status === "complete") {
                const statusdisplay = "完了";
                statusli.textContent = "状態: " + statusdisplay;
                assign.classList.add("complete");
                course.textContent = "✓ " + course.textContent;
            } else {
                const statusdisplay = "未提出";
                statusli.textContent = "状態: " + statusdisplay;
                course.textContent = "⚠️ " + course.textContent;
                assign.classList.add("warning");
            }
        } else {
            if (data.status === "complete") {
                const statusdisplay = "完了";
                statusli.textContent = "状態: " + statusdisplay;
                assign.classList.add("complete");
                course.textContent = "✓ " + course.textContent;
            } else {

                const statusdisplay = "期限切れ";
                statusli.textContent = "状態: " + statusdisplay;
                assign.classList.add("expired");
                course.textContent = "❌ " + course.textContent;
            }
        }
    } else {
            if (data.status === "complete") {
                const statusdisplay = "完了";
                statusli.textContent = "状態: " + statusdisplay;
                assign.classList.add("complete");
                course.textContent = "✓ " + course.textContent;
            } else {
                const statusdisplay = "未提出";
                statusli.textContent = "状態: " + statusdisplay;
                assign.classList.add("incomplete");
            }
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
}
