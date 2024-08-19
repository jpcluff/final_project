import { accessSync, mkdirSync, writeFileSync } from "node:fs";
import fetch from "node-fetch";

// using https://www.wikitable2json.com/ API to get table data from wikipedia 
const wikiurl = "https://www.wikitable2json.com/api/";
const wikiPageRoot = "List_of_fictional_alien_species:_";    
// key-value format using the first row as keys
const keyRows= "?keyRows=1";
let alphabet = ["A"];
// ,"B","C","D","E","F","G","H","I","J","K","L","M","N","O","P","Q","R","S","T","U","V","W","X","Y","Z"]

function fetchAndProcessData(url) {
    return fetch(url)
        .then(response => response.json())
        .then(data => {
            // Assuming the JSON response structure is:
            // data = [ [ { ... }, { ... }, ... ] ]
            if (Array.isArray(data) && data.length > 0 && Array.isArray(data[0])) {
                let childArray = data[0];
                let newArray = [];
                childArray.forEach(item => {
                    newArray.push({
                        name: item.Name,
                        source: item.Source
                    });
                });
                return newArray;
            } else {
                console.error("Unexpected JSON structure");
                return [];
            }
        })
        .catch(error => {
            console.error("Error fetching data:", error);
            return [];
        });
}

function createAlienRefListJsonFile(alienRefListData, letter) {
    console.log(`Creating JSON file for letter ${letter} with data`);
    let json = JSON.stringify(alienRefListData);
    let filename = `server\\${letter}_alienRefList.json`;
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
    alphabet.forEach(letter => {
        let url = wikiurl + wikiPageRoot + letter + keyRows; // Construct the URL
        promises.push(
            fetchAndProcessData(url).then(result => {
                createAlienRefListJsonFile(result, letter);
            })
        );
    });

    Promise.all(promises)
        .then(() => {
            console.log("All JSON files created successfully.");
        })
        .catch(error => {
            console.error("Error processing data:", error);
        });
}

// Call the function to build the alien reference lists
buildAlienRefList();