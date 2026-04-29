console.log("update");
const MAX_HISTORY_LENGTH = 10;
(async () => {
  let history = (await ext.storage.local.get("history")).history || [];
  let title = document.title;
  let url = location.href;
  if (!title || !url) {
    alert("ページのタイトルまたはURLの取得に失敗しました。");
    return;
  }
  //重複削除
  history = history.filter((e) => e.url.trim() !== url.trim());
  history.push({
    title,
    url,
  });
  if (history.length > MAX_HISTORY_LENGTH) {
    history.shift();
  }
  ext.storage.local.set({ history });
})();
