//quizId, courseName, quizName, start, submit, due, point, required, maxp, count, maxcount, status


const urlParams = new URLSearchParams(window.location.search);
const quizId = Number(urlParams.get("cmid"));
if (!quizId) {
    console.error("Quiz ID not found in URL");
    quizId = null; // quizIdが見つからない場合はnullを設定
}

//getData
ext.storage.local.get(["quiz_list"], (result) => {
    const quiz_list = result.quiz_list || [];
    let found = false;
    const newQuizList = quiz_list.map(quiz => {
        if (quiz.quizId === quizId) {
            found = true;
            const quizNew = ScrapeQuizReview.getData(quiz);
            console.log(quizNew);
            return { ...quiz, ...quizNew };
        }
        return quiz;
    });

    if (!found) {
        console.error("課題ページの情報を取得していないため、成績を保存できませんでした");
    }

    ext.storage.local.set({ quiz_list: newQuizList });
});