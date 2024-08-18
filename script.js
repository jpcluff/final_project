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

const wikiurl = "https://www.wikitable2json.com/api/";
const wikiPageRoot = "List_of_fictional_alien_species:_";    
// key-value format using the first row as keys
const keyRows= "?keyRows=1";
let alphabet = ["A"];
let letter = alphabet[0]; // ,"B","C","D","E","F","G","H","I","J","K","L","M","N","O","P","Q","R","S","T","U","V","W","X","Y","Z"]
let url = `${wikiurl + wikiPageRoot + letter + keyRows}`;

fetch(url)
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

         