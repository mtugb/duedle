class AssignBox extends TaskBox {
    constructor(data) {
        super(data);
    }
    async getElement() {
        const assign = await super.getElement();
        assign.classList.add("assign");

        assign.querySelector(".li3").textContent = `最初のファイル名: ${this.data.file ? this.data.file : "不明"}`;
        assign.querySelector(".li4").textContent = `提出ファイル数: ${this.data.filenum}`;
        assign.querySelector(".taskbox").innerHTML = `
        <a href="https://cms7.ict.nitech.ac.jp/moodle40a/mod/assign/view.php?id=${this.data.assignId}">${this.data.assignName}</a>`;

        const showbutton = assign.querySelector(".showbutton");
        if (this.data.show) {
            showbutton.addEventListener("click", async (e) => {
                await StorageUtil.editData('assign_list', "assignId", this.data.assignId, "show", false);
                e.target.closest(".assign").remove();
            });
            showbutton.textContent = "一覧から削除する";
        } else {
            showbutton.addEventListener("click", async (e) => {
                await StorageUtil.editData('assign_list', "assignId", this.data.assignId, "show", true);
                e.target.closest(".assign").remove();
            });
            showbutton.textContent = "一覧に戻す";
        }

        const manualComplete = assign.querySelector(".manualComplete");
        if(manualComplete){
            manualComplete.addEventListener("click", async (e) => {
                await StorageUtil.editData('assign_list', "assignId", this.data.assignId, "status", "complete");
                assign.classList.remove("unknown");
                assign.classList.add("complete");
                colorReload();
                manualComplete.setAttribute("hidden","");
            });
        }

        return assign;
    }
}