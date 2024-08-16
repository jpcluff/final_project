let menuOpen = false;

document.querySelector('.menu-toggle').addEventListener('click', menuToggle);

function menuToggle() {
    let menuToggleImg = document.getElementById('menu-toggle');
    let menuItems = document.querySelectorAll('.nav-item');
    
    if (!menuOpen) {
        menuToggleImg.src = "/images/noun-close-crop.png";
        menuToggleImg.alt = "burger menu close";
        menuOpen = true;
        menuItems.forEach(listItem => {
            listItem.style.display = 'flex';
        });
    } else {
        menuToggleImg.src = "/images/noun-burger-menu-crop.png";
        menuToggleImg.alt = "burger menu open";
        menuOpen = false; 
        menuItems.forEach(listItem => {
            listItem.style.display = 'none';
        });
    }
}