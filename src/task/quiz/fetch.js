//quizId, courseName, quizName, start, submit, due, point, required, maxp, count, maxcount, status
//quizId
const urlParams = new URLSearchParams(window.location.search);
const quizId = urlParams.get("id");
if (!quizId) {
    console.error("Quiz ID not found in URL");
    quizId = null; // quizIdが見つからない場合はnullを設定
}

//courseName
const courseName = document.querySelector("h1").textContent.trim();

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
            return extractDate(dueraw);
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
        return null; // 開始日時が見つからない場合はnullを返す
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
    try{
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
const maxcount = maxcountraw ? maxcountraw.textContent.trim().match(/受験可能回数:\s*(\d+)/)[1] : "無制限";

let a_status;
if (point&&maxp !== null && point !== null) { //得点状況がわかるとき
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
if (a_status === "incomplete" && count === maxcount) { //受験回数が上限に達しているのに合格点に達していないとき
    a_status = "stuck";
}

const data = {
    quizId: quizId,
    courseName: courseName,
    quizName: quizName,
    start: callstart(),
    submit: callsubmit(),
    due: calldue(),
    point: point,
    required: required,
    maxp: maxp,
    count: count,
    maxcount: maxcount,
    status: a_status,
    show: true
}



taskdb_openRequest.onsuccess = function (event) {
    const db = event.target.result;
    const tx = db.transaction("quiz_list", "readwrite");
    const store = tx.objectStore("quiz_list");

    //showデータの取得
    const getReq = store.get(data.quizId);
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


