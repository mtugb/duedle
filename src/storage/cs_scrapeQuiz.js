const data = ScrapeQuiz.getData(document);
//write
if (data !== null) {
    StorageUtil.saveData("quiz_list", "quizId", data);
}
