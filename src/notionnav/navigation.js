const nav_div = document.createElement("div");
nav_div.classList.add("card-body","p-3","block","card","mb-3");
nav_div.setAttribute("id","notion");


const placepos = document.querySelector(".columnright");
placepos.classList.add("has-blocks");
placepos.appendChild(nav_div);

const movepos = document.querySelector("#page-content");
movepos.classList.add("blocks-post");

//navStructure
const navtitle = document.createElement("h5");
navtitle.classList.add("card-title","d-inline");
navtitle.textContent = "セクション一覧";
nav_div.appendChild(navtitle);
const navtext = document.createElement("div");
navtext.classList.add("card-text","content","mt-2");
nav_div.appendChild(navtext);

//sectionList
const sectionNameList = Array.from(document.querySelectorAll("h3.sectionname"));
sectionNameList.map((item) => {
    const link = document.createElement("a");
    link.classList.add("notionnavlink");
    const id = item.getAttribute("id");
    const url = window.location.href.split('#')[0];
    link.textContent = item.textContent;
    link.setAttribute("href",url+"#"+id);
    navtext.appendChild(link);
    navtext.appendChild(document.createElement("br"));
});