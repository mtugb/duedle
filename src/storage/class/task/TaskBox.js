class TaskBox { //親クラス
    constructor(data){
        this.data = data;
    }
    setremain() {
        const remain = this.data.due ? Math.ceil((this.data.due - Date.now()) / (1000 * 60 * 60 * 24)) : null;
        if (this.data.status !== "complete" && remain !== null && remain < 0) {
            this.data.status = "expired";
        }
        const remainoutput = formatRemainingTime(this.data.due);
        const remainstr = (remain !== null)? remainoutput : "残り時間: 不明";
        return remainstr;
    }
}