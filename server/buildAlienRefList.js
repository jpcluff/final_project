import { accessSync, writeFileSync } from "node:fs";
import { mkdirSync } from 'fs';
import fetch from "node-fetch";

// using https://www.wikitable2json.com/ API to get table data from wikipedia 
const wikiurl = "https://www.wikitable2json.com/api/";
// endpoint delay to avoid any API rate limit 
const delayDuration = 1000;
const wikiPageRoot = "List_of_fictional_alien_species:_";
// key-value format using the first row as keys
const keyRows = "?keyRows=1";
const alphabet = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"];
const countPlaceholderImg = 4;
const locatePlaceholderImg = "images/placeholderImg/";


// Create a directory folder data to store the JSON files
try {
    accessSync('data')
} catch (err) {
    mkdirSync('data')
}

//  verify the response data structure 
function verifyResponseData(data) {
    if (!Array.isArray(data)) {
        return false;
    }
    if (data.length === 0 || !Array.isArray(data[0])) {
        return false;
    }
    if (data[0].length === 0 || typeof data[0][0] !== "object") {
        return false;
    }
    return true;
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

function fetchAndProcessData(url) {
    return fetch(url)
        .then(response => response.json())
        .then(data => {
            if (!verifyResponseData(data)) {
                console.error("Unexpected structure");
                return [];
            }
            let childArray = data[0];
            let newArray = [];
            childArray.forEach(item => {
                let imgOverview = setPlaceholderImg();
                newArray.push({
                    name: item.Name,
                    source: item.Source,
                    summary: item.Type,
                    imgOverview: imgOverview
                });
            });
            return newArray;
        })
        .catch(error => {
            console.error("Error fetching data:", error);
            return [];
        });
}

function createAlienRefListJsonFile(alienRefListData, letter) {
    let json = JSON.stringify(alienRefListData);
    letter = letter.toLowerCase();
    console.log(`Creating JSON file for letter ${letter} with data`);
    let filename = `data\\${letter}_alienRefList.json`;
    writeFileSync(filename, json, "utf8", (err) => {
        if (err) {
            console.error("Error writing file:", err);
        } else {
            console.log(`File ${filename} created successfully.`);
        }
    });
}

function buildAlienRefList() {
    let promises = [];
    // Delay to avoid hitting a rate limit
    let delay = 0;
    alphabet.forEach(letter => {
        let url = wikiurl + wikiPageRoot + letter + keyRows; // Construct the URL
        setTimeout(() => {
            promises.push(
                fetchAndProcessData(url).then(result => {
                    letter = letter.toLowerCase();
                    createAlienRefListJsonFile(result, letter);
                })
            );

            if (promises.length === alphabet.length) {
                Promise.all(promises)
                    .then(() => {
                        console.log("All JSON files created successfully.");
                    })
                    .catch(error => {
                        console.error("Error processing data:", error);
                    });
            }
        }, delay);

        delay += delayDuration; // Increase delay by 1 second for each iteration
    });
}

// Call the function to build the alien reference lists
// buildAlienRefList();
loopAlphabetCallCreateEmpty();

function loopAlphabetCallCreateEmpty() {
    alphabet.forEach(letter => {
        createEmptyAlienOverviewListJsonFile(letter);
    });
}

const fs = require('fs');
const path = require('path');

function createEmptyAlienOverviewListJsonFile(letter) {
    letter = letter.toLowerCase();
    let defaultAlienName = `${letter}-alfName`;
    let imgOverview = setPlaceholderImg();
    const defaultData = {
        "name": defaultAlienName,
        "alien": false,
        "creators": "creatorName-1, creatorName-2",
        "summary": "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam in nibh ullamcorper, pharetra elit vel, luctus dolor. Nullam viverra ligula velit, in ultricies tellus mattis ornare. Nunc id ante tellus. Sed in mollis purus. Vestibulum ante ipsum primis in faucibus orci luctus et ult",
        "imgOverview": imgOverview,
    };
    console.log(`Checking if JSON file for letter ${letter} exists...`);
    let filename = path.join(__dirname, `server`, `${letter}_alienOverviewList.json`);
    if (fs.existsSync(filename)) {
        console.log(`File ${filename} already exists. Skipping creation.`);
        return;
    }
    console.log(`Creating JSON file for letter ${letter} with default data`);
    const json = JSON.stringify(defaultData);
    // create a new array push defaultData then write new array to file
    let jsonArr = [];
    jsonArr.push(defaultData);
    fs.writeFileSync(filename, jsonArr, "utf8", (err) => {
        if (err) {
            console.error("Error writing file:", err);
        } else {
            console.log(`File ${filename} created successfully.`);
        }
    });
}
