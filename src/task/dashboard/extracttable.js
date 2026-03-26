function getAllData(db, storeNames) {
  return Promise.all(
    storeNames.map(storeName => {
      return new Promise((resolve, reject) => {
        const tx = db.transaction(storeName, "readonly");
        const store = tx.objectStore(storeName);
        const req = store.getAll();

        req.onsuccess = () => {
          // store名も付けておくと便利
          const data = req.result.map(item => ({
            ...item,
            _store: storeName
          }));
          resolve(data);
        };

        req.onerror = reject;
      });
    })
  ).then(results => results.flat());
}

function sortByDeadline(data) {
  return data.sort((a, b) => {
    return a.due - b.due; // 締切日時の昇順でソート
  });
}