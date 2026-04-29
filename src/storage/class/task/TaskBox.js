class TaskBox { //親クラス
    constructor(data) {
        this.data = data;
    }
    async getElement() {
        const element = document.createElement("div");
        const inner = `
            <div class="type">${this.data.group === "assign_list" ? "提出課題" : "小テスト"}
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
            <div class="taskbox">
            </div>
            <div class="info">
                <ul>
                <li class="li1">開始: ${this.data.start ? new Date(this.data.start).toLocaleString() : "?"}</li>
                <li class="li2">期限: ${this.data.due ? new Date(this.data.due).toLocaleString() : "?"}</li>
                <li class="li3"></li>
                <li class="li4"></li>
                <li class="liStatus"></li>
                <li class="liRemain"></li>
                </ul>
            </div>
        `;
        element.insertAdjacentHTML("beforeend", inner);
        //edit style
        if ((await ext.storage.sync.get(["selectedShow"])).selectedShow === "all") {
            const ddm = element.querySelector(".dropdown-menu");
            ddm.setAttribute("hidden", "");
        }

        const listatus = element.querySelector(".liStatus");
        const title = element.querySelector(".title");
        switch (this.data.status) {
            case "complete":
                listatus.textContent = "状態: 完了";
                element.classList.add("complete");
                title.textContent = "✓ " + title.textContent;
                break;
            case "qualify":
                listatus.textContent = "状態: 合格";
                element.classList.add("qualify");
                title.textContent = "〇 " + title.textContent;
                break;
            case "incomplete":
                listatus.textContent = "状態: 未完了";
                element.classList.add("incomplete");
                break;
            case "warning":
                listatus.textContent = "状態: 要注意";
                element.classList.add("warning");
                title.textContent = "⚠️ " + title.textContent;
                break;
            case "expired":
                listatus.textContent = "状態: 期限切れ";
                element.classList.add("expired");
                title.textContent = "❌ " + title.textContent;
                break;
            case "stuck":
                listatus.textContent = "状態: 行き詰まり";
                element.classList.add("stuck");
                title.textContent = "☠ " + title.textContent;
                break;
            case "unknown":
                listatus.textContent = "状態: 不明　";
                element.classList.add("unknown");
                title.textContent = "? " + title.textContent;
                const manualComplete = document.createElement("button");
                manualComplete.classList.add("manualComplete");
                manualComplete.textContent = "完了とする"
                listatus.appendChild(manualComplete);
                break;
        }
        element.querySelector(".liRemain").textContent = this.setremain();
        return element;
    }
    setremain() {
        const remain = this.data.due ? Math.ceil((this.data.due - Date.now()) / (1000 * 60 * 60 * 24)) : null;
        if (this.data.status !== "complete" && remain !== null && remain < 0) {
            this.data.status = "expired";
        }
        const remainoutput = formatRemainingTime(this.data.due);
        const remainstr = (remain !== null) ? remainoutput : "残り時間: 不明";
        return remainstr;
    }
}