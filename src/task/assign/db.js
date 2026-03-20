let db;
const openRequest = window.indexedDB.open("assign_db", 3);
// error ハンドラーは、データベースがうまく開けなかったことを意味します。
openRequest.addEventListener("error", () =>
  console.error("Database failed to open"),
);

// success ハンドラーは、データベースがうまく開けたことを意味します。
openRequest.addEventListener("success", () => {
  console.log("Database opened successfully");

  // 開いたデータベースオブジェクトを db という変数に記憶します。これは以降で頻繁に使われます。
  db = openRequest.result;

    // IDB 内の既存のメモ書きを表示するために、 displayData() 関数を実行します。
  displayData();
});

// データベースのテーブルがまだ存在しない場合は、それを設定します。
openRequest.addEventListener("upgradeneeded", (e) => {
  // 開いたデータベースの参照を取得します。
  db = e.target.result;

  if (db.objectStoreNames.contains("assign_list")) {
    db.deleteObjectStore("assign_list");
  }

  const objectStore = db.createObjectStore("assign_list", {
    keyPath: "assignId"
  });


  // objectStore にどのようなデータ項目を格納するかを定義します。
  objectStore.createIndex("courseName", "courseName", { unique: false });
  objectStore.createIndex("assignName", "assignName", { unique: false });
  objectStore.createIndex("start", "start", { unique: false });
  objectStore.createIndex("submit", "submit", { unique: false });
  objectStore.createIndex("due", "due", { unique: false });
  objectStore.createIndex("file", "file", { unique: false });
  objectStore.createIndex("filenum", "filenum", { unique: false });
  objectStore.createIndex("status", "status", { unique: false });

  console.log("Database setup complete");
});

