let menuOpen = false;

document.querySelector('.menu-toggle').addEventListener('click', menuToggle);

function menuToggle() {
    let menu = document.querySelector('.burger-menu');
    let menuToggleImg = document.getElementById('menu-toggle');
    let menuItems = document.querySelectorAll('.nav-item');
    if (!menuOpen) {
        menuToggleImg.src = "/images/noun-close-crop.png";
        menuToggleImg.alt = "burger menu close";
        // menu.style.backgroundColor = "white";
        menuOpen = true;
        menuItems.forEach(listItem => {
            listItem.style.display = 'flex';
        });
    } else {
        menuToggleImg.src = "/images/noun-burger-menu-crop.png";
        menuToggleImg.alt = "burger menu open";
        // menu.style.backgroundColor = "transparent";
        menuOpen = false; 
        menuItems.forEach(listItem => {
        listItem.style.display = 'none';
        });
    }
}

fetch('https://www.wikitable2json.com/api/List_of_fictional_alien_species:_B?keyRows=1')
    .then(response => response.json())
    .then(data => {
        let rawElement = document.getElementById('raw');
        if (rawElement) {
            rawElement.innerHTML = JSON.stringify(data, null, 2);
        } else {
            console.error('Error: Element with id "raw" not found.');
        }
    })
    .catch(error => {
        console.error('Error fetching data:', error);
    });