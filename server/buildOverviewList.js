import { writeFileSync } from "node:fs";
import fetch from "node-fetch";

const alphabet = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"];
const countPlaceholderImg = 4;
const locatePlaceholderImg = "images/placeholderImg/";


function randomNumberGenerator(limit) {
    return Math.floor(Math.random() * limit) + 1;
}

function setPlaceholderImg() {
    let imageNumber = randomNumberGenerator(countPlaceholderImg);
    let imgUri = locatePlaceholderImg+imageNumber+ "-alien.png" ;
    console.log("Created Image URI:" + imgUri);
    return imgUri;
}

// Try to get the alienOverviewList JSON file for a given letter
export async function getAlienOverviewList(alienName) {
    const errorReturn = "failed";
    let firstLetter = alienName.charAt(0).toLowerCase();
    // DEBUG with hardcoded datafile
    //let datafile = "./server/a_alienOverviewList.json";
    let datafile = `${firstLetter}_alienOverviewList.json`;
    let path = "server\\" + firstLetter + "_alienOverviewList.json"
    try {
      console.log("Fetching datafile... " + datafile);
      const response = await fetch(path);
      if (!response.ok) {
        throw new Error(`Response status: ${response.status}`);
      }
      const alienDatafile = await response.json();
      return alienDatafile;
    } catch (error) {
      console.error(error.message);
      return errorReturn;
    }
  }

async function createEmptyOverviewJson(letter) {
    letter = letter.toLowerCase();
    console.log(`Checking if JSON file for letter ${letter} exists...`);
    const filename = `server\\${letter}_alienOverviewList.json`;
    let fileTest = await getAlienOverviewList(letter);
    if (fileTest !="failed") {
        console.log(`File ${filename} already exists.`);
        return;
    }
    console.log(`Creating JSON file for letter ${letter} with default data`);
    // create a new array push defaultData then write new array to file
    let jsonArr = [];
    let defaultAlienName = `${letter}-alfName`;
    let imgOverview = setPlaceholderImg();
    let defaultData = {
        "name": defaultAlienName,
        "alien": false,
        "creators": "creatorName-1, creatorName-2",
        "summary": "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam in nibh ullamcorper, pharetra elit vel, luctus dolor. Nullam viverra ligula velit, in ultricies tellus mattis ornare. Nunc id ante tellus. Sed in mollis purus. Vestibulum ante ipsum primis in faucibus orci luctus et ult",
        "imgOverview": imgOverview,
    };
    jsonArr.push(defaultData);
    let jsonFilename = `${letter}_alienOverviewList.json`;
    writeFileSync(jsonFilename, jsonArr, "utf8", (err) => {
        if (err) {
            console.error("Error writing file:", err);
        } else {
            console.log(`File ${jsonFilename} created successfully.`);
        }
    });
}

// Create the alienOverviewList JSON file for a given letter
function createEmptyOverviewJson() {
    alphabet.forEach(letter => {
        createEmptyOverviewJson(letter);
    });
}

// Create the alienOverviewList JSON files for all letters 
createEmptyOverviewJson();