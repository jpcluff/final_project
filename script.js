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
    menu.style.borderBottom = "solid 0.1rem black";
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
    menu.style.borderBottom = "none";
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

// Get search-box elements
let searching = false;
const acceptableChars = /^[A-Za-z]+$/;
// global variable search to store search input value for finding & adding alien
const searchBoxInput = document.getElementById("search"); // Get the search-box input element
let searchDataList = document.getElementById("search-list"); // Get the search-list datalist element
const searchBar = document.getElementById("search-box"); // Get the search-box form element
// add event listener to search-box form to handle submit events
searchBar.onsubmit = overwriteSearchValue;

// START CODEBLOCK POPULATE SEARCH-BAR DATA LIST for AUTO-COMPLETE
function clearSearchList() {
  if (searching) {
    searching = false;
    console.log("Cleared search list");
    searchDataList.innerHTML = "";
    searchBoxInput.value = ""; // Clear the search input field
  }
}
// Clear search list when clicking outside of search bar
document.addEventListener("click", function (event) {
  if (!searchBar.contains(event.target)) {
    clearSearchList();
  }
});
// Populate datalist with alienRefList data
function populateDatalist(alienRefList) {
  alienRefList.forEach(alien => {
    let option = document.createElement("option");
    option.value = `${alien.name} - ${alien.source}`;
    searchDataList.appendChild(option);
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
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    })
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
//add event listener to search input to handle keyup events & populate search list
searchBoxInput.addEventListener("keyup", function (event) {
  console.log("Search keyup event");
  let searchValue = searchBoxInput.value; // LOCAL variable to store search input value
  let firstLetter = searchValue.charAt(0);
  if (searchValue.length === 0) {
    clearSearchList();
    // do nothing
  } else if (searchValue.length > 1) {
    searching = true;
    // Do nothing
  } else if (!searching && acceptableChars.test(firstLetter)) {
    searching = true;
    fetchAlienRefList(firstLetter);
  } else if (!acceptableChars.test(firstLetter)) {
    alert("Search value must start with a letter.");
    clearSearchList();
  }
  else {
    console.log("Search value already being fetched");
  }
});
// END HEADER POPULATE SEARCH-BAR DATA LIST for AUTO-COMPLETE

// START CODEBLOCK SEARCHING the ALfDb
// Redirect to search-results page with alien name as query parameter
function redirectToResults(alienName, alienFound, originAction) {
  let typeTest = typeof alienFound
  alert("Alien found? " + alienFound + ":" + typeTest + ", was looking for " + alienName);
  // Redirect to search page with search value, alienFound, originAction as query parameters
  const searchParams = new URLSearchParams();
  searchParams.set('searchValue', alienName);
  searchParams.set('alienFound', alienFound);
  searchParams.set('originAction', originAction);
  console.log("Redirecting for: " + searchParams);
  window.location.assign(`search-results.html?${searchParams.toString()}`);
}
// Get the alienOverviewList from JSON file
async function getAlienOverviewList(alienName) {
  let firstLetter = alienName.charAt(0).toLowerCase();
  let datafile = "./server/a_alienOverviewList.json";
  // let datafile = `server/${firstLetter}_alienOverviewList.json`;
  try {
    const response = await fetch(datafile);
    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }
    const alienDatafile = await response.json();
    console.log(alienDatafile);
    return alienDatafile;
  } catch (error) {
    console.error(error.message);
  }
}
// Search the alienOverviewList for alienName
async function searchAlienOverviewDb(alienName) {
  let alienFound = false;
  let alienDataList = await getAlienOverviewList(alienName); // Await the asynchronous call
  if (!alienDataList) {
    console.log("No data returned from getAlienOverviewList");
    return alienFound;
  }
  //else alienDataList is not empty
  for (let alien of alienDataList) {
    if (alien.name.toLowerCase === alienName.toLowerCase) {
      alienFound = true;
      alert("Alien found in database: " + alien.name);
      return alienFound; // Return true immediately if alien is found
    }
  }
  alert("Alien not found in database: " + alienName);
  return alienFound; // Return false if no match is found
}
// Extract an alien name from searchInput selected from datalist value
function extractSearchValue(searchInput) {
  let searchArray = searchInput.split("-");
  let alienName = searchArray[0].trim();
  return alienName;
}
// searchedValue is valid not empty
async function dataListUserInput(searchedValue, originAction) {
  let foundAlien = false;
// Check if searchedValue is selected from datalist & not just a hyphen
 if (searchedValue.includes("-") && searchedValue.length > 1) {
    let alienName = extractSearchValue(searchedValue);
    foundAlien = await searchAlienOverviewDb(alienName);
     if (foundAlien) {
      alert("Hyphen Alien:"+alienName+"found in database.");
        redirectToResults(alienName, foundAlien, originAction);
      }
      // Alien Name not found in database
      else {
        foundAlien;
        alert("Alien:"+alienName+"not found in database. Ask Gen AI to add it.");
        askGenAIifAlienExists(searchedValue, originAction); 
      }
    }
  else {
  // searchedValue is user input not selected from datalist
  searchedValue = searchedValue.trim();
  foundAlien = await searchAlienOverviewDb(searchedValue);
  if (foundAlien) {
    redirectToResults(searchedValue, foundAlien, originAction);
  }
  else {
    alert("Alien:"+searchedValue+"not found in database. Ask Gen AI to add it.");
    askGenAIifAlienExists(searchedValue, originAction);
  }
}
}

