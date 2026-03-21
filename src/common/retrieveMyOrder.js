
//----------------------並べ方が"任意の順番"のとき、復元-----------------------
const parentList2 = document.querySelector('ul[aria-labelledby = "sortingdropdown"]');
const li2 = document.getElementById("sort-free-mode");

const currentLi2=localStorage.getItem("currentLi");

    console.log("same mode"); 
window.addEventListener("load",() =>{
    if (currentLi2==="任意の順番に並べ替える") {
        setTimeout(() => li2.click(),600);
        console.log("clicked");
    }      
});

//--------------------------------並び順を復元-------------------------


    if (li2) {
        li2.addEventListener("click", (e) => {
            setTimeout(() =>{
                e.preventDefault();
                const courseContainer2 = document.querySelector('ul.list-group');
                const saveData = localStorage.getItem("courseOrder");

                if (saveData) {
                    const orderArray = JSON.parse(saveData);  
                    const courseItems2=Array.from(courseContainer2.querySelectorAll("li"));
                    for (let name of orderArray) {
                        const targetLi = courseItems2.find(item => item.innerText.trim().includes(name) || name.includes(item.innerText.trim()));
                        if (targetLi) courseContainer2.appendChild(targetLi);
                        //console.log(courseItems2[0].innerText.trim());
                        //console.log(name);
                        //console.log(targetLi);
                    };

                }
           },600);
        });
    }