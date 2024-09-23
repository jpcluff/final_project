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
  const urlParams = new URLSearchParams(queryString);
  for (const [key, value] of urlParams.entries()) {
    params[decodeURIComponent(key)] = decodeURIComponent(value);
  }
  console.log("Params:" + JSON.stringify(params));
  return params;
}

// Function to get the alien overview from the ALfDb 
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
async function getMatchedAlienOverview(alienName) {
  let alienMatch = false; // LOCAL variable to store the result of the search
  let alienDataList = await getAlienOverviewList(alienName);
  if (!alienDataList) {
    console.log("No data returned from getAlienOverviewList");
    buildFailedSearchElements(alienName);
  }
  //else alienDataList is not empty
  for (let alien of alienDataList) {
    let dataAlienName = alien.name;
    dataAlienName = dataAlienName.toLowerCase();
    alienName = alienName.toLowerCase();
    if (dataAlienName === alienName) {
      alienMatch = true;
      const typeOfAlien = typeof alien;
      alert("Type of Alien Matched: "+typeOfAlien);
      // hardcode the return object for now
      alien = { "name": "Aaamazzarite", "alien": true, "creators": "Gene Roddenberry, Harold Livingston", "summary": "Peaceful isolationist species from planet Aaamazzara, known for their biochemical ability to create materials. They are members of the Federation but rarely leave their homeworld.", "imgOverview": "https://wiki.starbase118.net/wiki/index.php?title=File:Aaamazzarite.jpg" };
      return alien; // Return matched alien object
    }
  }
  buildFailedSearchElements(alienName); // match is false build failed search page
}


async function buildSearchResultsElements(searchValue) {
  // Get the search results from the API
  const matchedAlienObj = await getMatchedAlienOverview(searchValue);
  console("Search Results:" + JSON.stringify(matchedAlienObj));
  // Display the search results
  document.getElementById("page-count-max").innerHTML = "1";
  document.getElementById("result-count").innerHTML = "1";
  const mainContainer = document.querySelector(".main-container");
  const searchResultsSection = document.createElement("section");
  searchResultsSection.classList.add("search-results");
  const alienDetailsHrefElement = document.createElement("a");
  alienDetailsHrefElement.href = `../alien-details.html?alienName=${matchedAlienObj.name}`;
  alienDetailsHrefElement.classList.add("search-result-link");
  const h4alienName = document.createElement("h4");
  h4alienName.innerHTML = matchedAlienObj.name;
  h4alienName.classList.add("alfName");
  h4alienName.id = `alfName-${matchedAlienObj.name.toLowerCase()}`;
  const searchResultDiv = document.createElement("div");
  searchResultDiv.classList.add("search-result");
  const searchResultTextDiv = document.createElement("div");
  searchResultTextDiv.classList.add("search-result-text");
  const h5Overview = document.createElement("h5");
  h5Overview.innerHTML = "Overview";
  let pOverview = document.createElement("p");
  pOverview.classList.add("search-result-summary");
  pOverview.innerHTML = matchedAlienObj.summary;
  const searchResultImageDiv = document.createElement("div");
  searchResultImageDiv.classList.add("search-result-image");
  const imgAlien = document.createElement("img");
  imgAlien.src = matchedAlienObj.image;
  imgAlien.alt = matchedAlienObj.name;
  imgAlien.classList.add("img-search-result");
  searchResultImageDiv.appendChild(imgAlien);
  searchResultTextDiv.appendChild(h5Overview);
  searchResultTextDiv.appendChild(pOverview);
  searchResultDiv.appendChild(searchResultTextDiv);
  searchResultDiv.appendChild(searchResultImageDiv);
  alienDetailsHrefElement.appendChild(h4alienName);
  alienDetailsHrefElement.appendChild(searchResultDiv);
  searchResultsSection.appendChild(alienDetailsHrefElement);
  mainContainer.appendChild(searchResultsSection);
  createActionsSection();
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
  addButton.type = 'button';
  addButton.classList.add('action-button', 'add-button');
  addButton.textContent = 'Add Alien +';
  addButton.id = 'action-add-button';
  addButton.onclick = function () { window.location.href = '../add-alien.html'; };
  addButtonDiv.appendChild(addButton);

  // Create the browse button div
  const browseButtonDiv = document.createElement('div');
  browseButtonDiv.classList.add('submit');
  const browseButton = document.createElement('button');
  browseButton.type = 'button';
  browseButton.classList.add('action-button', 'browse-button');
  browseButton.id = 'action-browse-button';

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

// test value of alienFound 
//   TRUE then call function to build results page
//   FALSE then call function to build failed search page
function handlePageLoad() {
  // Get the search value from query parameters
  const params = getQueryParams();
  const searchValue = params.searchValue || '';
  // Get the alienFound value from query parameters
  const alienFound = params.alienFound;
  if (alienFound === 'true') {
    console.log("Alien found! is " + alienFound + ". Building Search Results for " + searchValue);
    buildSearchResultsElements(searchValue);
  }
  else {
    buildFailedSearchElements(searchValue);
  }
}

