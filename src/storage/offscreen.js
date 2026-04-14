
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
        const res = scrapeAssign(doc);
        sendResponse(res);

        return true;
    }
    if (msg.type === "parse-quiz") {
        const doc = new DOMParser().parseFromString(msg.html, "text/html");
        const res = scrapeQuiz(doc);
        sendResponse(res);

        return true;
    }
});

//scrape
function scrapeAssign(document) {
    //courseName
    let courseName = null;
    try {
        courseName = document.querySelector("h1").textContent.trim();
    } catch {
        courseName = null;
    }
    //assignName
    const assignName = document.querySelector("h2").textContent.trim();


    //return due
    function calldue() {
        try {
            const dueraw = document.querySelector(".description-inner div:nth-child(2)").textContent.trim();
            return extractDate(dueraw);
        } catch (error) {
            try {
                const dueraw = document.querySelector(".description-inner div").textContent.trim();
                if (!dueraw.includes("始")) {
                    return extractDate(dueraw);
                } else {
                    return null;
                }

            } catch (error) {
                return null;
            }
        }
    }

    //return start
    function callstart() {
        try {
            const temp = document.querySelector(".description-inner div:nth-child(2)").textContent.trim();
            const start = document.querySelector(".description-inner div").textContent.trim();
            return extractDate(start);
        } catch (error) {
            try {
                const start = document.querySelector(".description-inner div").textContent.trim();
                if (start.includes("始")) {
                    return extractDate(start);
                } else {
                    return null;
                }
                // 開始日時が見つからない場合はnullを返す
            } catch (error) {
                return null;
            }
        }
    }

    //submit
    const submitraw = document.querySelector("tbody tr:nth-child(4) td").textContent.trim();
    let submit;
    if (submitraw === '-') {
        submit = -1; // 提出日時が見つからない場合は-1
    } else {
        submit = extractDate(submitraw);
    }



    //file, status
    const files = Array.from(document.querySelectorAll(".submissionstatustable .fileuploadsubmission a")).map(a => a.textContent.trim());
    const filenum = files.length;
    const file = files[0] || -1; // 最初のファイル名、存在しない場合は-1
    let a_status;
    if (filenum === 0) {
        a_status = "incomplete"; // ファイルが見つからない場合は未完了とみなす
        if (calldue() && Math.ceil((calldue() - Date.now())) < 3) {
            a_status = "warning";
        }
        //締め切りを過ぎている場合はexpiredにする
        if (calldue() && Math.ceil((calldue() - Date.now())) < 0) {
            a_status = "expired";
        }
    } else {
        a_status = "complete"; // ファイルが見つかった場合は完了とみなす
    }

    //show

    const data = {
        group: "assign_list",
        assignId: null,
        courseName: courseName,
        assignName: assignName,
        start: callstart()?.toISOString() ?? null,
        submit: submit,
        due: calldue()?.toISOString() ?? null,
        file: file,
        filenum: filenum,
        status: a_status,
        show: assignName==="トピックアウトライン"? false : true, //default
        notified: false //default
    }
    return data;
}

