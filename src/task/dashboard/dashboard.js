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

filter.textContent = "フィルタ";
displayData_dashboard = () => {
    // データベースからすべてのデータを取得するためのトランザクションを開始します。
    const storeNames = ["assign_list", "quiz_list"];

    getAllData(taskdb, storeNames)
        .then(data => {
            const sorted = sortByDeadline(data);
            displaybox(sorted);
        });
}

displaybox = (data) => {
    data.map(item => {
        //condition
        const savedType = localStorage.getItem("selectedType");
        const savedStatus = localStorage.getItem("selectedStatus");
        const savedDue = localStorage.getItem("selectedDue");
        if (savedType !== "all" && item._store !== savedType) {
            return; // タイプが一致しない場合はスキップ
        }
        if (savedStatus !== "all" && item.status !== savedStatus) {
            return; // 状態が一致しない場合はスキップ
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
        }
        if (savedDue === "progressing" && remainhours < 0) {
            return;
        }

        if (item._store === "assign_list") {
            displaybox_assign_list(item);
        } else if (item._store === "quiz_list") {
            displaybox_quiz_list(item);
        }
    });
};

header.after(ext_dashboard);
