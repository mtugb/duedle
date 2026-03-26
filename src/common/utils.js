//日付抽出
function extractDate(text) {
    const match = text.match(/(\d{4})年\s*(\d{1,2})月\s*(\d{1,2})日.*?(\d{1,2}):(\d{2})/);

    if (match) {
        const [, year, month, day, hour, minute] = match;

        // Dateオブジェクト化（JSは月が0始まりなので注意）
        const date = new Date(
            Number(year),
            Number(month) - 1,
            Number(day),
            Number(hour),
            Number(minute)
        );

        return date;
    }

    return null;

}

//残り時間の出力
function formatRemainingTime(due) {
    const now = new Date();
    const diff = due - now;

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);
    if (days > 0) {
        return `残り${days}日${hours}時間`;
    } else if (hours > 0) {
        return `残り${hours}時間${minutes}分`;
    } else if (minutes > 0) {
        return `残り${minutes}分${seconds}秒`;
    } else if (seconds >= 0) {
        return `残り${seconds}秒`;
    } else {
        return "終了";
    }
}
