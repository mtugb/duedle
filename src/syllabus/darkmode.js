(() => {
  const colored_td = document.querySelectorAll('td[bgcolor="lightsteelblue"]');
  colored_td.forEach((e) => {
    e.setAttribute("bgcolor", "black");
    e.style.color = "white";
  });
})();
