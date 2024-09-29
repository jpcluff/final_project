// Run handleDetailsPageLoad on document load
import { getQueryParams } from "./script.js";

if (document.readyState === "loading") {
  // Loading hasn't finished yet
  document.addEventListener("DOMContentLoaded", handleDetailsPageLoad);
} else {
  // `DOMContentLoaded` has already fired
  handleDetailsPageLoad();
}

// Alien Details Overlay
function openOverlay() {
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

function replaceAlfname(alienName) {
  console.log("replaceAlfname: alienName=", alienName);

  const alfnameBanner = document.querySelector(".h2-alfname-banner");
  const alfname = document.querySelector(".h2-alfname");
  const alfnameAdd = document.getElementById("span-alfname-add");

  if (alfnameBanner) {
    alfnameBanner.innerHTML = alienName;
  } else {
    console.error("Element with class 'h2-alfname-banner' not found");
  }

  if (alfname) {
    alfname.innerHTML = alienName;
  } else {
    console.error("Element with class 'h2-alfname' not found");
  }

  if (alfnameAdd) {
    alfnameAdd.innerHTML = alienName;
  } else {
    console.error("Element with ID 'span-alfname-add' not found");
  }
}

// Toggle <span class="icon-validator">&check</span> to &#10008; based on checkbox checked state
function toggleIconValidator(checkBoxId) {
  const checkBox = document.getElementById(checkBoxId);
  const iconValidator = checkBox.nextElementSibling;
  if (iconValidator && iconValidator.tagName === "SPAN") {
    if (checkBox.checked) {
      iconValidator.innerHTML = "&check;";
      checkBox.setAttribute("aria-label", "checked");
    } else // not checked
    {
      iconValidator.innerHTML = "&#10008;";
      checkBox.setAttribute("aria-label", "not checked");
  }
}
}

function addListenersToCheckBoxes() {
  const checkBoxes = document.querySelectorAll("input[type='checkbox']");
  checkBoxes.forEach((checkBox) => {
    checkBox.addEventListener("change", () => {
      toggleIconValidator(checkBox.id);
    });
  });
}

// add event listeners to icon-validator-label
function addListenersToIconValidatorLabels() {
  const iconValidatorLabels = document.querySelectorAll(".icon-validator-label");
  iconValidatorLabels.forEach(
    (iconValidatorLabel) => {
      iconValidatorLabel.addEventListener("click", () => {
        const checkBox = iconValidatorLabel.firstElementChild;
        if (checkBox) {
          checkBox.checked = !checkBox.checked;
          toggleIconValidator(checkBox.id);
        }
      });
    }
  )
}



//  if add then flow logic must call function to generate the alien details from the alien overview list
//  else browse i.e. alienFound=true from a search then flow logic must call function to generate the alien details from the alien overview list
function handleDetailsPageLoad() {
  // Get the search value from query parameters
  const params = getQueryParams();
  console.log("handleDetailsPageLoad: params=", params);
  const alienName = params.alienName || "alfName";
  const originAction = params.originAction || 'browse'; // either
  if (originAction === 'add') {
    openOverlay();
  }
  else {
    closeOverlay();
  }
  replaceAlfname(alienName);
  addListenersToCheckBoxes();
 addListenersToIconValidatorLabels()  ;
}

// validatorOverlay element is open if originAction is "add"