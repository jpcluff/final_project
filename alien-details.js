// Run handleDetailsPageLoad on document load
let counter = 0;
if (document.readyState === "loading") {
  // Loading hasn't finished yet
  document.addEventListener("DOMContentLoaded", handleDetailsPageLoad);
} else {
  // `DOMContentLoaded` has already fired
  handleDetailsPageLoad();
}

// Alien Details Overlay


// decide if the overlay should be opened or closed
// if originAction is "add" then open the overlay
function openOverlay(originAction) {
  if (originAction === "add") {
    openOverlay();
  }
    else {
        closeOverlay();
    }
}

const spanCloseOverlay = document.getElementById("overlay-closebtn");
const continueButton = document.getElementById("a-btn-continue");
if (spanOpenOverlay) {
  console.log("Listener added for spanOpenOverlay");
  spanOpenOverlay.addEventListener("click", openOverlay);
} else {
 closeOverlay();
  console.error("Element with ID 'openOverlay' not found.");
}
if (spanCloseOverlay) {
  console.log("Listener added for spanCloseOverlay");
  spanCloseOverlay.addEventListener("click", closeOverlay);
} else {
  // console.error("Element with ID 'overlay-closebtn' not found.");
}
if (continueButton) {
  console.log("Listener added for continueButton");
  continueButton.addEventListener("click", closeOverlay);
} else {
  // console.error("Element with ID 'a-btn-continue' not found.");
}

/* Close when someone clicks on the "x" symbol inside the overlay */
function closeOverlay() {
  document.getElementById("validatorOverlay").style.width = "0%";
}
// test value of originAction 
//  if add then flow logic must call function to generate the alien details from the alien overview list
//  else browse i.e. alienFound=true from a search then flow logic must call function to generate the alien details from the alien overview list
function handleDetailsPageLoad() {
    // Get the search value from query parameters
    const params = getQueryParams();
    const alienName = params.alienName;
    const originAction = params.originAction || 'browse'; // either 
    if (alienName) {
      console.log("Alien found! is " + alienFound + ". Building Search Results for " + searchValue);
      buildAlienDetailsElements(alienName, originAction);
    }
    else {
        console.error(alienName+"not found.");
    }
  }