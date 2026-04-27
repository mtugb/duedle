const data = ScrapeAssign.getData(document);
//write
if (data !== null) {
    StorageUtil.saveData("assign_list", "assignId", data);
}
