const li = document.createElement("li");
const parentList = document.querySelector('ul[aria-labelledby = "sortingdropdown"]');
li.innerHTML ='<li><a class="dropdown-item" href="#" data-filter="sort" data-pref="lastaccessed" data-value="ul.displayorder asc" role="menuitem">任意の順番に並べ替える</a></li>';

if (parentList)
    parentList.appendChild(li);

