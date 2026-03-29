const syncDarkmode = async () => {
  //0:sync
  //1:on, 2:off
  let darkmode = (await chrome.storage.local.get("darkmode")).darkmode ?? 0;
  let shouldBeDarkmode =
    (darkmode == 0 && isBrowserDarkMode()) || darkmode == 1;
  if (shouldBeDarkmode) {
    console.log("darkmode power on");
    document.body.classList.add("darkmode");
    const colored_tr = document.querySelectorAll('tr[bgcolor="lightblue"]');
    console.log(colored_tr);
    colored_tr.forEach((e) => {
      e.setAttribute("bgcolor", "#363f45");
      e.style.color = "white";
    });
  } else {
    try {
      document.body.classList.remove("darkmode");
    } catch (_) {
      //エラー無視
    }
  }
  try { colorReload(); } catch (_) {
    //ignore
  }
  // chrome.storage.local.set({ history });
};
syncDarkmode();
(async () => {
  let dark_conf = (await chrome.storage.local.get("darkmode")).darkmode ?? 0;
  console.log({ dark_conf });
  //html
  let darkmode_selection_html = `
    <select title="ダークモードの設定" id="darkmode_selection" class="btn btn-outline-secondary dropdown-toggle icon-no-margin">
      <option value="0" ${dark_conf === 0 ? "selected" : ""}>🔄ブラウザと同期</option>
      <option value="1" ${dark_conf === 1 ? "selected" : ""}>🌙ダークモード</option>
      <option value="2" ${dark_conf === 2 ? "selected" : ""}>☀ライトモード</option>
    </select>
  `;
  document
    .getElementById("usernavigation")
    .insertAdjacentHTML("beforeend", darkmode_selection_html);
  document
    .getElementById("darkmode_selection")
    .addEventListener("change", (e) => {
      chrome.storage.local.set({ darkmode: Number(e.target.value) });
      syncDarkmode();
    });

  // chrome.storage.local.set({ history });
})();

function isBrowserDarkMode() {
  return (
    window.matchMedia &&
    window.matchMedia("(prefers-color-scheme: dark)").matches
  );
}