// validate the search value from search-box & add-alien form then redirect to search-results page
async function validateSearchValue(searchedValue, originAction) {
  // Validate search value is empty
  if (searchedValue.length === 0 || searchedValue.trim() == '') {
    alert("Search value cannot be empty.");
    return;
  }
    // else Search value is not empty
    alert("Calling dataListUserInput because Search value is not empty: " + searchedValue);
    dataListUserInput(searchedValue, originAction);
}
// Overwrite search value to handle search value from add-alien form
function overwriteSearchValue(event) {
  event.preventDefault();
  let submitter = event.submitter;
  let handler = submitter.id;
  let searchValue = "";
  let originAction = "";
  if (handler === "search-button") {
    searchValue = searchBoxInput.value; // Get the search input value from global variable
    originAction = "search";
    validateSearchValue(searchValue, originAction); // Call function to validate search value
  }
  // Search value is from add-alien add-search input field
  else if (handler === "add-submit-button") {
    searchValue = addSearchInput.value;
    originAction = "add";
    alert("overwrite the global variable search with the add-search input value: " + searchValue);
    validateSearchValue(searchValue); // Call function to validate search value
  }
  else {
    console.log("OnSubmit data: " + event.name);
  }
}
// END CODEBLOCK SEARCHING the ALfDb

// START CODEBLOCK ADD-ALIEN FORM PROCESS
// enable add-submit-button if addSearch is not empty & addSourceSelect is not default
function addAlienFormValidation() {
  const othersourceTypes = document.getElementById("other-source-types-div");
  const othersourceTypesInput = document.getElementById("other-source-types");
  // if the addSearch is not null & source is not default, enable the submit button
  if (addSearchInput.value.trim() !== "" && addSourceSelect.value !== "default") {
    if (addSourceSelect.value === "other") {
      addSourceSelect.style.borderStyle = "dashed";
      othersourceTypes.style.display = "flex";
      othersourceTypesInput.style.borderWidth = "0.5rem";
      othersourceTypesInput.tabIndex = 3;
      // othersourceTypesInput.focus();
      addSubmitButton.disabled = false;
    }
    else {
      //toggle other source-types input field
      addSourceSelect.style.borderStyle = "solid";
      othersourceTypes.style.display = "none";
      othersourceTypesInput.tabIndex = "";
      addSubmitButton.disabled = false;
    }
  }
  else {
    console.log("Disable submit button");
    addSourceSelect.style.borderStyle = "solid";
    othersourceTypes.style.display = "none";
    othersourceTypesInput.tabIndex = "";
    addSubmitButton.disabled = true;
  }
};
// add-search is for add-alien page. Add global event listener to add-search input to handle keyup events
const addSearchInput = document.getElementById("add-search");
if (addSearchInput) {
  addSearchInput.addEventListener("input", addAlienFormValidation);
}
// add-submit-button is for add-alien page. Disable add-submit-button in ui by default
const addSubmitButton = document.getElementById("add-submit-button");
if (addSubmitButton) {
  addSubmitButton.disabled = true;
}
let addSourceSelect = document.getElementById("source-types");
if (addSourceSelect) {
  addSourceSelect.addEventListener("click", addAlienFormValidation);
}
const addAlienForm = document.getElementById("add-search-box");
if (addAlienForm) {
  addAlienForm.onsubmit = overwriteSearchValue;
}
// action-add-button is for opening the TEMP add-alien page
const addAlienButton = document.getElementById("action-add-button");
if (addAlienButton) {
  addAlienButton.addEventListener("click", function () {
    window.location.href = "add-alien.html";
  });
}
// END CODEBLOCK ADD-ALIEN FORM PROCESS