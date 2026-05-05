ext.runtime.onMessage.addListener((msg, sender, sendResponse) => {

  if (msg.type === "SCRAPE_COURSE") {

    const items = [
      ...document.querySelectorAll("li.assign, li.quiz")
    ].map(el => ({
      id: el.getAttribute("data-id"),
      type: el.classList.contains("assign")
        ? "assign"
        : "quiz"
    }));

    sendResponse(items);
    return true;
  }

});