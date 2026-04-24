class ScrapeAssign extends Scrape {
    static getData(){
        return this.getData(document);
    }
    static getData(doc) {
        //assignId, courseName, assignName, start, submit, due, file, filenum, status
        //assignId
        const urlParams = new URLSearchParams(window.location.search);
        const assignId = Number(urlParams.get("id"));

        //courseName
        const courseName = doc.querySelector("h1").textContent.trim();

        //assignName
        const assignName = doc.querySelector("h2").textContent.trim();
        if(assignName==="トピックアウトライン"){
            return null;
        }


        //file, status
        const files = Array.from(doc.querySelectorAll(".submissionstatustable .fileuploadsubmission a")).map(a => a.textContent.trim());
        const filenum = files.length;
        const file = files[0] || "?"; // 最初のファイル名、存在しない場合は?
        let a_status;
        if (filenum === 0) {
            a_status = "incomplete"; // ファイルが見つからない場合は未完了とみなす
            if (this.calldue(doc) && Math.ceil((this.calldue(doc) - Date.now()) / (1000 * 60 * 60 * 24)) < 3) {
                a_status = "warning";
            }
            //締め切りを過ぎている場合はexpiredにする
            if (this.calldue(doc) && Math.ceil((this.calldue(doc) - Date.now()) / (1000 * 60 * 60 * 24)) < 0) {
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
            start: this.callstart(doc)?.toISOString() ?? null,
            due: this.calldue(doc)?.toISOString() ?? null,
            file: file,
            filenum: filenum,
            status: a_status,
            show: true, //default
            notified: false //default
        }
        return data;
    }
}