// Alien Details Overlay
/* Click temp span element to open */
const spanOpenOverlay = document.getElementById("span-open-validatorOverlay");
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