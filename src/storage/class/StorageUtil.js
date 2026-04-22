class StorageUtil {
    static async getAllData() {
        const result = await chrome.storage.local.get(["assign_list", "quiz_list"]);
        const assignList = result.assign_list || [];
        const quizList = result.quiz_list || [];
        const data = [...assignList, ...quizList];
        const sort = data.sort((a, b) => {
            return new Date(a.due) - new Date(b.due); // 締切日時の昇順でソート
        });
        return sort;
    }

    //tableのデータを1つ編集 table名に対して、IDプロパティがidに等しいとき、propertyをvalueに変更
    static async editData(table, idproperty, id, property, value) {
        const result = await chrome.storage.local.get(table);
        const data = result[table] || [];
        const index = data.findIndex(item => item[idproperty] == id);
        if (index !== -1 && data[index][property] !== undefined) {
            data[index][property] = value;
        }

        await chrome.storage.local.set({ [table]: data });
    }

    static async scrape(){
        
    }
}