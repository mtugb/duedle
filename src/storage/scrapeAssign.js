function scrapeAssign() {

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
        assignId: assignId,
        courseName: courseName,
        assignName: assignName,
        start: callstart()?.toISOString() ?? null,
        submit: submit,
        due: calldue()?.toISOString() ?? null,
        file: file,
        filenum: filenum,
        status: a_status,
        show: true, //default
        notified: false //default
    }
    //write
    chrome.storage.local.get(["assign_list"], (result) => {
        const assign_list = result.assign_list || [];
        let found = false;
        const newAssignList = assign_list.map(assign => {
            if (assign.assignId === assignId) {
                found = true;
                data.show = assign.show !== undefined ? assign.show : true;
                data.notified = assign.notified !== undefined ? assign.notified.notified : false;
                return { ...assign, ...data };
            }
            return assign;
        });

        if (!found) {
            newAssignList.push({ ...data });
        }

        chrome.storage.local.set({ assign_list: newAssignList });
    });
    return data;
}

