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

filter.textContent = "フィルタ";
header.after(ext_dashboard);
