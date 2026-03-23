function hide_tabs() {
  const tabs = document.querySelectorAll(
    ".btn.btn-icon.mr-1.icons-collapse-expand.justify-content-center.stretched-link.collapsed",
  );
  tabs.forEach((el) => {
    const tab = el.closest(".section.course-section.main.clearfix");
    if (tab) {
      if (show_closed_tabs) {
        tab.style.display = "";
      } else {
        tab.style.display = "none";
      }
    }
  });
}

function create_button() {
  //html
  const mybtn = `
    <section
      id="toggle_visible_form"
      class=" block_html block  card mb-3"
      role="complementary"
    >
      <div 
    class="card-body p-3"
    style="display:flex;justify-content:space-between;align-items:center;"
        >
        閉じたタブの表示
        <label class="switch" style="--size:18px;margin:0">
          <input type="checkbox" id="toggle_visible" checked hidden />
        </label>
      </div>
    </section>
  `;

  const titles = document.querySelectorAll("h5");
  let card = null;

  titles.forEach((el) => {
    if (el.textContent === "シラバス") {
      card = el.closest(".card");
    } else if (el.textContent === "管理") {
      card = el.closest(".card");
    }
  });
  if (card) {
    card.insertAdjacentHTML("beforebegin", mybtn);
  }

  document.getElementById("toggle_visible").addEventListener("change", (e) => {
    show_closed_tabs = e.currentTarget.checked;
    save();
    hide_tabs();
  });
}

function save() {
  localStorage.setItem("hide", show_closed_tabs);
}

let show_closed_tabs = localStorage.getItem("hide") !== "false";
create_button();
hide_tabs();

const tabs = document.querySelectorAll(
  ".btn.btn-icon.mr-1.icons-collapse-expand.justify-content-center.stretched-link",
);
tabs.forEach((el) => {
  el.addEventListener("click", () => {
    setTimeout(hide_tabs, 0);
  });
});
