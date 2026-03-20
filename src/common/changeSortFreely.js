const li = document.createElement("li");
const parentList = document.querySelector('ul[aria-labelledby = "sortingdropdown"]');
li.innerHTML ='<a class="dropdown-item" id = "sort-free-mode" href="#" data-filter="sort" data-pref="lastaccessed" data-value="ul.displayorder asc" role="menuitem">任意の順番に並べ替える</a>';

if (parentList)
    parentList.appendChild(li);

//-------------------------------------------------





if (li) {
    li.addEventListener("click", (e)=> {
        e.preventDefault();
        setTimeout(() => {
            const courseContainer = document.querySelector('ul.list-group'); //ダッシュボード
            const saveData = localStorage.getItem("courseOrder");
            if (courseContainer) {
                //-------------------localStrage--------------------------------------------------------
                const courseItems = Array.from(courseContainer.querySelectorAll('li'));
                const save = () => {
                    const temporaryCourseItems = Array.from(courseContainer.querySelectorAll('li'));
                    localStorage.setItem("courseOrder",JSON.stringify(temporaryCourseItems.map(li => li.innerText.trim())));
                };

                    if (saveData) {
                        const orderArray = JSON.parse(saveData);
                        orderArray.forEach((item) => {    
                            const targetLi = courseItems.find(li=>li.innerText.trim().includes(item));
                            if (targetLi)
                                courseContainer.appendChild(targetLi);
                        });
                    }


                courseItems.forEach((item) => {
                       //-------------ボタン追加-------------------------------------------------------
                    const arrow = document.createElement("div");
                    arrow.innerHTML = '<button class="up-button mr-2">↑</button>  <button class ="down-button">↓</button>';
                    item.appendChild(arrow);

                        //-----------------クリックイベント------------------------------------------
                    const upButton = arrow.querySelector('.up-button');
                    const downButton = arrow.querySelector('.down-button');    
                    upButton.addEventListener("click",(e) => {
                        const prevLi = item.previousElementSibling;
                        e.stopPropagation();
                        if (prevLi) {
                            courseContainer.insertBefore(item, prevLi);  //↑が押されたとき、入れ替え
                            save();
                        }

                    } )
                   
                    downButton.addEventListener("click", (e) => {
                        const nextLi = item.nextElementSibling;
                        e.stopPropagation()
                        if (nextLi) {
                            courseContainer.insertBefore(item,nextLi.nextElementSibling); //↓が押されたとき、入れ替え
                            save();
                        }
                    })

                });
            }
        },1000);
    });
}