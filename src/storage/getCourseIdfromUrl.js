//get param
const param = new URLSearchParams(window.location.search);
ext.storage.local.get(["courseIds"], (result) => {
    const courseIds = result.courseIds || [];
    const uniqueIds = new Set(courseIds);
    uniqueIds.add(Number(param.get('id')));
    ext.storage.local.set({ courseIds: Array.from(uniqueIds) });
});