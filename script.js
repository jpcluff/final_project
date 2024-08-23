let menuOpen = false;

document.querySelector('.menu-toggle').addEventListener('click', menuToggle);

function menuToggle() {
    let menu = document.querySelector('.burger-menu');
    let menuToggleImg = document.getElementById('menu-toggle');
    let menuItems = document.querySelectorAll('.nav-item');
    if (!menuOpen) {
        menuToggleImg.src = "/images/noun-close-crop.png";
        menuToggleImg.alt = "burger menu close";
        // menu.style.backgroundColor = "white";
        menuOpen = true;
        menuItems.forEach(listItem => {
            listItem.style.display = 'flex';
        });
    } else {
        menuToggleImg.src = "/images/noun-burger-menu-crop.png";
        menuToggleImg.alt = "burger menu open";
        // menu.style.backgroundColor = "transparent";
        menuOpen = false;
        menuItems.forEach(listItem => {
            listItem.style.display = "none";
        });
    }
}


// load & validate alienRefList from JSON file

const alienRefListSchema = {
  "required": ["name", "source"],
  "properties": {
    "name": {
      "type": "string"
    },
    "source": {
      "type": "string"
    }
  }
};

let alienRefList = JSON.parse('[{"name":"Aaamazzarite","source":"Star Trek: The Motion Picture"},{"name":"Aalaag","source":"Gordon R. Dickson\'s Way of the Pilgrim"},{"name":"Aaroun","source":"The Orville"},{"name":"Abh","source":"Crest of the Stars"},{"name":"Abductors","source":"Squee"}]');


// Get input element and results list
let search = document.getElementById("search");
let searchList = document.getElementById("search-list");
let searchButton = document.getElementById("search-button");
let currentFocusJSON = -1;

// Add event listeners to search bar element to handle key presses
search.addEventListener("input", function onFirstInput() {
  let searchValue = search.value.charAt(0);
  let alienRefListFiltered = alienRefList.filter(alien => alien.name.toLowerCase().startsWith(searchValue.toLowerCase()));
  searchList.innerHTML = "";
  populateDatalist(alienRefListFiltered);

  // Remove the event listener after the first input
  search.removeEventListener("input", onFirstInput);
});

searchButton.addEventListener("click", () => {
console.log("Search button clicked");
  // if(search.value !== "") {
	// 	alert(search.value);
	// }
});

function populateDatalist (alienRefList) {
  alienRefList.forEach(alien => {
    let option = document.createElement("option");
    option.value = `${alien.name} - ${alien.source}`;
    searchList.appendChild(option);
  });
}