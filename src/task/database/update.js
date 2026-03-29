function updateData(storeName, id, newValue ) {
  // 2. トランザクションを開始 (読み書きモード)
  const transaction = taskdb.transaction([storeName], "readwrite");
  
  // 3. オブジェクトストアを取得
  const store = transaction.objectStore(storeName);

  // 4. 更新したいデータを取得
  const getRequest = store.get(id);

  getRequest.onsuccess = (event) => {
    const data = event.target.result;
    
    if (data) {
      // データの変更
      data.show = newValue;

      // 5. 変更したデータを保存 (putは既存データがあれば上書き)
      const updateRequest = store.put(data);

      updateRequest.onsuccess = () => {
        console.log("データが更新されました");
      };
      updateRequest.onerror = (e) => {
        console.error("更新エラー:", e.target.error);
      };
    }
  };
}