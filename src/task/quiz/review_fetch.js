//quizId, courseName, quizName, start, submit, due, point, required, maxp, count, maxcount, status


//quizId
const urlParams = new URLSearchParams(window.location.search);
const quizId = urlParams.get("cmid");
if (!quizId) {
    console.error("Quiz ID not found in URL");
    quizId = null; // quizIdが見つからない場合はnullを設定
}

//比較元もってくる
// success ハンドラーは、データベースがうまく開けたことを意味します。
taskdb_openRequest.addEventListener("success", () => {

    // 開いたデータベースオブジェクトを db という変数に記憶します。これは以降で頻繁に使われます。
    taskdb = taskdb_openRequest.result;

    const transaction = taskdb.transaction(["quiz_list"], "readwrite");
    // 3. オブジェクトストアを取得
    const store = transaction.objectStore("quiz_list");
    const getRequest = store.get(quizId);
    // 5. 結果を処理
    getRequest.onsuccess = (e) => {
        const data = e.target.result;
        if (data) {
            console.log("データが見つかりました:", data);
            data_fetch(data, transaction, store);
        } else {
            console.log("データが見つかりません。");
        }
    };
    getRequest.onerror = (e) => {
        console.error("データ取得エラー:", e.target.error);
    };
});

data_fetch = (data, tx, store) => {

    //courseName
    const courseName = document.querySelector("h1").textContent.trim();

    //quizName
    const quizName = document.querySelector("[aria-current='page']").textContent.trim();




    //point
    let point, maxp;
    try {
        const pointraw = document.querySelector("tr:last-of-type td").textContent.trim();
        const match = pointraw.match(/([\d.]+)\s*\/\s*([\d.]+)/);

        if (match && (!data.point || data.point < parseFloat(match[1]))) {
            point = parseFloat(match[1]); // 左側（現在の得点）
            maxp = parseFloat(match[2]);     // 右側（満点）
        }
    } catch (error) {
        point = null;
        maxp = null;
    }
    const count = data.count === 0 ? 1 : data.count;

    let a_status;
    if (maxp !== null && point !== null) { //得点状況がわかるとき
        if (point === maxp) {
            a_status = "complete";
        } else if (data.required === null || data.required === undefined) {
            if (count === 0) {
                a_status = "incomplete";
            } else {
                a_status = "qualify";
            }
        } else if (point >= data.required) {
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
    if (a_status === "incomplete" && count === data.maxcount) { //受験回数が上限に達しているのに合格点に達していないとき
        a_status = "stuck";
    }

    const outdata = {
        quizId: data.quizId,
        courseName: courseName,
        quizName: quizName,
        start: data.start,
        submit: data.submit,
        due: data.due,
        point: point,
        required: data.required,
        maxp: maxp,
        count: count,
        maxcount: data.maxcount,
        status: a_status,
        show: data.show
    }


    store.put(outdata);  // ← 存在すれば更新、なければ追加

    tx.oncomplete = () => {
        console.log("保存完了", outdata);
    };

    tx.onerror = (e) => {
        console.error("エラー", e);
    };



}
