// schema for the Overview Prompt
const overviewObjOutputKeys = ["searchAlienName", "alienExists", "sourceType", "summary"];
const alienObjKeys = ["name", "alienValidated", "sourceTye", "summary", "imgOverview"];
const countPlaceholderImg = 4;
const locatePlaceholderImg = "./images/placeholderImg/";

function randomNumberGenerator(limit) {
  return Math.floor(Math.random() * limit) + 1;
}
function setPlaceholderImg() {
  let imageNumber = randomNumberGenerator(countPlaceholderImg);
  let imgUri = locatePlaceholderImg + imageNumber + "-alien.png";
  console.log("Created Image URI:" + imgUri);
  return imgUri;
}

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
    menu.style.width = "95%";
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

// START CODEBLOCK for Generative AI Prompt, call & response
const alienRefListObj = {
  "searchAlienName": " is for the name of a fictional science-fiction scifi alien species as a string from the prompt",
  "alienExists": " is for the boolean value either TRUE or FALSE indicating if a search finds the fictional alien lifeform exists in any published public sources.",
  "sourceType": " is if alienExists is TRUE then field is for single maxItems=1 the earliest known historical real+world published source of the fictional alien lifeform using an enum string",
  "summary": " is if alienExists is TRUE then field is for a short summary of the fictional alien lifeform with a maximum maxlength of 255 characters"
};
const promptConfirmIfAlien = 'You are a scifi fan. Is there a fictional alien species called "${searchValue}"? Structure response in a JSON UTF-8 encoded object format using this JSON schema if "${searchValue}" is found matching the name of a fictional science-fiction scifi alien species?';

function copyPromptText() {
  let promptText = document.querySelector(".overviewPrompt-text").textContent;
  navigator.clipboard.writeText(promptText);
}

function buildOverviewPromptElements(overviewPrompt) {
  let mainContainer = document.querySelector('.main-container'); // Get the main-container element	
  let statsElement = document.querySelector(".stats");
  if (statsElement) {
    statsElement.remove();
  }
  let overviewPromptSection = document.createElement("section");
  overviewPromptSection.className = "overviewPrompt-section";
  let overviewPromptLabel = document.createElement("div");
  overviewPromptLabel.className = "overviewPrompt-label";
  let overviewPromptH2 = document.createElement("h2");
  overviewPromptH2.innerHTML = "Generative AI Search - Overview Prompt";
  let overviewPromptCopyInstructionsContainer = document.createElement("div");
  overviewPromptCopyInstructionsContainer.className = "overviewPrompt-copy-instructions-container";
  let overviewPromptCopyInstructionsLabel = document.createElement("h3");
  overviewPromptCopyInstructionsLabel.className = "overviewPrompt-copy-instructions-label";
  overviewPromptCopyInstructionsLabel.innerHTML = "Copy the prompt below and paste it into the AI prompt field.";
  let promptCopyButton = document.createElement("button");
  promptCopyButton.type = "button";
  promptCopyButton.id = "promptCopy-button";
  promptCopyButton.className = "promptCopy-button";
  promptCopyButton.title = "Copy Prompt";
  promptCopyButton.setAttribute("aria-label", "Copy Prompt Text");
  promptCopyButton.addEventListener("click", copyPromptText);
  let promptCopyImg = document.createElement("img");
  promptCopyImg.src = "images/noun-correspondence-crop.png";
  promptCopyImg.alt = "copy prompt text button";
  promptCopyButton.appendChild(promptCopyImg);
  overviewPromptCopyInstructionsContainer.appendChild(overviewPromptCopyInstructionsLabel);
  overviewPromptCopyInstructionsContainer.appendChild(promptCopyButton);
  let overviewPromptText = document.createElement("pre");
  overviewPromptText.className = "overviewPrompt-text";
  overviewPromptText.innerHTML = overviewPrompt;
  overviewPromptSection.appendChild(overviewPromptCopyInstructionsContainer);
  overviewPromptSection.appendChild(overviewPromptText);
  if (mainContainer) {
    mainContainer.insertBefore(overviewPromptSection, mainContainer.firstChild);
  }
}

