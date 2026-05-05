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
  let thememode = (await ext.storage.local.get("thememode")).thememode ?? 0;
  let shouldBeDarkmode =
    (thememode == 0 && isBrowserDarkMode()) || thememode == 1;
  if (shouldBeDarkmode) {
    document.body.classList.add("darkmode");
    darkmode_setup();
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
  // ext.storage.local.set({ history });
})();
