class Scrape {
    //return start
    static callstart() {
        return this.callstart(document);
    }
    static callstart(doc) {
        try {
            const temp = doc.querySelector(".description-inner div:nth-child(2)").textContent.trim();
            const start = doc.querySelector(".description-inner div").textContent.trim();
            return extractDate(start);
        } catch (error) {
            try {
                const start = doc.querySelector(".description-inner div").textContent.trim();
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
        return this.calldue(document);
    }
    static calldue(doc) {
        try {
            const dueraw = doc.querySelector(".description-inner div:nth-child(2)").textContent.trim();
            return extractDate(dueraw);
        } catch (error) {
            try {
                const dueraw = doc.querySelector(".description-inner div").textContent.trim();
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