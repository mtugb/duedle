
const filterTypes_status = [

    {
        name: "completed",
        displayName: "完了",
    },
    {
        name: "incomplete",
        displayName: "未完了",
    }
];

const boxSelect = document.getElementsByClassName("calendarwrapper");
const form = document.createElement("form");
form.setAttribute("id", "filterForm");
boxSelect[0].appendChild(form);

for (let i = 0; i < filterTypes.length; i++) {
    const filter = document.createElement("input");
    filter.setAttribute("type", "checkbox");
    filter.setAttribute("name", filterTypes[i].name);
    filter.setAttribute("id", filterTypes[i].name);
    filter.setAttribute("value", filterTypes[i].name);
    filter.classList.add("filter-input");
    boxSelect[0].insertBefore(filter, boxSelect[0].firstChild);

    const label = document.createElement("label");
    label.setAttribute("for", filterTypes[i].name);
    label.textContent = "　"+filterTypes[i].displayName;
    boxSelect[0].insertBefore(label, boxSelect[0].firstChild);
}

//checkbox event
