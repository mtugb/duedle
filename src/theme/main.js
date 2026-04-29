const syncDarkmode = async () => {
  //0:sync
  //1:darkmode, 2:light, 3:honobono
  let thememode = (await ext.storage.local.get("thememode")).thememode ?? 0;
  let shouldBeDarkmode =
    (thememode == 0 && isBrowserDarkMode()) || thememode == 1;
  if (shouldBeDarkmode) {
    console.log("darkmode power on");
    document.body.classList.add("darkmode");
    const colored_tr = document.querySelectorAll('tr[bgcolor="lightblue"]');
    console.log(colored_tr);
    colored_tr.forEach((e) => {
      e.setAttribute("bgcolor", "#363f45");
      e.style.color = "white";
    });
  } else if (thememode == 3) {
    try {
      document.body.classList.remove("darkmode");
      document.body.classList.add("honobono");
    } catch (_) {
      //エラー無視
    }
  } else {
    try {
      document.body.classList.remove("darkmode");
      document.body.classList.remove("honobono");
    } catch (_) {
      //エラー無視
    }
  }
  try { colorReload(); } catch (_) {
    //ignore
  }
  // ext.storage.local.set({ history });
};
syncDarkmode();
(async () => {
  let theme_conf = (await ext.storage.local.get("thememode")).thememode ?? 0;
  console.log({ theme_conf });
  //html
  let thememode_selection_html = `
    <select title="テーマの設定" id="thememode_selection" class="btn btn-outline-secondary dropdown-toggle icon-no-margin">
      <option value="0" ${theme_conf === 0 ? "selected" : ""}>🔄ブラウザと同期</option>
      <option value="1" ${theme_conf === 1 ? "selected" : ""}>🌙ダークモード</option>
      <option value="2" ${theme_conf === 2 ? "selected" : ""}>☀ライトモード</option>
      <option value="3" ${theme_conf === 3 ? "selected" : ""}>ほのぼのモード</option>
    </select>
  `;
  document
    .getElementById("usernavigation")
    .insertAdjacentHTML("beforeend", thememode_selection_html);
  document
    .getElementById("thememode_selection")
    .addEventListener("change", (e) => {
      ext.storage.local.set({ thememode: Number(e.target.value) });
      syncDarkmode();
    });

  // ext.storage.local.set({ history });
})();

function isBrowserDarkMode() {
  return (
    window.matchMedia &&
    window.matchMedia("(prefers-color-scheme: dark)").matches
  );
}
