//全データ取得
async function getAllData() {
    const result = await chrome.storage.local.get(["assign_list", "quiz_list"]);
    const assignList = result.assign_list || [];
    const quizList = result.quiz_list || [];
    const data = [...assignList, ...quizList];
    return sortByDeadline(data);
}
function sortByDeadline(data) {
    return data.sort((a, b) => {
        return new Date(a.due) - new Date(b.due); // 締切日時の昇順でソート
    });
}

//tableのデータを1つ編集 table名に対して、
async function editData(table, idproperty, id, property, value) {
    const result = await chrome.storage.local.get(table);
    const data = result[table] || [];
    const index = data.findIndex(item => item[idproperty] == id);
    if (index !== -1 && data[index][property] !== undefined) {
        data[index][property] = value;
    }

    await chrome.storage.local.set({ [table]: data });
}

//複数同時に置き換える