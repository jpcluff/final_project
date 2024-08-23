// import fetch from "node-fetch";

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

// Get input element and results list
let search = document.getElementById("search");
let searchList = document.getElementById("search-list");
let searchButton = document.getElementById("search-button");
let currentFocusJSON = -1;

// Add event listeners to search bar element to handle key presses
search.addEventListener("input", function onFirstInput() {
  let searchValue = search.value.charAt(0);
  searchList.innerHTML = "";
  if (!searchValue.match(/[a-zA-Z]/)) {
    alert("Invalid input. Search must start with a letter.");
    console.log("Invalid input");
    return;
  }
  fetchAlienRefList(searchValue);

  // Remove the event listener after the first input
  search.removeEventListener("input", onFirstInput);
});

searchButton.addEventListener("click", () => {
  console.log("Search button clicked");
  let searchValue = search.value;
  // call search process display search results in same window

});

function populateDatalist(alienRefList) {
  alienRefList.forEach(alien => {
    let option = document.createElement("option");
    option.value = `${alien.name} - ${alien.source}`;
    searchList.appendChild(option);
  });
}

function verifyFileData(data) {
  if (!Array.isArray(data)) {
    console.log("Data is not an array");
    return false;
  }
  for (let item of data) {
    if (typeof item !== "object" || item === null) {
      console.log("Item is not an object:", item);
      return false;
    }
    if (typeof item.name !== "string" || typeof item.source !== "string") {
      console.log("Invalid object structure:", item);
      return false;
    }
  }
  return true;
}

function fetchAlienRefList(firstLetter) {
  let datafile = `data\\${firstLetter}_alienRefList.json`;
  fetch(datafile)
    .then(response => response.json())
    .then(alienDatafile => {
      if (!verifyFileData(alienDatafile)) {
        console.error("Unexpected structure");
        return [];
      }
      populateDatalist(alienDatafile);
    })
    .catch(error => {
      console.error("Error fetching data:", error);
    });
}