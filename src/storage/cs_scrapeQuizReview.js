//quizId, courseName, quizName, start, submit, due, point, required, maxp, count, maxcount, status


function scrapeQuizReview(oldData) {

    //courseName
    const courseName = document.querySelector("h1").textContent.trim();

    //quizName
    const quizName = document.querySelector("[aria-current='page']").textContent.trim();

    //point
    let point, maxp;
    try {
        const pointraw = document.querySelector("tr:last-of-type td").textContent.trim();
        const match = pointraw.match(/([\d.]+)\s*\/\s*([\d.]+)/);

        if (match && (!oldData.point || oldData.point <= parseFloat(match[1]))) {
            point = parseFloat(match[1]); // 左側（現在の得点）
            maxp = parseFloat(match[2]);     // 右側（満点）
        }
    } catch (error) {
        point = null;
        maxp = null;
    }
    const count = oldData.count === 0 ? 1 : oldData.count;

    let a_status;
    if (maxp !== null && point !== null) { //得点状況がわかるとき
        if (point === maxp) {
            a_status = "complete";
        } else if (oldData.required === null || oldData.required === undefined) {
            if (count === 0) {
                a_status = "incomplete";
            } else {
                a_status = "qualify";
            }
        } else if (point >= oldData.required) {
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
    if (point && oldData.required && point < oldData.required && a_status === "incomplete" && count === oldData.maxcount) { //受験回数が上限に達しているのに合格点に達していないとき
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

    const newData = {
        group: oldData.group,
        quizId: oldData.quizId,
        courseName: courseName,
        quizName: quizName,
        start: oldData.start,
        submit: oldData.submit,
        due: oldData.due,
        point: point,
        required: oldData.required,
        maxp: maxp,
        count: count,
        maxcount: oldData.maxcount,
        status: a_status,
        show: oldData.show,
        notified: oldData.notified
    }
    return newData;
}

const urlParams = new URLSearchParams(window.location.search);
const quizId = Number(urlParams.get("cmid"));
if (!quizId) {
    console.error("Quiz ID not found in URL");
    quizId = null; // quizIdが見つからない場合はnullを設定
}

//getData
chrome.storage.local.get(["quiz_list"], (result) => {
    const quiz_list = result.quiz_list || [];
    let found = false;
    const newQuizList = quiz_list.map(quiz => {
        if (quiz.quizId === quizId) {
            found = true;
            const quizNew = ScrapeQuizReview.getData(quiz);
            return { ...quiz, ...quizNew };
        }
        return quiz;
    });

    if (!found) {
        console.error("課題ページの情報を取得していないため、成績を保存できませんでした");
    }

    chrome.storage.local.set({ quiz_list: newQuizList });
});