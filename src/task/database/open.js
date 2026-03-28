let taskdb;
const taskdb_openRequest = indexedDB.open("task_db", 6);
// error ハンドラーは、データベースがうまく開けなかったことを意味します。
taskdb_openRequest.addEventListener("error", (e) => {
  console.error("error", e);
});

// success ハンドラーは、データベースがうまく開けたことを意味します。
taskdb_openRequest.addEventListener("success", () => {
  console.log("Database opened successfully");

  // 開いたデータベースオブジェクトを db という変数に記憶します。これは以降で頻繁に使われます。
  taskdb = taskdb_openRequest.result;

    // IDB 内の既存のメモ書きを表示するために、 displayData() 関数を実行します。 -> この内容はdashboard.jsで実行
    if(document.URL.match(/my/)||document.URL.match(/course/)){
     displayData();
    }
});

taskdb_openRequest.addEventListener("blocked", () => {
  console.log("blocked!");
});

// データベースのテーブルがまだ存在しない場合は、それを設定します。
taskdb_openRequest.addEventListener("upgradeneeded", (e) => {
  // 開いたデータベースの参照を取得します。
  taskdb = e.target.result;

  setupT_assign_list();
  setupT_quiz_list();

  console.log("Database setup complete");
});

//displayData
displayData = () => {
  display.textContent = "表示するものがありません";
    // データベースからすべてのデータを取得するためのトランザクションを開始します。
    const storeNames = ["assign_list", "quiz_list"];

    getAllData(taskdb, storeNames)
        .then(data => {
            const sorted = sortByDeadline(data);
            displaybox(sorted);
        });
}