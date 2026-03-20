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
  objectStore.openCursor().addEventListener("success",  (e) => {
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
  const title = document.createElement("div");
  title.classList.add("title");
  assign.appendChild(title);

  const courseName = cursor.value.courseName;
  title.textContent = courseName.match(/^(.+?)\s\d{6,}/) + ": " + cursor.value.assignName;

  const info = document.createElement("div");
  info.classList.add("info");
  assign.appendChild(info);
  info.textContent = "開始日時: " + (cursor.value.start ? new Date(cursor.value.start).toLocaleString() : "不明") + "締切日時: " + (cursor.value.due ? new Date(cursor.value.due).toLocaleString() : "不明") + " 提出ファイル数: " + cursor.value.filenum + " ステータス: " + cursor.value.status;
  display.appendChild(assign);
}

header.after(ext_dashboard);
