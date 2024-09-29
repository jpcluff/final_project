// Run handleDetailsPageLoad on document load
import { getQueryParams } from "./script.js";

let counter = 0;
if (document.readyState === "loading") {
  // Loading hasn't finished yet
  document.addEventListener("DOMContentLoaded", handleDetailsPageLoad);
} else {
  // `DOMContentLoaded` has already fired
  handleDetailsPageLoad();
}

// Alien Details Overlay
function openNav() {
  document.getElementById("validatorOverlay").style.width = "100%";
}
/* Close when someone clicks on the "x" symbol inside the overlay */
function closeOverlay() {
  document.getElementById("validatorOverlay").style.width = "0%";
}

const spanCloseOverlay = document.getElementById("overlay-closebtn");
const continueButton = document.getElementById("a-btn-continue");
try {
  if (spanCloseOverlay) {
    console.log("Listener added for spanCloseOverlay");
    spanCloseOverlay.addEventListener("click", closeOverlay);
  } 
  if (continueButton) {
    console.log("Listener added for continueButton");
    continueButton.addEventListener("click", closeOverlay);
  }
  
} catch (e) {
  console.error("Error adding event listeners for close and continue buttons");
}

function replaceH2(alienName) {
 document.getElementsByClassName("h2-alfname-banner").innerHTML = alienName;
 document.getElementsByClassName("h2-alfname").innerHTML = alienName;

}

//  if add then flow logic must call function to generate the alien details from the alien overview list
//  else browse i.e. alienFound=true from a search then flow logic must call function to generate the alien details from the alien overview list
function handleDetailsPageLoad() {
    // Get the search value from query parameters
    const params = getQueryParams();
    const alienName = params.alienName;
    const originAction = params.originAction || 'browse'; // either
   if (originAction === 'add') {
    openNav();
    }
    else {
      closeOverlay();
    } 
    replaceH2(alienName);
  }

 // validatorOverlay element is open is originAction is "add"