function scrapeQuiz(document) {
    //quizId, courseName, quizName, start, submit, due, point, required, maxp, count, maxcount, status
    let courseName = null;
    try {
        courseName = document.querySelector("h1").textContent.trim();
    } catch {
        courseName = null;
    }
    //quizName
    const quizName = document.querySelector("h2").textContent.trim();


    //return due
    function calldue() {
        try {
            const dueraw = document.querySelector(".description-inner div:nth-child(2)").textContent.trim();
            return extractDate(dueraw);
        } catch (error) {
            try {
                const dueraw = document.querySelector(".description-inner div").textContent.trim();
                if (!dueraw.includes("始")) {
                    return extractDate(dueraw);
                } else {
                    return null;
                }

            } catch (error) {
                return null;
            }
        }
    }

    //return start
    function callstart() {
        try {
            const temp = document.querySelector(".description-inner div:nth-child(2)").textContent.trim();
            const start = document.querySelector(".description-inner div").textContent.trim();
            return extractDate(start);
        } catch (error) {
            try {
                const start = document.querySelector(".description-inner div").textContent.trim();
                if (start.includes("始")) {
                    return extractDate(start);
                } else {
                    return null;
                }
            } catch {
                return null;
            }
            // 開始日時が見つからない場合はnullを返す
        }
    }

    //submit
    function callsubmit() {
        try {
            const submitraw = document.querySelector(".statedetails:last-of-type").textContent.trim();
            return extractDate(submitraw);
        } catch (error) {
            return null; // 開始日時が見つからない場合はnullを返す
        }
    }

    //point
    let point, maxp;
    try {
        const pointraw = document.querySelector("#feedback h3").textContent.trim();
        const match = pointraw.match(/(\d+(?:\.\d+)?)\s*\/\s*(\d+(?:\.\d+)?)/);

        if (match) {
            point = parseFloat(match[1]); // 左側（現在の得点）
            maxp = parseFloat(match[2]);     // 右側（満点）
        }
    } catch (error) {
        point = null;
        try {
            maxp = parseFloat(match[1]);
        } catch (error) {
            maxp = null;
        }

    }
    //required,maxp
    const requiredraw = [...document.querySelectorAll("p.text-left")]
        .find(e => e.textContent.includes("合格点"));
    const requiredMatch = requiredraw ? requiredraw.textContent.trim().match(/合格点:\s*([\d.]+)\s*\/\s*([\d.]+)/) : null;
    const required = requiredMatch ? parseFloat(requiredMatch[1]) : null;
    if (maxp === null) maxp = requiredMatch ? parseFloat(requiredMatch[2]) : null;

    //count
    const count = (document.getElementsByTagName("tr").length - 1) === -1 ? 0 : document.getElementsByTagName("tr").length - 1; // ヘッダー行を除くために-1

    //maxcount
    const maxcountraw = [...document.querySelectorAll("p.text-left")]
        .find(e => e.textContent.includes("受験可能回数"));
    const maxcount = maxcountraw ? Number(maxcountraw.textContent.trim().match(/受験可能回数:\s*(\d+)/)[1]) : null;

    let a_status;
    if (point && maxp !== null && point !== null) { //得点状況がわかるとき
        if (point === maxp) {
            a_status = "complete";
        } else if (required === null || required === undefined) {
            if (count === 0) {
                a_status = "incomplete";
            } else {
                a_status = "qualify";
            }
        } else if (point >= required) {
            a_status = "qualify";
        } else {
            a_status = "incomplete";
        }
    } else { //得点状況がわからないとき
        if (count === 0) {
            a_status = "incomplete";
        } else {
            a_status = "unknown";
        }
    }
    if (point && required && point < required && a_status === "incomplete" && count === maxcount) { //受験回数が上限に達しているのに合格点に達していないとき
        a_status = "stuck";
    }


    //warningやexpiredにおきかえ

    if (a_status === "incomplete") {
        if (calldue() && Math.ceil((calldue() - Date.now())) < 3) {
            a_status = "warning";
        }
        //締め切りを過ぎている場合はexpiredにする
        if (calldue() && Math.ceil((calldue() - Date.now())) < 0) {
            a_status = "expired";
        }
    }

    const data = {
        group: "quiz_list",
        quizId: null,
        courseName: courseName,
        quizName: quizName,
        start: callstart()?.toISOString() ?? null,
        submit: callsubmit()?.toISOString() ?? null,
        due: calldue()?.toISOString() ?? null,
        point: point,
        required: required,
        maxp: maxp,
        count: count,
        maxcount: maxcount,
        status: a_status,
        show: quizName==="トピックアウトライン"? false : true,
        notified: false
    }

    return data;
}

//日付抽出
function extractDate(text) {;
    const match = text.match(/(\d{4})年\s*(\d{1,2})月\s*(\d{1,2})日.*?(\d{1,2}):(\d{2})/);

    if (match) {
        const [, year, month, day, hour, minute] = match;

        // Dateオブジェクト化（JSは月が0始まりなので注意）
        const date = new Date(
            Number(year),
            Number(month) - 1,
            Number(day),
            Number(hour),
            Number(minute)
        );

        return date;
    }

    return null;

}