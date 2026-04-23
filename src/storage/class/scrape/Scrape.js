class Scrape {
    //return start
    static callstart() {
        try {
            const temp = document.querySelector(".description-inner div:nth-child(2)").textContent.trim();
            const start = document.querySelector(".description-inner div").textContent.trim();
            return extractDate(start);
        } catch (error) {
            try {
                const start = document.querySelector(".description-inner div").textContent.trim();
                if (start.includes("始")) {
                    return extractDate(start);
                } else {
                    return null;
                }
            } catch {
                return null;
            }
            // 開始日時が見つからない場合はnullを返す
        }
    }
    //return due
    static calldue() {
        try {
            const dueraw = document.querySelector(".description-inner div:nth-child(2)").textContent.trim();
            return extractDate(dueraw);
        } catch (error) {
            try {
                const dueraw = document.querySelector(".description-inner div").textContent.trim();
                if (!dueraw.includes("始")) {
                    return extractDate(dueraw);
                } else {
                    return null;
                }

            } catch (error) {
                return null;
            }
        }
    }

    


}