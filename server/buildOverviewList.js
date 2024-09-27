// import { writeFileSync } from "node:fs";
const fs = require('fs');
const path = require('path');

const alphabet = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"];
const countPlaceholderImg = 4;
const locatePlaceholderImg = "./images/placeholderImg/";

// Create a directory folder data to store the JSON files
try {
    fs.accessSync('server\\data')
} catch (err) {
    fs.mkdirSync('server\\data')
}

function randomNumberGenerator(limit) {
    return Math.floor(Math.random() * limit) + 1;
}

function setPlaceholderImg() {
    let imageNumber = randomNumberGenerator(countPlaceholderImg);
    let imgUri = locatePlaceholderImg+imageNumber+ "-alien.png" ;
    console.log("Created Image URI:" + imgUri);
    return imgUri;
}

async function createEmptyOverviewJson(letter) {
    letter = letter.toLowerCase();
    let datafile = `${letter}_alienOverviewList.json`;
    let filename = `server\\data\\${letter}_alienOverviewList.json`;
    let filePath = path.join(__dirname, 'data\\', datafile);
    console.log(`Checking if file ${filePath} exist`);
    if (fs.existsSync(filePath)) {
        console.log(`File ${filePath} already exists. Skipping creation.`);
        return;
    }
    // create a new array push defaultData then write new array to file
    let jsonArr = [];
    let defaultAlienName = `${letter}-alfName`;
    let imgOverview = setPlaceholderImg();
    let defaultData = {
        "name": defaultAlienName,
        "alienValidated": false,
        "creators": "creatorName-1, creatorName-2",
        "summary": "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam in nibh ullamcorper, pharetra elit vel, luctus dolor. Nullam viverra ligula velit, in ultricies tellus mattis ornare. Nunc id ante tellus. Sed in mollis purus. Vestibulum ante ipsum primis in faucibus orci luctus et ult",
        "imgOverview": imgOverview,
    };
    jsonArr.push(defaultData);
    let data = JSON.stringify(jsonArr);
    fs.writeFileSync(filename, data, "utf8", (err) => {
        if (err) {
            console.error("Error writing file:", err);
        } else {
            console.log(`File ${Filename} created successfully.`);
        }
    });
}

// Create the alienOverviewList JSON file for a given letter
function loopAlphabetCallCreateEmpty() {
    alphabet.forEach(letter => {
        createEmptyOverviewJson(letter);
    });
}

// Create the alienOverviewList JSON files for all letters 
loopAlphabetCallCreateEmpty();