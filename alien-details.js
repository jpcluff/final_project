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
const spanCloseOverlay = document.getElementById("overlay-closebtn");
const continueButton = document.getElementById("a-btn-continue");
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
if (continueButton) {
  console.log("Listener added for continueButton");
  continueButton.addEventListener("click", closeNav);
} else {
  // console.error("Element with ID 'a-btn-continue' not found.");
}
function openNav() {
  document.getElementById("validatorOverlay").style.width = "100%";
}
/* Close when someone clicks on the "x" symbol inside the overlay */
function closeNav() {
  document.getElementById("validatorOverlay").style.width = "0%";
}
// test value of alienFound 
//   TRUE then call function to build results page
//   FALSE then call function to build failed search page
function handleDetailsPageLoad() {
    // Get the search value from query parameters
    const params = getQueryParams();
    const alienName = params.alienName;
    // Get the alienFound value from query parameters
    const originAction = params.originAction || 'browse';
    if (alienName) {
      console.log("Alien found! is " + alienFound + ". Building Search Results for " + searchValue);
      buildAlienDetailsElements(alienName, originAction);
    }
    else {
        console.error("AlienName not found.");
    }
  }