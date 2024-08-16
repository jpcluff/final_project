import fs from 'fs';
import fetch from 'node-fetch'; // Check node-fetch installed
let menuOpen = false;
// using https://www.wikitable2json.com/ API to get table data from wikipedia 
const wikiurl = "https://www.wikitable2json.com/api/";
const wikiPageRoot = "List_of_fictional_alien_species:_";    
// key-value format using the first row as keys
const keyRows= "?keyRows=1";
let alphabet = ["A"];
// ,"B","C","D","E","F","G","H","I","J","K","L","M","N","O","P","Q","R","S","T","U","V","W","X","Y","Z"]

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


async function getAlienList() {
    try {
        const fetchPromises = alphabet.map(letter => 
            fetch(wikiurl + wikiPageRoot + letter + keyRows)
                .then(response => response.json())
                .then(data => ({ letter, data }))
        );

        const results = await Promise.all(fetchPromises);

        fs.writeFileSync('alienListRefData.json', JSON.stringify(results, null, 2));
        console.log('Data fetched and written to alienListRefData.json');
    } catch (error) {
        console.error('Error fetching data:', error);
    }
}

getAlienList();
