class FilterSelect {
    constructor(idName, labelName, values, texts, propertyName) {
        this.idName = idName;
        this.labelName = labelName;
        this.values = values;
        this.texts = texts;
        this.propertyName = propertyName;
    }
    async getElement() {
        const elementlabel = document.createElement("label");
        elementlabel.setAttribute("for", this.idName);
        elementlabel.classList.add("filterlabel", "mr-md-2", "mb-md-0");
        elementlabel.textContent = this.labelName;

        const elementselect = document.createElement("select");
        elementselect.id = this.idName;
        elementselect.classList.add("form-select", "form-select-sm", "w-auto", "custom-select", "mb-1", "mb-md-0", "mr-md-2");

        window.addEventListener("load", async () => {
            const saved = (await ext.storage.sync.get([this.propertyName]))[this.propertyName];
            if (saved) {
                elementselect.value = saved;
            }
        });
        elementselect.addEventListener("change", async () => {
            await ext.storage.sync.set({ [this.propertyName]: elementselect.value }); // 選択した値をローカルストレージに保存
            rerender();
        });


        const options = this.values.map((value, index) => {
            const option = document.createElement("option");
            option.value = value;
            option.textContent = this.texts[index];
            return option;
        });
        options.forEach(option => elementselect.appendChild(option));

        return [elementlabel, elementselect];
    }
    applyDefault(value) {
        ext.storage.sync.get([this.propertyName], (result) => {
            if (result[this.propertyName] === undefined) {
                ext.storage.sync.set({ [this.propertyName]: value });
            }
        });
    }
}