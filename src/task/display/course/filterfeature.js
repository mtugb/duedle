
displaybox = (data) => {
    let temp = 0;
    data.map(item => {
        //condition
        const savedType = localStorage.getItem("selectedType");
        const savedStatus = localStorage.getItem("selectedStatus");
        const savedDue = localStorage.getItem("selectedDue");
        const savedShow = localStorage.getItem("selectedShow");
        const courseName = document.querySelector("h1").textContent.trim();
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
            if (savedDue === "dueweek" && (remainhours >= 0 || remainhours < 24 * 7)) {
                return;
            }
        }
        if (savedDue === "progressing" && remainhours < 0) {
            return;
        }
        if (temp === 0) {
            display.textContent = "";
        }
        temp++;
        if (item._store === "assign_list") {
            displaybox_assign_list(item);
        } else if (item._store === "quiz_list") {
            displaybox_quiz_list(item);
        }
    });
    checkUnvisited();
};