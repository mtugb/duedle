class ScrapeQuiz extends Scrape {
    static getData() {
        return this.getData(document);
    }
    static getData(doc) {
        //quizId, courseName, quizName, start, submit, due, point, required, maxp, count, maxcount, status
        //quizId
        const urlParams = new URLSearchParams(window.location.search);
        const quizId = Number(urlParams.get("id"));

        //courseName
        const courseName = doc.querySelector("h1").textContent.trim();

        //quizName
        const quizName = doc.querySelector("h2").textContent.trim();
        if(quizName==="トピックアウトライン"){
            return null;
        }

        //point
        let point, maxp;
        try {
            const pointraw = doc.querySelector("#feedback h3").textContent.trim();
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
        const requiredraw = [...doc.querySelectorAll("p.text-left")]
            .find(e => e.textContent.includes("合格点"));
        const requiredMatch = requiredraw ? requiredraw.textContent.trim().match(/合格点:\s*([\d.]+)\s*\/\s*([\d.]+)/) : null;
        const required = requiredMatch ? parseFloat(requiredMatch[1]) : null;
        if (maxp === null) maxp = requiredMatch ? parseFloat(requiredMatch[2]) : null;

        //count
        const count = (doc.getElementsByTagName("tr").length - 1) === -1 ? 0 : doc.getElementsByTagName("tr").length - 1; // ヘッダー行を除くために-1

        //maxcount
        const maxcountraw = [...doc.querySelectorAll("p.text-left")]
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
            if (this.calldue(doc) && Math.ceil((this.calldue(doc) - Date.now()) / (1000 * 60 * 60 * 24)) < 3) {
                a_status = "warning";
            }
            //締め切りを過ぎている場合はexpiredにする
            if (this.calldue(doc) && Math.ceil((this.calldue(doc) - Date.now()) / (1000 * 60 * 60 * 24)) < 0) {
                a_status = "expired";
            }
        }


        const data = {
            group: "quiz_list",
            quizId: quizId,
            courseName: courseName,
            quizName: quizName,
            start: this.callstart(doc)?.toISOString() ?? null,
            due: this.calldue(doc)?.toISOString() ?? null,
            point: point,
            required: required,
            maxp: maxp,
            count: count,
            maxcount: maxcount,
            status: a_status,
            show: true, //default
            notified: false
        }
        return data;


    }
}