
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//マイコース表示設定　のテキスト変更------------------------------------------
const myCourseSetting1 = Array.from(document.querySelectorAll('h5')).find(h => h.textContent.trim() === 'マイコース表示設定');
if (myCourseSetting1) { myCourseSetting1.textContent ="コース概要の表示順設定";}
const myCourseSetting2 = document.querySelector('#page-navbar > nav > ol > li:nth-child(2) > span');
if (myCourseSetting2 && myCourseSetting2.textContent==="Myコースの表示設定") { myCourseSetting2.textContent ="コース概要の表示順設定";}
const myCourseSetting3 = document.querySelector("#region-main > div > h2 > center");
if (myCourseSetting3 && myCourseSetting3.textContent==="Myコースの表示設定") { myCourseSetting3.textContent ="コース概要の表示順設定";}
//表示設定へ　のテキスト変更----------------------------------------------------------------
const toSortSetting = document.querySelector("#inst67416 > div > div > div > p > span > a");
if (toSortSetting) {
    toSortSetting.style.fontWeight="bold";
}
//マイコース設定順で並べ替える　のテキスト変更------------------------------------------
const changeOrderList = document.querySelector('.dropdown-item[data-value="ul.displayorder asc"]');
if (changeOrderList) { changeOrderList.textContent = "設定した表示順で並べ替える";}
const sortingDropdown = document.querySelector("#sortingdropdown");
if (sortingDropdown && changeOrderList.getAttribute('aria-current')==='true') {sortingDropdown.textContent="設定した表示順で並べ替える";}
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////

const courseContainer = document.querySelector("#region-main > div > form > center > table > tbody");

if (courseContainer) {const courseItems = courseContainer.querySelectorAll("tr");
    if (courseItems) {   
        //--------並べ替え-----------------------------------------------------------------------------
        courseItems.forEach((item,index)=>{
            item.style.borderBottom ="2px solid #ccc";
            if (item.querySelector("td")) item.querySelector("td").style.display = "none";
            const draggableMark = document.createElement("td");
            if (index!==0) draggableMark.textContent = "≡";
            item.insertBefore(draggableMark,item.querySelector("td"));
            if (index===0) return;//ヘッダーは対象外
            item.setAttribute("draggable","true");
            item.style.cursor="grab";
            item.querySelectorAll("td").forEach(td => {  ///tdの幅を大きく
                td.style.height = "50px";
                td.style.padding = "0 8px";
                td.style.boxSizing = "border-box";
            });


            item.addEventListener("dragstart",(e) => {
            //e.preventDefault();
            e.target.style.opacity="0.5";
            setTimeout(() => item.classList.add("drag"),0);          
            });

            item.addEventListener("dragend", (e) => {
                e.target.style.opacity = "1";
                e.target.style.cursor = "grab";
                item.classList.remove("drag");
                let value=10;  //並び順に応じて、inputのvalueを更新
                courseContainer.querySelectorAll("tr").forEach((item,index)=> {
                    if(index===0) return;
                    item.querySelector("input").value=String(value);
                    value+=10;
                });
            });
 
        });

        courseContainer.addEventListener("dragover",(e) =>{
        e.preventDefault();  //ドラッグ中の🚫マークをなくす
        const dragging = courseContainer.querySelector(".drag");
        let anotherList = [...courseContainer.querySelectorAll("tr:not(.drag):not(.header)")];
        let dropped = anotherList.find((another) => {
            if (another.rowIndex ===0) return false;
            const rect = another.getBoundingClientRect();
            return (e.clientY <= rect.top + rect.height / 2);
        });
        if (!dropped) courseContainer.appendChild(dragging);
        else courseContainer.insertBefore(dragging,dropped);
        });

        //----------キャンセルボタンのクリックイベント変更----------------------------------------------------
        const searchRange=document.querySelector('p[align="center"]');
        const cancelButton = searchRange.querySelector("button"); //キャンセルボタン
        const executeButton  = searchRange.querySelector("input");
        searchRange.insertBefore(document.createElement("p"),executeButton);
        cancelButton.style.border="1px solid #000";
        cancelButton.classList.add("ml-1","mr-5");
        cancelButton.addEventListener("click",(e) =>{
            e.preventDefault();
            const toDashboard = document.querySelector("#page-navbar > nav > ol > li:nth-child(1) > a");
            toDashboard.click();
        });
        //----------"非表示の項目を隠す"ボタン--------------------------------------------------------------
        const hiddenItemInv = document.createElement("button");
        hiddenItemInv.textContent="非表示の項目を表示する";
        hiddenItemInv.style.border="1px solid #000";
        searchRange.appendChild(hiddenItemInv);
        let hide=true;
        
        const checkboxes=[...courseContainer.querySelectorAll('input[type="checkbox"]')];
        checkboxes.forEach((item)=> {
        if (item.checked) item.closest("tr").style.display="none"; //非表示の項目が隠されてるとき、チェックボックスを押したら非表示
        item.addEventListener("change",(e)=> {
            if (hide) {
                if (e.target.checked) {
                    e.target.closest("tr").style.display="none";
                }
                else {
                    e.target.closest("tr").style.display="";
                    console.log("checked added");
                }
            }
        });
        });
        //----------"非表示の項目を隠す"ボタンのクリックイベント--------------------------------------------------------------
        if (checkboxes.length>0) {
            hiddenItemInv.addEventListener("click",(e) =>{
            e.preventDefault();
            if (hide) {
                hide=false;
                hiddenItemInv.textContent="非表示の項目を隠す";
                checkboxes.filter(item=>item.checked).forEach((item)=> item.closest("tr").style.display="");
            }
            else {
                hide=true;
                hiddenItemInv.textContent="非表示の項目を表示する";
                checkboxes.filter(item=>item.checked).forEach((item)=> item.closest("tr").style.display="none");
            }
        });

        }

    }
}


///grabbingにならない