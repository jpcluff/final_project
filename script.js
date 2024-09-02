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

// Get input element and clear search list
let searching = false;
const acceptableChars = /^[A-Za-z]+$/;
let search = document.getElementById("search");
let searchList = document.getElementById("search-list");
// let searchButton = document.getElementById("search-button");
const searchBar = document.getElementById("search-box");
searchBar.onsubmit = validateSearchValue;

function clearSearchList() {
  searching = false;
  console.log("Cleared search list");
  searchList.innerHTML = "";
  search.value = ""; // Clear the search input field
}

//add event listener to search input to handle keyup events
search.addEventListener("keyup", function (event) {
  console.log("Search keyup event");
  let searchValue = search.value;
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

//add event listener to search button to handle click events 
// searchButton.addEventListener("click", function (event) {
//   let searchValue = search.value;
//   console.log("Search button click event: " + searchValue);
//   validateSearchValue(searchValue);
// });

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

function validateSearchValue(searchInput) {
  searchInput.preventDefault();
  let searchValue = search.value;
  // Validate search value isn't empty
  if (searchValue.length === 0) {
    alert("Search value cannot be empty.");
    return;
  }
  // Validate search value contains hyphen character
  else if (searchValue.includes("-")) {
    // TEMP UX
    console.log("Hyphen character detected in " + searchValue);
    // call function to extract substring before hyphen
    let alienName = extractSearchValue(searchValue);
    // check alienName is valid then call function to search for alien name in the alienName+ _alienOverviewList.json
    if (typeof alienName === 'string' && alienName.trim() !== '') {
      console.log("getAlienOverviewList called with alienName: " + alienName);
      getAlienOverviewList(alienName);
    } else {
      console.error("Invalid alien name extracted: " + alienName);
    }
  } else {
    // No hyphen character, call generative search
    alert("NO hyphen character detected.");
    // TODO: call generative search function
  }
  // Error handling (if needed)
  console.log("Search Error from search value: " + searchValue);
  //call function to redirect to failed search page 
  //TODO: Redirect to failed search page
}

function getAlienOverviewList(alienName) {
  let firstLetter = alienName.charAt(0).toLowerCase();
  // let datafile = `server/${firstLetter}_alienOverviewList.json`; 
  let datafile = `server/a_alienOverviewList.json`;
  fetch(datafile)
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    })
    .then(alienDatafile => {
      parseAlienRefList(alienDatafile, alienName);
    })
    .catch(error => {
      console.error("Error fetching data:", error);
    });
}

function parseAlienRefList(alienDataList, alienName) {
    let alienFound = false;
    for (let alien of alienDataList) 
      {
      if (alien.name === alienName) 
        {
        alienFound = true;
        break;
      }
    }
    if (alienFound) 
      {
      // TODO call function to build & redirect to alien details page     
      alert("Alien found: " + alienName);
    }
  else {
    // TODO call function to redirect to failed search page
    failedSearch(alienName);
    alert("No match for Alien found: " + alienName);
  }
}

function failedSearch(searchValue) {
  console.log("Alien not found: " + searchValue);
  // Redirect to failed search page
  window.location.assign("search-results.html");

  // Delay DOM manipulation to ensure the new page has loaded
  setTimeout(() => {
    document.getElementById("page-count-max").innerHTML = "0";
    document.getElementById("result-count").innerHTML = "No";
    Array.from(document.getElementsByClassName("pagination-button")).forEach(button => {
      button.style.display = "none";
    });
    document.getElementById("main-container").innerHTML = ""; // Clear the main container
    Array.from(document.getElementsByClassName("actions")).forEach(action => {
      action.style.display = "inline";
    });
    const searchResultsSection = document.createElement("section");
    searchResultsSection.classList.add("search-results");
    const mainContainer = document.querySelector(".main-container");
    mainContainer.appendChild(searchResultsSection);
    const failedSearchMessage = document.createElement("h3");
    failedSearchMessage.innerHTML = `No results found for ${searchValue}. Try again or choose another action.`;
    searchResultsSection.appendChild(failedSearchMessage);
  }, 1000); // Adjust the delay as needed
}

function extractSearchValue(searchInput) {
  let searchArray = searchInput.split("-");
  let alienName = searchArray[0].trim();
  let alienSource = searchArray[1].trim();
  console.log("Alien Name: " + alienName + ", Alien Source: " + alienSource);
  return alienName;
}

