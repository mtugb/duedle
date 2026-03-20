setTimeout(() => {
    const courseContainer2 = document.querySelector('ul.list-group');
    const savedData = localStorage.getItem("courseOrder");

    if (courseContainer2 && savedData) {
        const orderArray = JSON.parse(savedData);
        const courseItems2 = Array.from(courseContainer2.querySelectorAll("li"));

        console.log("保存データ順にスキャン開始:", orderArray);

        orderArray.forEach((savedText, index) => {
            // 【重要】保存データ側から矢印や余計な空白を徹底除去
            const cleanSavedText = savedText.replace(/[↑↓]/g, '').trim();

            const targetLi = courseItems2.find(item => {
                // 【重要】画面側のテキストからも矢印や空白を除去
                const currentItemText = item.textContent.replace(/[↑↓]/g, '').trim();
                
                // 部分一致ではなく、ある程度の長さで一致するか確認
                return currentItemText.includes(cleanSavedText) && cleanSavedText.length > 0;
            });

            if (targetLi) {
                courseContainer2.appendChild(targetLi);
                console.log(`成功 [${index}]: "${cleanSavedText}" を移動しました`);
            } else {
                console.warn(`失敗 [${index}]: "${cleanSavedText}" が見つかりません`);
            }
        });
    } else {
        console.error("Duedle: コンテナまたはデータがありません", { container: !!courseContainer2, data: !!savedData });
    }
}, 2000);

/*
const li2 = document.getElementById("sort-free-mode");
setTimeout(() => {
    if (li2) {
        //li2.addEventListener("click", () => {
            const courseContainer2 = document.querySelector('ul.list-group');
            const savedData = localStorage.getItem("courseOrder");

            if (savedData) {
                const orderArray = JSON.parse(savedData);  
                const courseItems2=Array.from(courseContainer2.querySelectorAll("li"));
                orderArray.forEach(name => {
                    const targetLi = courseItems2.find(item => item.textContent.trim().includes(name));
                    if (targetLi) courseContainer2.appendChild(targetLi);
                });
                console.log("並べ替え完了");
            }

        //});
    }
},2000); */