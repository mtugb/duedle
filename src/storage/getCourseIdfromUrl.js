//get param
const param = new URLSearchParams(window.location.search);
chrome.storage.local.get(["courseIds"], (result) => {
    const courseIds = result.courseIds || [];
    const uniqueIds = new Set(courseIds);
    uniqueIds.add(Number(param.get('id')));
    chrome.storage.local.set({ courseIds: Array.from(uniqueIds) });
});