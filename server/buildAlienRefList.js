import { accessSync, writeFileSync } from "node:fs";
import { mkdirSync } from 'fs';
import fetch from "node-fetch";

// using https://www.wikitable2json.com/ API to get table data from wikipedia 
const wikiurl = "https://www.wikitable2json.com/api/";
// endpoint delay to avoid any API rate limit 
const delayDuration = 1000;
const wikiPageRoot = "List_of_fictional_alien_species:_";    
// key-value format using the first row as keys
const keyRows= "?keyRows=1";
let alphabet = ["A", "B", "C", "D", "E", "F","G", "H", "I", "J", "K", "L","M", "N", "O", "P", "Q", "R","S", "T", "U", "V", "W", "X","Y", "Z"];


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
                newArray.push({
                    name: item.Name,
                    source: item.Source
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
    console.log(`Creating JSON file for letter ${letter} with data`);
    let json = JSON.stringify(alienRefListData);
    letter = letter.toLowerCase();
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
buildAlienRefList();