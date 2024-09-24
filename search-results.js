// Run handlePageLoad on document load
let counter = 0;
if (document.readyState === "loading") {
  // Loading hasn't finished yet
  document.addEventListener("DOMContentLoaded", handlePageLoad);
} else {
  // `DOMContentLoaded` has already fired
  handlePageLoad();
}
// function to get the alienOverviewList JSON file for the search results page
import { getAlienOverviewList } from './script.js';

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

// Search the alienOverviewList for alienName
async function getMatchedAlienOverview(alienName) {
  let alienMatch = false; // LOCAL variable to store the result of the search
  let alienDataList = await getAlienOverviewList(alienName); // IMPORTED function alienOverviewList from script.ks 
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
      return alien; // Return matched alien object
    }
  }
  buildFailedSearchElements(alienName); // match is false build failed search page
}

async function fetchImgtoBlob(imgUrl) {
   const defaultImg = "./images/placeholderImg/3-alien.png";
    // Fetch the image, convert to Blob, and set the src attribute
    try {
      const response = await fetch(imgUrl,{ mode: 'no-cors' });
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const blob = await response.blob();
      const objectURL = URL.createObjectURL(blob);
      return objectURL;
    } catch (error) {
      console.error('Failed to fetch and decode image:', error);
      return defaultImg;
  }
}


async function buildSearchResultsElements(searchValue) {
  if (!searchValue) {
    console.error("No search value provided.");
    return;
  }
  // Get the search results from the API
  const matchedAlienObj = await getMatchedAlienOverview(searchValue);
  console.log("Search Results:" + JSON.stringify(matchedAlienObj));
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
  const searchResultImageFigure = document.createElement("figure");
  searchResultImageFigure.classList.add("search-result-image");
  const searchResultImageFigCaption = document.createElement("figcaption");
  searchResultImageFigCaption.innerHTML = matchedAlienObj.name;
  searchResultImageFigure.appendChild(searchResultImageFigCaption);
  const imgAlien = document.createElement("img");
  imgAlien.src = await fetchImgtoBlob(matchedAlienObj.imgOverview);
  imgAlien.alt = matchedAlienObj.name;
  imgAlien.classList.add("img-search-result");
  searchResultImageFigure.appendChild(imgAlien);
  searchResultTextDiv.appendChild(h5Overview);
  searchResultTextDiv.appendChild(pOverview);
  searchResultDiv.appendChild(searchResultTextDiv);
  searchResultDiv.appendChild(searchResultImageFigure);
  alienDetailsHrefElement.appendChild(h4alienName);
  alienDetailsHrefElement.appendChild(searchResultDiv);
  searchResultsSection.appendChild(alienDetailsHrefElement);
  mainContainer.appendChild(searchResultsSection);
  createActionsSection();
  Array.from(document.getElementsByClassName("pagination-button")).forEach(button => {
    button.style.display = "none";
  });
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

