class QuizBox extends TaskBox {
    constructor(data) {
        super(data);
    }
    async getElement() {
        const quiz = await super.getElement();
        quiz.classList.add("quiz");

        const point = this.data.point || this.data.point == 0 ? this.data.point : "?";
        const maxpoint = this.data.maxp || this.data.maxp == 0 ? this.data.maxp : "?";
        const required = this.data.required || this.data.required == 0 ? `(${this.data.required}必要)` : "";
        quiz.querySelector(".li3").textContent = `得点: ${point} / ${maxpoint}  ${required}`;

        const count = this.data.count ? this.data.count : "0";
        const maxcount = this.data.maxcount !== null ? this.data.maxcount : "∞";
        quiz.querySelector(".li4").textContent = `受験回数: ${count} / ${maxcount}`;

        quiz.querySelector(".taskbox").innerHTML = `
        <a href="https://cms7.ict.nitech.ac.jp/moodle40a/mod/quiz/view.php?id=${this.data.quizId}">${this.data.quizName}</a>`;

        const showbutton = quiz.querySelector(".showbutton");
        if (this.data.show) {
            showbutton.addEventListener("click", async (e) => {
                await StorageUtil.editData('quiz_list', "quizId", this.data.quizId, "show", false);
                e.target.closest(".quiz").remove();
            });
            showbutton.textContent = "一覧から削除する";
        } else {
            showbutton.addEventListener("click", async (e) => {
                await StorageUtil.editData('quiz_list', "quizId", this.data.quizId, "show", true);
                e.target.closest(".quiz").remove();
            });
            showbutton.textContent = "一覧に戻す";
        }
        const manualComplete = quiz.querySelector(".manualComplete");
        if (manualComplete) {
            manualComplete.addEventListener("click", async (e) => {
                await StorageUtil.editData('quiz_list', "quizId", this.data.quizId, "status", "complete");
                quiz.classList.remove("unknown");
                quiz.classList.add("complete");
                colorReload();
                manualComplete.setAttribute("hidden","");
            });
        }
        return quiz;
    }
}