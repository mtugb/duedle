setupT_quiz_list = () => {
    if (taskdb.objectStoreNames.contains("quiz_list")) {
        taskdb.deleteObjectStore("quiz_list");
    }

    const quiz_objectStore = taskdb.createObjectStore("quiz_list", {
        keyPath: "quizId"
    });
    // quiz_objectStore にどのようなデータ項目を格納するかを定義します。
    quiz_objectStore.createIndex("courseName", "courseName", { unique: false });
    quiz_objectStore.createIndex("quizName", "quizName", { unique: false });
    quiz_objectStore.createIndex("start", "start", { unique: false });
    quiz_objectStore.createIndex("submit", "submit", { unique: false });
    quiz_objectStore.createIndex("due", "due", { unique: false });
    quiz_objectStore.createIndex("point", "point", { unique: false });
    quiz_objectStore.createIndex("required", "required", { unique: false });
    quiz_objectStore.createIndex("maxp", "maxp", { unique: false });
    quiz_objectStore.createIndex("count", "count", { unique: false });
    quiz_objectStore.createIndex("maxcount", "maxcount", { unique: false });
    quiz_objectStore.createIndex("status", "status", { unique: false });
}

displaybox_quiz_list = (data) => {
    const quiz = document.createElement("div");
    quiz.classList.add("quiz");
    display.appendChild(quiz);
    const type = document.createElement("div");
    type.classList.add("type");
    quiz.appendChild(type);
    type.textContent = "小テスト";
    const course = document.createElement("div");
    course.classList.add("title");
    quiz.appendChild(course);
    const courseName = data.courseName;
    course.textContent = courseName.match(/^(.+?)\s\d/)[1].trim();

    const quizbox = document.createElement("div");
    quizbox.classList.add("quizbox");
    quiz.appendChild(quizbox);
    const url = "https://cms7.ict.nitech.ac.jp/moodle40a/mod/quiz/view.php?id=" + data.quizId;
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("target", "_blank");
    link.textContent = data.quizName;
    quizbox.appendChild(link);

    const info = document.createElement("div");
    info.classList.add("info");
    quiz.appendChild(info);
    const infoul = document.createElement("ul");
    info.appendChild(infoul);
    const startli = document.createElement("li");
    startli.textContent = "開始: " + (data.start ? new Date(data.start).toLocaleString() : "不明");
    infoul.appendChild(startli);
    const dueli = document.createElement("li");
    dueli.textContent = "期限: " + (data.due ? new Date(data.due).toLocaleString() : "不明");
    infoul.appendChild(dueli);
    const point = data.point ? data.point : "不明";
    const maxpoint = data.maxp ? data.maxp : "不明";
    const pointli = document.createElement("li");
    pointli.textContent = "得点: " + point + " / " + maxpoint;
    infoul.appendChild(pointli);
    const required = data.required ? data.required : "なし";
    const requiredli = document.createElement("li");
    requiredli.textContent = "必要点数: " + required;
    infoul.appendChild(requiredli);
    const count = data.count ? data.count : "0";
    const maxcount = data.maxcount ? data.maxcount : "なし";
    const countli = document.createElement("li");
    countli.textContent = "受験回数: " + count + " / " + maxcount;
    infoul.appendChild(countli);
    const statusli = document.createElement("li");
    infoul.appendChild(statusli);
    //time
    const remain = data.due ? Math.ceil((data.due - Date.now()) / (1000 * 60 * 60 * 24)) : null;
    switch (data.status) {
        case "complete":
            statusli.textContent = "状態: 満点";
                quiz.classList.add("complete"); //cssの関係でcompleteクラスを流用
                course.textContent = "✓ " + course.textContent;
            break;
        case "qualify":
            statusli.textContent = "状態: 合格";
            quiz.classList.add("qualify");
            course.textContent = "〇 " + course.textContent;
            break;
        case "incomplete":
            statusli.textContent = "状態: 未完了";
            break;
        case "stuck":
            statusli.textContent = "状態: 行き詰まり";
            quiz.classList.add("stuck");
            course.textContent = "☠ " + course.textContent;
            break;
        case "unknown":
            statusli.textContent = "状態: 不明";
            quiz.classList.add("unknown");
            course.textContent = "? " + course.textContent;
            break;
    }
    if (remain !== null) {
        if (remain >= 0 && data.status === "incomplete") {
            if (remain <= 3) {
                quiz.classList.add("warning");
                course.textContent = "⚠️ " + course.textContent;
            } else {
                quiz.classList.add("incomplete");
            }
        } else {
            if (data.status === "incomplete") {
                const statusdisplay = "期限切れ";
                statusli.textContent = "状態: " + statusdisplay;
                quiz.classList.add("expired");
                course.textContent = "❌ " + course.textContent;
                data.status = "expired";
            }
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