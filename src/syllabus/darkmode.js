(() => {
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
})();
