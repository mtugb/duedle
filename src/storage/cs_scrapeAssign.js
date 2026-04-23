const data = ScrapeAssign.getData(document);
//write
chrome.storage.local.get(["assign_list"], (result) => {
    const assign_list = result.assign_list || [];
    let found = false;
    const newAssignList = assign_list.map(assign => {
        if (assign.assignId === data.assignId) {
            found = true;
            data.show = assign.show !== undefined ? assign.show : true;
            data.notified = assign.notified !== undefined ? assign.notified.notified : false;
            //完了は上書きしない
            if (data.status === "unknown" && assign.status === "complete") {
                data.status = assign.status;
            }
            return { ...assign, ...data };
        }
        return assign;
    });

    if (!found) {
        newAssignList.push({ ...data });
    }

    chrome.storage.local.set({ assign_list: newAssignList });
});