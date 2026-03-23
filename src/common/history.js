const MAX_HISTORY_LENGTH = 10;
onload = async () => {
  console.log("history.js called");
  let cl = document.querySelector(".columnleft");
  if (!(cl instanceof HTMLElement)) {
    console.error("not a htmlelement");
    return;
  }

  let history = (await chrome.storage.local.get("history")).history || [];
  console.log(history);
  let title = document.title;
  let url = location.href;
  if (!title || !url) {
    alert("ページのタイトルまたはURLの取得に失敗しました。");
    return;
  }
  //重複削除
  history = history.filter((e) => e.url.trim() !== url.trim());
  history.push({
    title,
    url,
  });
  if (history.length > MAX_HISTORY_LENGTH) {
    history.shift();
  }

  //html
  let myboxHtml = `
    <section
      id="mybox001"
      class=" block_html block  card mb-3"
      role="complementary"
    >
      <div class="card-body p-3">
        <h3>最近開いたページ</h3>
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

  cl.insertAdjacentHTML("afterbegin", myboxHtml);

  chrome.storage.local.set({ history });
};
