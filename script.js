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
let alienRefList = JSON.parse('[{"name":"Aaamazzarite","source":"Star Trek: The Motion Picture"},{"name":"Aalaag","source":"Gordon R. Dickson\'s Way of the Pilgrim"},{"name":"Aaroun","source":"The Orville"},{"name":"Abh","source":"Crest of the Stars"},{"name":"Abductors","source":"Squee"}]');
const Ajv = require('ajv');
const ajv = new Ajv();

const schema = {
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

const validate = ajv.compile(schema);

alienRefList.forEach((alien) => {
  const valid = validate(alien);
  if (!valid) {
    console.error(validate.errors);
  }
});

// Get input element and results list
let search = document.getElementById("search");
let results = document.getElementById("search-matching-list");
let searchButton = document.getElementById("search-button");
let currentFocusJSON = -1;
// Add event listener to input element

search.addEventListener("input", suggestAliens);
search.addEventListener("click", () => {
	search.select();
});
searchButton.addEventListener("click", () => {
	if(search.value !== "") {
		alert(search.value);
	}
});

function suggestAliens() {
    let suggest = [];
let input = this.value.trim();
if(input.length) {
    suggest = alienRefList.filter((keyword) => {
        return keyword.search.toLowerCase().includes(input.toLowerCase());
    });
}
displayJSON(suggest);
if(!suggest.length) {
    result.innerHTML = "";
}
}

function displayJSON(suggest) {
    currentFocusJSON = -1;
    const content = suggest.map((list) => {
        const alien = list.search;
        return `<li class="item" onclick="selectInputJSON('${alien}')">${HighlightJSON(alien)}</li>`;
    });

    // Clear previous results
    results.innerHTML = '';

    // Create a new li element
    const li = document.createElement('li');
    li.innerHTML = content.join("");

    // Append the li element to the results ul element
    results.appendChild(li);
}