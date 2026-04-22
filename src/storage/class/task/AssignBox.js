class AssignBox extends TaskBox {
    constructor(data) {
        super(data);
    }
    async getElement() {
        const assign = document.createElement("div");
        assign.classList.add("assign");
        const inner = `
            <div class="type">提出課題
            <div class="col-md-1 p-0 d-flex menu">
            <div class="ml-auto dropdown">
            <button class="btn btn-link btn-icon icon-size-3 coursemenubtn" type="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                <i class="icon fa fa-ellipsis-v fa-fw m-0" aria-hidden="true"></i>
            </button>
            <div class="dropdown-menu dropdown-menu-right" style="will-change: transform;">
                <a href="#" class="showbutton"></a>
            </div>
            </div>
            </div>
            </div>
            <div class="title">${this.data.courseName.match(/^(.+?)\s\d/)[1].trim()}</div>
            <div class="assignbox">
                <a href="https://cms7.ict.nitech.ac.jp/moodle40a/mod/assign/view.php?id=${this.data.assignId}">${this.data.assignName}</a>
            </div>
            <div class="info">
                <ul>
                <li>開始: ${this.data.start ? new Date(this.data.start).toLocaleString() : "不明"}</li>
                <li>期限: ${this.data.due ? new Date(this.data.due).toLocaleString() : "不明"}</li>
                <li>最初のファイル名: ${this.data.file ? this.data.file : "不明"}</li>
                <li>提出ファイル数: ${this.data.filenum}</li>
                <li class="liStatus"></li>
                <li class="liRemain"></li>
                </ul>
            </div>
        `;
        assign.insertAdjacentHTML("beforeend", inner);
        //edit style
        if ((await chrome.storage.sync.get(["selectedShow"])).selectedShow === "all") {
            const ddm = assign.querySelector(".dropdown-menu");
            ddm.setAttribute("hidden", "");
        }
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
        const listatus = assign.querySelector(".liStatus");
        const title = assign.querySelector(".title");
        switch (this.data.status) {
            case "complete":
                listatus.textContent = "状態: 提出済み";
                assign.classList.add("complete"); //cssの関係でcompleteクラスを流用
                title.textContent = "✓ " + title.textContent;
                break;
            case "incomplete":
                listatus.textContent = "状態: 未提出";
                assign.classList.add("incomplete");
                break;
            case "warning":
                listatus.textContent = "状態: 要注意";
                title.textContent = "⚠️ " + title.textContent;
                assign.classList.add("warning");
                break;
            case "expired":
                listatus.textContent = "状態: 期限切れ";
                assign.classList.add("expired");
                title.textContent = "❌ " + title.textContent;
                break;
            case "unknown":
                listatus.textContent = "状態: 不明";
                assign.classList.add("unknown");
                title.textContent = "? " + title.textContent;
                break;
        }
        assign.querySelector(".liRemain").textContent = super.setremain();


        return assign;
    }
}