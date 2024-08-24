// import fetch from "node-fetch";

// Toggle menu visibility
document.querySelector('.menu-toggle').addEventListener('click', menuToggle);
let menuOpen = false;
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


// load & validate alienRefList from JSON file then populate datalist
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

// Get input element and clear search list
let searching = false;
const acceptableChars = /^[A-Za-z]+$/;
let search = document.getElementById("search");
let searchList = document.getElementById("search-list");
let searchButton = document.getElementById("search-button");

function clearSearchList() {
  console.log("Cleared search list");
  searchList.innerHTML = "";
}

// Add event listeners to search bar element to handle key presses
search.addEventListener("input", function onFirstInput(event) {
  let searchValue = search.value.charAt(0);
  console.log("Searching started: " + searching + ", typed value:" + searchValue);
  if (searchValue.length > 0) {
    if (!acceptableChars.test(searchValue)) {
      alert("Invalid input. Search must start with a letter.");
      console.log("Invalid character");
      search.value = "";
      return;
    } else {
      if (!searching) {
        fetchAlienRefList(searchValue);
        searching = true;
      }
      else {
        // console.log("Already searching");
      }
    }
  }
  else {
    // search value lenght is 0
    searching = false;
    clearSearchList();
  }
})

// Clear search list when backspace is pressed and search value is empty
search.addEventListener("keydown", function (event) {
  if ((event.key === "Backspace") && (search.value.length === 0)) {
    searching = false;
    clearSearchList();
  }
});

// Clear search list when clicking outside of search bar
document.addEventListener("click", function (event) {
  if (!search.contains(event.target)) {
    searching = false;
    clearSearchList();
  }
});

searchButton.addEventListener("click", () => {
  let searchValue = search.value;
  console.log("Search button clicked with Search value: "+searchValue);
  // call search process display search results in same window  

});

// Populate datalist with alienRefList data
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