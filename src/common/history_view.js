(async () => {
  console.log("view");
  let cl = document.querySelector(".columnleft");
  if (!(cl instanceof HTMLElement)) {
    console.error("not a htmlelement");
    return;
  }

  let history = (await chrome.storage.local.get("history")).history || [];
  console.log({ history });

  //html
  let myboxHtml = `
    <section
      id="mybox001"
      class=" block_html block  card mb-3"
      role="complementary"
    >
      <div class="card-body p-3">
        <h5>最近開いたページ</h5>
        <ul>
          ${history
            .slice()
            .reverse()
            .map(({ title, url }) => {
              //html
              return `<li><a href="${url}">${title}</a></li>`;
            })
            .join("\n")}
        </ul>
      </div>
    </section>
  `;

  if (cl) cl.insertAdjacentHTML("afterbegin", myboxHtml);
})();
