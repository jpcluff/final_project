let menuOpen = false;
document.querySelector('.menu-toggle').addEventListener('click', menuToggle);

function menuToggle() {
    let menuToggleImg = document.getElementById('menu-toggle');
    if (!menuOpen) {
        menuToggleImg.src = "/images/noun-close-crop.png";
        menuToggleImg.alt = "burger menu close";
        menuOpen = true;
    } else {
        menuToggleImg.src = "/images/noun-burger-menu-crop.png";
        menuToggleImg.alt = "burger menu open";
        menuOpen = false;
    }
}