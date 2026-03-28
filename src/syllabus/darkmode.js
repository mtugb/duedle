const darkmode_setup = () => {
  const colored_td = document.querySelectorAll('td[bgcolor="lightsteelblue"]');
  colored_td.forEach((e) => {
    e.setAttribute("bgcolor", "black");
    e.style.color = "white";
  });
  const colored_div = document.querySelectorAll("tr > td > div[style]");
  colored_div.forEach((e) => {
    let new_style = e
      .getAttribute("style")
      .replaceAll("lightsteelblue", "black");
    e.setAttribute("style", new_style);
  });
};

(async () => {
  //0:sync
  //1:on, 2:off
  let darkmode = (await chrome.storage.local.get("darkmode")).darkmode ?? 0;
  let shouldBeDarkmode =
    (darkmode == 0 && isBrowserDarkMode()) || darkmode == 1;
  if (shouldBeDarkmode) {
    document.body.classList.add("darkmode");
    darkmode_setup();
  } else {
    try {
      document.body.classList.remove("darkmode");
    } catch (_) {
      //エラー無視
    }
  }
  // chrome.storage.local.set({ history });
})();
