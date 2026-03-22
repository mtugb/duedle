const { html, render } = require("lit-html");

onload = () => {
  alert("history.js");
  let cl = document.querySelector(".columnleft");
  console.log({ cl });
  if (!(cl instanceof HTMLElement)) {
    console.error("not a htmlelement");
    return;
  }

  let myboxHtml = html`
    <section
      id="mybox001"
      class=" block_html block  card mb-3"
      role="complementary"
    >
      <div class="card-body p-3">
        <h5 class="card-title d-inline">コース検索dayo</h5>
        <div class="card-text content mt-3">
          <div class="no-overflow">
            <p dir="ltr" style="text-align: center;">
              <span style="font-size: calc(0.90375rem + 0.045vw);"
                ><a
                  href="https://cms7.ict.nitech.ac.jp/moodle40a/course/course_search.php"
                  >コース検索</a
                ></span
              >
            </p>
          </div>
          <div class="footer"></div>
        </div>
      </div>
    </section>
  `;

  render(myboxHtml, cl);
  // cl.insertAdjacentHTML("afterbegin", myboxHtml);
};
