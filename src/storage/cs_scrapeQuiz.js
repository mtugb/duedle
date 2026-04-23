const data = ScrapeQuiz.getData();
//write
chrome.storage.local.get(["quiz_list"], (result) => {
    const quiz_list = result.quiz_list || [];
    let found = false;

    const newQuizList = quiz_list.map(quiz => {
        if (quiz.quizId === quizId) {
            found = true;
            data.show = quiz.show;
            data.notified = quiz.notified;

            //点数復元
            if (quiz.maxp !== null) {
                data.maxp = quiz.maxp;
            }
            //完了は上書きしない
            if (data.status === "unknown" && quiz.status === "complete") {
                data.status = quiz.status;
            }

            return { ...quiz, ...data };
        }
        return quiz;
    });

    if (!found) {
        newQuizList.push({ ...data });
    }

    chrome.storage.local.set({ quiz_list: newQuizList });
});