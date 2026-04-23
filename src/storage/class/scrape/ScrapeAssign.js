class ScrapeAssign extends Scrape {
    static getData(){
        return this.getData(document);
    }
    static getData(document) {
        //assignId, courseName, assignName, start, submit, due, file, filenum, status
        //assignId
        const urlParams = new URLSearchParams(window.location.search);
        const assignId = Number(urlParams.get("id"));
        if (!assignId) {
            console.error("Assignment ID not found in URL");
            assignId = null; // assignIdが見つからない場合はnullを設定
        }

        //courseName
        const courseName = document.querySelector("h1").textContent.trim();

        //assignName
        const assignName = document.querySelector("h2").textContent.trim();

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
        const file = files[0] || "?"; // 最初のファイル名、存在しない場合は?
        let a_status;
        if (filenum === 0) {
            a_status = "incomplete"; // ファイルが見つからない場合は未完了とみなす
            if (calldue() && Math.ceil((calldue() - Date.now()) / (1000 * 60 * 60 * 24)) < 3) {
                a_status = "warning";
            }
            //締め切りを過ぎている場合はexpiredにする
            if (calldue() && Math.ceil((calldue() - Date.now()) / (1000 * 60 * 60 * 24)) < 0) {
                a_status = "expired";
            }
        } else {
            a_status = "complete"; // ファイルが見つかった場合は完了とみなす
        }


        const data = {
            group: "assign_list",
            assignId: assignId,
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
}