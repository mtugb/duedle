
chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
    if (msg.type === "parse-course") {
        const doc = new DOMParser().parseFromString(msg.html, "text/html");

        const items = [
            ...doc.querySelectorAll("li.assign, li.quiz")
        ].map(el => ({
            id: Number(el.getAttribute("data-id")),
            type: el.classList.contains("assign") ? "assign" : "quiz"
        }));

        sendResponse(items);

        return true;
    }

    if (msg.type === "parse-assign") {
        const doc = new DOMParser().parseFromString(msg.html, "text/html");
        const res = ScrapeAssign.getData(doc);
        if (res !== null) {
            sendResponse(res);
            return true;
        }
        sendResponse(null);
        return false;
    }
    if (msg.type === "parse-quiz") {
        const doc = new DOMParser().parseFromString(msg.html, "text/html");
        const res = ScrapeQuiz.getData(doc);
        if (res !== null) {
            sendResponse(res);
            return true;
        }
        sendResponse(null);
        return false;
    }
});