function constructOverviewPrompt(searchValue) {
  let extractedSearchValue = extractSearchValue(searchValue);
  let overviewPrompt = promptConfirmIfAlien.replace("${searchValue}", extractedSearchValue);
  overviewPrompt += "\n"; // Add newline character
  //iterate over alienRefListObj to construct prompt concatenating key & value
  for (let key in alienRefListObj) {
    let value = alienRefListObj[key];
    overviewPrompt += "\"" + key + "\"" + value;
    overviewPrompt += "\n"; // Add newline character
  }
  return overviewPrompt;
}

// Get search-box elements
let searching = false;
const acceptableChars = /^[A-Za-z]+$/;
const whiteSpace = /\s/g;
// global variable search to store search input value for finding & adding alien
const searchBoxInput = document.getElementById("search"); // Get the search-box input element
let searchDataList = document.getElementById("search-list"); // Get the search-list datalist element
const searchBar = document.getElementById("search-box"); // Get the search-box form element
// add event listener to search-box form to handle submit events
searchBar.onsubmit = overwriteSearchValue;

// START CODE BLOCK for cleaners
function clearSearchList(handler) {
  if (searching) {
    searching = false;
    console.log("Cleared search list");
    if (handler === "search-button" || handler === "search") {
      searchDataList.innerHTML = "";
      searchBoxInput.value = ""; // Clear the search input field
    }
    else if (handler === "add-search-input") {
      let searchListAdd = document.getElementById("search-list-add");
      searchListAdd.innerHTML = "";
      addSearchInput.value = ""; // Clear the add-search input field
    }
    else {
      console.log("Unexpected handler value: " + handler);
    }
  }
  else {
    console.log("Not actively searching");
  }
}
function cleanOutputPaste(text) {
  text = text.trim();
  text = text.replace(/(\r\n|\n|\r)/gm, "");
  return text;
}
//END CODE BLOCK for cleaners

// START CODEBLOCK POPULATE SEARCH-BAR DATA LIST for AUTO-COMPLETE

// Clear search list when clicking outside of the clear pseudo button for add-search input fields
document.addEventListener("click", function (event) {
  const searchClearElement = document.getElementById("search-clear");
  if (searchClearElement && (searchClearElement.contains(event.target))) {
    const handler = "add-search-input";
    clearSearchList(handler);
  }
});
// Clear search list when clicking outside of search bar or the clear pseudo button for both search & add-search input fields
document.addEventListener("click", function (event) {
  if (!searchBar.contains(event.target)) {
    const handler = "search-button";
    clearSearchList(handler);
  }
});


