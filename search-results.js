// Run handlePageLoad on document load
let counter = 0;
if (document.readyState === "loading") {
  // Loading hasn't finished yet
  document.addEventListener("DOMContentLoaded", handlePageLoad);
} else {
  // `DOMContentLoaded` has already fired
  handlePageLoad();
}

// Function to get query parameters
function getQueryParams() {
  const params = {};
  const queryString = window.location.search.substring(1);
  const regex = /([^&=]+)=([^&]*)/g;
  let m;
  while (m = regex.exec(queryString)) {
    params[decodeURIComponent(m[1])] = decodeURIComponent(m[2]);
  }
  console.log(params);
  return params;
}

// test value of alienFound 
//   TRUE then call function to build results page
//   FALSE then call function to build failed search page
function handlePageLoad() {
  // Get the search value from query parameters
  const params = getQueryParams();
  const searchValue = params.searchValue || '';
  const alienFound = params.alienFound || false;

  if (alienFound === 'true') {
    // redirect to alien details page
    // TODO call function buildSearchResultsElements(searchValue);
  } else {
    buildFailedSearchElements(searchValue);
  }
}

// Build failed search page elements
function buildFailedSearchElements(searchValue) {
  document.getElementById("page-count-max").innerHTML = "1";
  document.getElementById("result-count").innerHTML = "No";
  Array.from(document.getElementsByClassName("pagination-button")).forEach(button => {
    button.style.display = "none";
  });
  Array.from(document.getElementsByClassName("search-results")).forEach(result => {
    result.style.display = "none";
  });
  // call createFailedSearchSection function
  createFailedSearchSection(searchValue);
  // call createActionsSection function
  createActionsSection();
  console.log("No match for Alien found: " + searchValue);
}

function createFailedSearchSection(searchValue) {
  const searchResultsSection = document.createElement("section");
  searchResultsSection.classList.add("search-results");
  const mainContainer = document.querySelector(".main-container");
  mainContainer.appendChild(searchResultsSection);
  const failedSearchMessage = document.createElement("h3");
  const h4alienName = document.createElement("h4");
  h4alienName.innerHTML = searchValue;
  failedSearchMessage.innerHTML = "No results found for " + h4alienName.outerHTML + " Try again or choose another action.";
  searchResultsSection.appendChild(failedSearchMessage);
}

// Function to create and append the actions section
function createActionsSection() {
  // Create the section element
  const actionsSection = document.createElement('section');
  actionsSection.classList.add('actions');
  // Create the actions label div
  const actionsLabelDiv = document.createElement('div');
  actionsLabelDiv.classList.add('actions-label');
  const actionsLabelH2 = document.createElement('h2');
  actionsLabelH2.textContent = 'Actions';
  actionsLabelDiv.appendChild(actionsLabelH2);

  // Create the add button div
  const addButtonDiv = document.createElement('div');
  addButtonDiv.classList.add('submit');
  const addButton = document.createElement('button');
  addButton.classList.add('action-button', 'add-button');
  addButton.type = 'button';
  addButton.textContent = 'Add Alien +';
  addButton.onclick = function () {window.location.href = '../add-alien.html'; };
  addButtonDiv.appendChild(addButton);

  // Create the browse button div
  const browseButtonDiv = document.createElement('div');
  browseButtonDiv.classList.add('submit');
  const browseButton = document.createElement('button');
  browseButton.classList.add('action-button', 'browse-button');
  browseButton.type = 'button';
  browseButton.textContent = 'Browse';
  browseButton.onclick = function () { window.location.href = '../browse-alien.html'; };
  browseButtonDiv.appendChild(browseButton);

  // Append all elements to the actions section
  actionsSection.appendChild(actionsLabelDiv);
  actionsSection.appendChild(addButtonDiv);
  actionsSection.appendChild(browseButtonDiv);

  // Append the actions section to the main container or any other parent element
  const parentElement = document.querySelector('.main-container'); // Change this selector as needed
  if (parentElement) {
    parentElement.appendChild(actionsSection);
  } else {
    console.error('Parent element not found.');
  }
}


