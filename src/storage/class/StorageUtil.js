class StorageUtil {
    static async getAllData() {
        const result = await ext.storage.local.get(["assign_list", "quiz_list"]);
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
        const result = await ext.storage.local.get(table);
        const data = result[table] || [];
        const index = data.findIndex(item => item[idproperty] == id);
        if (index !== -1 && data[index][property] !== undefined) {
            data[index][property] = value;
        }

        await ext.storage.local.set({ [table]: data });
    }

    //データ保存
    static async saveData(table, idproperty, data) {
        ext.storage.local.get([table], (result) => {
            const res = result[table] || [];
            let found = false;
            const newlist = res.map(item => {
                if (item[idproperty] === data[idproperty]) {
                    found = true;
                    data.show = item.show !== undefined ? item.show : true;
                    data.notified = item.notified !== undefined ? item.notified : false;
                    if (item.maxp !== null && item.maxp !== undefined) {
                        data.maxp = item.maxp;
                    }
                    if (item.point !== null && item.point !== undefined && !data.point) {
                        data.point = item.point;
                    }
                    //完了は上書きしない
                    if (data.status === "unknown" && item.status === "complete") {
                        data.status = item.status;
                    }
                    console.log(data);
                    return { ...item, ...data };
                }
                return item;
            });

            if (!found) {
                newlist.push({ ...data });
            }

            ext.storage.local.set({ [table]: newlist });
        });
    }
}