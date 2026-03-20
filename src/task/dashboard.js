const header = document.querySelector("header");
const ext_dashboard = document.createElement("div");
ext_dashboard.setAttribute("id", "ext_dashboard");
ext_dashboard.classList.add("card-body");
//inside div
const filter = document.createElement("div");
filter.setAttribute("id", "filter");
ext_dashboard.appendChild(filter);
const display = document.createElement("div");
display.setAttribute("id", "display");
ext_dashboard.appendChild(display);

filter.textContent = "フィルタ機能は現在開発中です。";
displayData = () => {
    // データベースからすべてのデータを取得するためのトランザクションを開始します。
    const objectStore = db.transaction("assign_list").objectStore("assign_list");
    objectStore.openCursor().addEventListener("success", (e) => {
        // カーソルへの参照を取得します。
        const cursor = e.target.result;

        // 反復処理を行うべき別のデータ項目がまだあれば、このコードを実行し続けます。
        if (cursor) {
            displaybox(cursor);
            cursor.continue();
        } else {
            console.log("All displayed");
        }
    });
};
displaybox = (cursor) => {
    const assign = document.createElement("div");
    assign.classList.add("assign");
    display.appendChild(assign);

    const course = document.createElement("div");
    course.classList.add("title");
    assign.appendChild(course);
    const courseName = cursor.value.courseName;
    course.textContent = courseName.match(/^(.+?)\s\d/)[1].trim();

    const assignbox = document.createElement("div");
    assignbox.classList.add("assignbox");
    assign.appendChild(assignbox);
    const url = "https://cms7.ict.nitech.ac.jp/moodle40a/mod/assign/view.php?id=" + cursor.value.assignId;
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("target", "_blank");
    link.textContent = cursor.value.assignName;
    assignbox.appendChild(link);

    const info = document.createElement("div");
    info.classList.add("info");
    assign.appendChild(info);
    const infoul = document.createElement("ul");
    info.appendChild(infoul);
    const startli = document.createElement("li");
    startli.textContent = "開始: " + (cursor.value.start ? new Date(cursor.value.start).toLocaleString() : "不明");
    infoul.appendChild(startli);
    const dueli = document.createElement("li");
    dueli.textContent = "期限: " + (cursor.value.due ? new Date(cursor.value.due).toLocaleString() : "不明");
    infoul.appendChild(dueli);
    const filename = cursor.value.file ? cursor.value.file : "不明";
    const filenameli = document.createElement("li");
    filenameli.textContent = "最初のファイル名: " + filename;
    infoul.appendChild(filenameli);
    const filenumli = document.createElement("li");
    filenumli.textContent = "提出ファイル数: " + cursor.value.filenum;
    infoul.appendChild(filenumli);
    const statusli = document.createElement("li");
    infoul.appendChild(statusli);

    const remain = cursor.value.due ? Math.ceil((cursor.value.due - Date.now()) / (1000 * 60 * 60 * 24)) : null;
    if (remain !== null) {
        if (remain > 0) {
            const statusdisplay = cursor.value.status === "complete" ? "完了" : "未完了";
            statusli.textContent = "状態: " + statusdisplay;
            const remainli = document.createElement("li");
            infoul.appendChild(remainli);
            remainli.textContent = "残り日数: " + remain + "日";
            if (cursor.value.status === "complete") {
                assign.classList.add("complete");
                course.textContent = "✓ " + course.textContent;
            } else if (remain <= 3) {
                assign.classList.add("warning");
                course.textContent = "⚠️ " + course.textContent;
            } else {
                assign.classList.add("incomplete");
            }
        } else if (remain === 0) {
            if (cursor.value.status === "complete") {
                const statusdisplay = "完了";
                statusli.textContent = "状態: " + statusdisplay;
                assign.classList.add("complete");
                course.textContent = "✓ " + course.textContent;
            } else {
                const statusdisplay = "未完了";
                statusli.textContent = "状態: " + statusdisplay;
                course.textContent = "⚠️ " + course.textContent;
                const remainli = document.createElement("li");
                infoul.appendChild(remainli);
                remainli.textContent = "期限が今日までです！";
                assign.classList.add("warning");
            }
        } else {
            if (cursor.value.status === "complete") {
                const statusdisplay = "完了";
                statusli.textContent = "状態: " + statusdisplay;
                assign.classList.add("complete");
                course.textContent = "✓ " + course.textContent;
            } else {

                const statusdisplay = "期限切れ";
                statusli.textContent = "状態: " + statusdisplay;
                assign.classList.add("expired");
                course.textContent = "❌ " + course.textContent;
                const remainli = document.createElement("li");
                infoul.appendChild(remainli);
                remainli.textContent = "期限を過ぎています！";
            }
        }
    }
}

header.after(ext_dashboard);
