//assignId, courseName, assignName, start, submit, due, file, filenum, status
//assignId
const urlParams = new URLSearchParams(window.location.search);
const assignId = urlParams.get("id");
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
        const dueraw = document.querySelector(".description-inner div").textContent.trim();
        return extractDate(dueraw);
    }
}

//return start
function callstart() {
    try {
        const temp = document.querySelector(".description-inner div:nth-child(2)").textContent.trim();
        const start = document.querySelector(".description-inner div").textContent.trim();
        return extractDate(start);
    } catch (error) {
        return null; // 開始日時が見つからない場合はnullを返す
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
    //締め切りを過ぎている場合はexpiredにする
    if(Math.ceil((calldue() - Date.now()) )<0){
        a_status = "expired";
    }
} else {
    a_status = "complete"; // ファイルが見つかった場合は完了とみなす
}

//show


const data = {
    assignId: assignId,
    courseName: courseName,
    assignName: assignName,
    start: callstart(),
    submit: submit,
    due: calldue(),
    file: file,
    filenum: filenum,
    status: a_status,
    show: true
}



taskdb_openRequest.onsuccess = function (event) {
    const db = event.target.result;
    const tx = db.transaction("assign_list", "readwrite");
    const store = tx.objectStore("assign_list");
    //showデータの取得
    const getReq = store.get(data.assignId);
    getReq.onsuccess = (e) => {
        const getdata = e.target.result;
        if(getdata) {
            data.show = getdata.show;
        }

        
        store.put(data);  // ← 存在すれば更新、なければ追加
    };

    

    tx.oncomplete = () => {
        console.log("保存完了");
    };

    tx.onerror = (e) => {
        console.error("エラー", e);
    };
};