// Populate datalist with alienRefList data
function populateDatalist(alienRefList, handler) {
  alienRefList.forEach(alien => {
    let option = document.createElement("option");
    option.value = `${alien.name} - ${alien.source}`;
    if (handler === "search-button" || handler === "search") {
      searchDataList.appendChild(option);
    }
    else if (handler === "add-search-input") {
      let searchListAdd = document.getElementById("search-list-add");
      searchListAdd.appendChild(option);
    }
    else {
      console.log("Unexpected handler value: " + handler);
    }
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
function fetchAlienRefList(firstLetter, handler) {
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
      populateDatalist(alienDatafile, handler);
    })
    .catch(error => {
      console.error("Error fetching data:", error);
    });
}
//add event listener to search input to handle keyup events & populate search list
searchBoxInput.addEventListener("keyup", function (event) {
  let searchValue = searchBoxInput.value; // LOCAL variable to store search input value
  let firstLetter = searchValue.charAt(0);
  let handler = event.target.id;
  if (searchValue.length === 0) {
    clearSearchList(handler);
    // do nothing
  } else if (searchValue.length > 1) {
    searching = true;
    // Do nothing
  } else if (!searching && acceptableChars.test(firstLetter)) {
    searching = true;
    fetchAlienRefList(firstLetter, handler);
  } else if (!acceptableChars.test(firstLetter)) {
    alert("Search value must start with a letter.");
    clearSearchList(handler);
  }
  else {
    console.log("Search value already being fetched");
  }
});
// END HEADER POPULATE SEARCH-BAR DATA LIST for AUTO-COMPLETE

// START CODEBLOCK SEARCHING the ALfDb
// Redirect to search-results page with alien name, alienFound, originAction as query parameters
function redirectToResults(alienName, alienFound, originAction) {
  let typeTest = typeof alienFound
  console.log("Alien found? " + alienFound + ":" + typeTest + ", was looking for " + alienName);
  const searchParams = new URLSearchParams();
  searchParams.set('searchValue', alienName);
  searchParams.set('alienFound', alienFound);
  searchParams.set('originAction', originAction);
  console.log("Redirecting for: " + searchParams);
  window.location.assign(`search-results.html?${searchParams.toString()}`);
}
// Get the alienOverviewList from JSON file
export async function getAlienOverviewList(alienName) {
  let firstLetter = alienName.charAt(0).toLowerCase();
  // DEBUG with hardcoded datafile
  // let datafile = "./server/b_alienOverviewList.json";
  let datafile = "./server/data/" + firstLetter + "_alienOverviewList.json";
  try {
    console.log("Fetching datafile... " + datafile);
    const response = await fetch(datafile);
    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }
    const alienDatafile = await response.json();
    return alienDatafile;
  } catch (error) {
    console.error(error.message);
  }
}
// Search the alienOverviewList for alienName
async function searchAlienOverviewDb(alienName) {
  let alienFound = false;
  let alienDataList = await getAlienOverviewList(alienName);
  if (!alienDataList) {
    console.log("No data returned from getAlienOverviewList");
    return alienFound;
  }
  //else alienDataList is not empty
  for (let alien of alienDataList) {
    let dataAlienName = alien.name;
    dataAlienName = dataAlienName.toLowerCase();
    dataAlienName = dataAlienName.replace(whiteSpace, "");
    let alienNameString = alienName.toLowerCase();
    alienNameString = alienNameString.replace(whiteSpace, "");
    if (dataAlienName == alienNameString) {
      alienFound = true;
      return alienFound; // Return true immediately if alien is found
    }
  }
  return alienFound; // Return false if no match is found
}
// Extract an alien name from searchInput selected from datalist value
function extractSearchValue(searchInput) {
  let searchArray = searchInput.split("-");
  let alienName = searchArray[0].trim();
  return alienName;
}

// TODO export function askGenAIifAlienExists creates a prompt for AI using JSON schema & calls endpoint then awaits response then
//tests response if alienExists=true changes the originAction to "add" then calls function to generateAlienOverview then
// calls function to write new alien to alienOverviewList then calls function to redirectToResults with searchValue, alienFOund=true originAction=add
// if alienExists=false or no response then calls function to redirectToResults with searchValue, alienFOund=false, originAction

