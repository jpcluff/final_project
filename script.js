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

function clearSearchList() {
  searchList.innerHTML = "";
}

// Add event listeners to search bar element to handle key presses
search.addEventListener("input", function onFirstInput(event) {
  let searchValue = search.value.charAt(0);
  clearSearchList();
  if (searchValue.match(/^[A-Za-z]+$/)) {
    fetchAlienRefList(searchValue);
    // Remove the event listener after the first valid input
  } else if (event.inputType === "deleteContentBackward") {
    // Handle backspace input
    clearSearchList();
    search.removeEventListener("input", onFirstInput);
  } else if (searchValue.match(/[0-9]/)) {
    alert("Invalid input. Search must start with a letter.");
    console.log("Invalid input");
    return;
  }
});

search.addEventListener("keydown", function(event) {
  if (event.key === "Backspace") {
    clearSearchList();
  }
});

document.addEventListener("click", function(event) {
  if (!search.contains(event.target)) {
    clearSearchList();
  }
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