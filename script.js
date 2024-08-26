// import fetch from "node-fetch";

// Toggle menu visibility
document.querySelector('.menu-toggle').addEventListener('click', menuToggle);
let menuOpen = false;
function menuToggle() {
  let menu = document.querySelector('.burger-menu');
  let menuToggleImg = document.getElementById('menu-toggle');
  let menuItems = document.querySelectorAll('.nav-item');
  let mainContainer = document.querySelector('.main-container'); // Get the main-container element
  if (!menuOpen) {
    menuToggleImg.src = "images/noun-close-crop.png";
    menuToggleImg.alt = "burger menu close";
    menu.style.backgroundColor = "white";
    menu.style.width = "100%";
    menuOpen = true;
    menuItems.forEach(listItem => {
    listItem.style.display = 'flex';
    });
    mainContainer.style.zIndex = '-1'; // Set z-index to -1 to push main container AND overlay behind menu
  } else {
    menuToggleImg.src = "images/noun-burger-menu-crop.png";
    menuToggleImg.alt = "burger menu open";
    menu.style.backgroundColor = "transparent";
    menu.style.width = "10%";
    menuOpen = false;
    menuItems.forEach(listItem => {
    listItem.style.display = "none";
    });
    mainContainer.style.zIndex = '0'; // Set z-index to 0 to bring main container AND overlay in front of menu
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
        searching = true;
        fetchAlienRefList(searchValue);
      }
      else {
        window.location.replace("search-results.html");
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
// Add event listener to search button
searchButton.addEventListener("click", () => {
  searching = true;
  let searchInput = search.value;
  window.open("search-results.html", "_self");
  console.log("Search button clicked with Search value: " + searchInput);
  // call search value validator
  console.log("Calling validateSearchValue with: " + searchInput);
  validateSearchValue(searchInput);
});

// Clear search list when backspace is pressed and search value is empty
search.addEventListener("keydown", function (event) {
  if ((event.key === "Backspace") && (search.value.length === 0)) {
    searching = false;
    clearSearchList();
  }
});

// Clear search list when clicking outside of search bar
document.addEventListener("click", function (event) {
  const searchBar = document.querySelector(".search-bar-container");
  if (!searchBar.contains(event.target) && searching) {
    searching = false;
    clearSearchList();
  }
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

function validateSearchValue(searchInput) {
  // Validate search value isn't empty
  if (searchInput.length === 0) {
    alert("Search value cannot be empty.");
    return;
  }
  // Validate search value contains hyphen character
  if (searchInput.includes("-")) {
    // TEMP UX
    console.log("Redirecting to search-results.html");
    window.location.replace("search-results.html");
    // call function to extract substring before hyphen
    // let alienName = extractSearchValue(searchInput);
    // call function to search for alien name in the let alienName = search.value.charAt(0);_alienOverviewList.json

    //TODO: Call searchOverviewList function
  } else {
    // No hyphen character, call generative search
    // TODO: call generative search function
  }
    // Error handling (if needed)
  console.log("Search Error from search value: " + searchInput);
  //call function to redirect to failed search page 
  //TODO: Redirect to failed search page
}

function failedSearch(searchInput) {


}

function extractSearchValue(searchInput) {
  let searchArray = searchInput.split("-");
  let alienName = searchArray[0].trim();
  let alienSource = searchArray[1].trim();
  console.log("Alien Name: " + alienName + ", Alien Source: " + alienSource);
  return alienName;
}

// Alien Details Overlay
/* Click temp span element to open */

const spanOpenOverlay = document.getElementById("span-open-validatorOverlay");
const spanCloseOverlay = document.getElementById("overlay-closebtn");
if (spanOpenOverlay) {
  console.log("Listener added for spanOpenOverlay");
  spanOpenOverlay.addEventListener("click", openNav);
} else {
  // console.error("Element with ID 'span-open-validatorOverlay' not found.");
}
if (spanCloseOverlay) {
  console.log("Listener added for spanCloseOverlay");
  spanCloseOverlay.addEventListener("click", closeNav);
} else {
  // console.error("Element with ID 'overlay-closebtn' not found.");
}



function openNav() {
  document.getElementById("validatorOverlay").style.width = "100%";
}

/* Close when someone clicks on the "x" symbol inside the overlay */
function closeNav() {
  document.getElementById("validatorOverlay").style.width = "0%";
}