// Ask Gen AI if alien exists in database
export function askGenAIifAlienExists(searchValue, originAction) {
  console.log("Ask Gen AI if alien exists in database.");
  let overviewPrompt = constructOverviewPrompt(searchValue);
  buildOverviewPromptElements(overviewPrompt, originAction);
  // TO DO display prompt used to call the generative  AI endpoint
  // TO DO await response
  // TO DO call function test response
  // TO DO call function to generateAlienOverview
  // TO DO call the endpoint
  // TO DO await response
  // TO DO call function test response
  // TO DO call function to write new alien to alienOverviewList

}
// searchedValue is valid not empty
async function dataListUserInput(searchedValue, originAction) {
  let foundAlien = false;
  // Check if searchedValue is selected from datalist & not just a hyphen
  if (searchedValue.includes("-") && searchedValue.length > 1) {
    let alienName = extractSearchValue(searchedValue);
    foundAlien = await searchAlienOverviewDb(alienName);
    if (foundAlien) {
      redirectToResults(alienName, foundAlien, originAction);
    }
    // Alien Name not found in database
    else {
      foundAlien;
      console.log("Alien with hyphen: " + alienName + " not found in database. Ask Gen AI to add it.");
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
      console.log("Alien end else:" + searchedValue + "not found in database. Ask Gen AI to add it.");
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
    console.log("overwrite the global variable search with the add-search-input input value: " + searchValue);
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

// TODO ask Gen AI if alien exists in database

// add-search-input is for add-alien page. Add global event listener to add-search input to handle keyup events
const addSearchInput = document.getElementById("add-search-input");
if (addSearchInput) {
  addSearchInput.addEventListener("input", addAlienFormValidation);
}
// START CODEBLOCK for ADD-SEARCH Auto-Complete
if (addSearchInput) {
  addSearchInput.addEventListener("keyup", handleAddSearchInput);
}

function handleAddSearchInput(event) {
  console.log("add-search-input keyup event");
  let handler = event.target.id;
  let searchValue = addSearchInput.value; // LOCAL variable to store search input value
  let firstLetter = searchValue.charAt(0);
  if (searchValue.length === 0) {
    clearSearchList(handler);
    // do nothing
  } else if (searchValue.length > 1) {
    searching = true;
    // Do nothing
  } else if (!searching && acceptableChars.test(firstLetter)) {
    searching = true;
    fetchAlienRefList(firstLetter, handler);
  } else if (!acceptableChars.test(firstLetter)) {
    alert("Search value must start with a letter.");
    clearSearchList(handler);
  }
  else {
    console.log("Search value already being fetched");
  }
};
// END CODEBLOCK for ADD-SEARCH Auto-Complete

// START CODEBLOCK ADD-ALIEN FORM PROCESS
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

// Function to get query parameters
export function getQueryParams() {
  const params = {};
  const queryString = window.location.search.substring(1);
  const urlParams = new URLSearchParams(queryString);
  for (const [key, value] of urlParams.entries()) {
    params[decodeURIComponent(key)] = decodeURIComponent(value);
  }
  console.log("Params:" + JSON.stringify(params));
  return params;
}

function displayAlert(message) {
  let alertText = document.getElementById('alertText');
  alertText.innerHTML = message;
  alertText.style.display = "block";
  document.querySelector('.alert-box').style.display = "block";
  let alertDiv = document.querySelector('.alert');
  alertDiv.style.display = "block";
  alertDiv.style.backgroundColor = "red";
}

// function to validate the Overview prompt Output
async function validatePrompt(promptOutput) {
  let alertText = "";
  // DEBUG hardcode promptOutput
  promptOutput = '{"alienExists": true, "searchAlienName": "Abh", "sourceType": "book", "summary": "The Abh are a fictional alien species from the Crest of the Stars science fiction series by  William H. Keith Jr. The Abh are a technologically advanced,  humanoid species. They are known for their strong sense of community and their advanced technology. They are also known for their distinctive culture and their unique physiology."} '; // Example JSON
  // Clean the promptOutput string
  promptOutput = cleanOutputPaste(promptOutput);
  // Check if promptOutput is a valid JSON string
  if (!((promptOutput.startsWith('{') && promptOutput.endsWith('}')) || (promptOutput.startsWith('[{') && promptOutput.endsWith('}]')))) {
    console.log("Prompt Output is not valid JSON.");
    alertText = "Invalid JSON. Please paste a valid JSON object.";
    displayAlert(alertText);
    return false;
  }
  try {
    // if promptOutput is an array of objects [{}, {}]
    // count the number of objects in the array
    if (promptOutput.startsWith('[{') && promptOutput.endsWith('}]')) {
      // remove the square brackets from the string
      promptOutput = promptOutput.slice(1, -1);
      console.log("Prompt Output is an array of objects:", promptOutput);
    }
    // Parse the string
    const promptOutputObj = JSON.parse(promptOutput);
    // Use the const overviewObjOutputKeys for required output keys
    const requiredOutputKeys = overviewObjOutputKeys;
    const missingKeys = [];
    console.log("Prompt Output Object:", promptOutputObj);
    // Check for the presence of object keys
    for (let key of requiredOutputKeys) {
      if (!promptOutputObj.hasOwnProperty(key)) {
        missingKeys.push(key);
      }
    }
    // Log missing keys if any
    if (missingKeys.length > 0) {
      alertText = `Prompt Output is invalid. Missing keys: ${missingKeys.join(', ')}`;
      displayAlert(alertText);
      return false;
    }
    // Validate the required fields
    const { searchAlienName, alienExists } = promptOutputObj;
    if (searchAlienName && alienExists !== undefined) {
      console.log("Prompt Output is valid. All required values exist!");
      return true;
    } else {
      alertText = "Prompt Output is invalid. One or more required fields are missing or empty.";
      displayAlert(alertText);
      return false;
    }
  } catch (error) {
    alertText = "Error validating prompt output. Please paste a valid JSON object.";
    console.error("Error validating prompt output:", error);
    displayAlert(alertText);
    return false;
  }
}

async function createAlienObject() {
  const alienObj = new Object();
  // initialize the object adding alienObjKeys  keys
  alienObjKeys.forEach(key => {
    //add & initialize the alienObj object adding alienObjKeys keys & values
    alienObj[key]= "";
  }
  )
  if (alienObj.alienValidated) {
    alienObj.alienValidated = false; // Set alienValidated to boolean false
  }
  if (alienObj.imgOverview) {
    alienObj.imgOverview = await setPlaceholderImg(); // Set imgOverview to a placeholder image
  }
  return alienObj;
}

async function mapWriteAlienToOverviewList(overviewJson) {
  console.log("Mapping JSON object to alienOverviewList schema.");
  // DEBUG hardcode overviewJson
  overviewJson = '{"alienExists": true, "searchAlienName": "Abh", "sourceType": "book", "summary": "The Abh are a fictional alien species from the Crest of the Stars science fiction series by William H. Keith Jr. The Abh are a technologically advanced, humanoid species. They are known for their strong sense of community and their advanced technology. They are also known for their distinctive culture and their unique physiology."}'; // Example JSON
  try {
    let newAlien = await createAlienObject();
    let overviewObj = cleanOutputPaste(overviewJson);
    overviewObj = JSON.parse(overviewJson);
    let lowerCaseOverviewObj = {};
    for (let key in overviewObj) {
      if (overviewObj.hasOwnProperty(key)) {
        lowerCaseOverviewObj[key.toLowerCase()] = overviewObj[key];
      }
    }
    // Use the global const overviewObjOutputKeys to map the values from lowerCaseOverviewObj object to the newAlien object
    for (let key of overviewObjOutputKeys) {
      newAlien[key] = lowerCaseOverviewObj[key.toLowerCase()];
      console.log("Mapped key: " + key + " to value: " + lowerCaseOverviewObj[key.toLowerCase()] + " in newAlien object.");
    }
    return newAlien;
  }
  catch (error) {
    const alertText = "Error mapping JSON object to alienOverviewList schema.";
    console.error(alertText, error);
    displayAlert(alertText);
    return false;
  }
}

// function write the new alien to the filename = `server\\data\\${letter}_alienOverviewList.json`
async function writeAlienToOverviewList(newAlien) {
let alienName = newAlien.name;
let firstLetter = alienName.charAt(0).toLowerCase();
let datafile = `server\\data\\${firstLetter}_alienOverviewList.json`;
let filePath = path.join(__dirname, 'data\\', datafile);
console.log(`Checking if file ${filePath} exist`);
try {
  if (!fs.existsSync(filePath)) {
    alert(`File ${filePath} does not exist.`);
    return;
  }
  fs.accessSync(filePath);
}






}

async function pastePromptProcessor(event) {
  event.preventDefault();
  console.log('Form submitted');
    // Get the value of the textarea field #pastePromptOutput-input
  let pastePromptOutputInput = document.getElementById('pastePromptOutput-input');
  let pastePromptOutputValue = pastePromptOutputInput.value;
  console.log('Paste Prompt Value: ' + pastePromptOutputValue);
    // Call function to validate the prompt response
  let validationOutcome = await validatePrompt(pastePromptOutputValue);
  console.log("Validation Outcome: " + validationOutcome);
  if (validationOutcome === true) {
    // Call function to map the TRUE validated pasted prompt response to a new alien Overview
    let newAlienOverview = mapWriteAlienToOverviewList(pastePromptOutputValue);
    console.log("New Alien Overview: " + newAlienOverview);
    // Call function to write new alien to ${letter}_alienOverviewList

    // console.log('New Record written.Redirecting to search-results page.');
    // Redirect to search-results page
    // let queryParams = getQueryParams();
    // let searchValue = queryParams.searchValue;
    // let alienFound = queryParams.alienFound;
    // let originAction = queryParams.originAction;
    // redirectToResults(searchValue, alienFound, originAction);
  }
}

// Add the submit event listener to the element with ID pastePromptOutput-box
const pastePromptOutputBox = document.getElementById('pastePromptOutput-box');
if (pastePromptOutputBox) {
  pastePromptOutputBox.addEventListener('submit', pastePromptProcessor);
}