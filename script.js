let statesArray = [];
let optionList = [];
const minBee = 50; // initial bee size in pixels
const maxBee = 100; // maximum bee size in pixels
let swarmArray = [];
const swarmTime = 3000; // 1000 milliseconds = 1 second
const swarmSpeed = 10; //
const swarmCreateDelay = 3000; // 1 second delay before creating next bee
let swarming = false;
let intervalDuration = 1000 / 30; // 12 FPS
const cx = document.getElementById("canvas").getContext("2d");

// if the window is resized or clicked, reinitialize the bee size & canvas
window.addEventListener("resize", () => {
    // console.log("Resize Event Called");
    canvasSize();
    // controlSwarmSize(swarm.length);
});

// function to reset global variables swarm and cx
function resetSwarm() {
    swarmArray = [];
}

function resizeBee() {
    let { width, height } = canvasSize();
    let beeSize = Math.max(Math.min(width * 0.075, maxBee), minBee); // % of the canvas width, but not less than minBee and not greater than maxBee
    // console.log("ResizeBee Called. BeeSize: " + beeSize);
    return { width: beeSize, height: beeSize };
}

//centre the bee in the canvas
function beeStartPosition(resizedWidth, resizedHeight) {
    const { width, height } = canvasSize();
    // const dx = 133;
    // const dy = 239;
    const dx = Math.floor(width / 2 - resizedWidth / 2);
    const dy = Math.floor(height / 2 - resizedHeight / 2);
    const startPosition = { dx, dy };
    // console.log("BeeStartPosition Called. Dx & Dy Calculated: " + dx + "," + dy);
    logSizes();
    return startPosition;
}

//getting & setting the canvas size
function canvasSize() {
    cx.reset();
    let container = document.querySelector(".beehive-container");
    let rect = container.getBoundingClientRect();
    cx.canvas.width = rect.width+minBee;
    cx.canvas.height = rect.height;
    // console.log("CanvasSize Called. Canvas width" + rect.width + "canvas height" + rect.height);
    let canvasSize = { width: rect.width, height: rect.height };
    return canvasSize;
}


fetch("states-list.json")
    .then(response => {
        return response.json();
    })
    .then(stateList => {
        statesArray = stateList.states;
        for (const state of statesArray) {
            const dropdownList = document.querySelector("select");
            const optionValue = document.createElement("option");
            optionValue.value = state.code;
            dropdownList.appendChild(optionValue).textContent = state.name;
        }
    })

const dropdownButton = document.querySelector(".go-button");
const stopButton = document.querySelector(".stop-button");
stopButton.addEventListener("click", (e) => {
    stopSwarm();
});
dropdownButton.addEventListener("click", (e) => {
    pickState(e);
    // closeAlert();
    // canvasSize();
    // resetSwarm();
    // stopSwarm();
});

const alertClose = document.querySelector(".closebtn");
alertClose.addEventListener("click", closeAlert);

const dropdownDiv = document.getElementById("stateSelect");
dropdownDiv.addEventListener("click", function() {
    stopSwarm();
    closeAlert();
});


function pickState(e) {
    e.preventDefault()
    let stateSelected = document.getElementById("stateSelect").value
    // console.log(stateSelected);
    getYearPopulation(stateSelected);
}

function getYearPopulation(stateCode) {
    // console.log("GetYearPopulation Called");
    fetch("bee-statistics.json")
        .then(response => {
            return response.json();
        })
        .then(stateBeeData => {
            let stateBeeStatistics;
            let foundState = false;
            let stateYearPopArray = [];
            for (let i = 0; i < stateBeeData.length; i++) {
                if (stateBeeData[i].code === stateCode) {
                    stateBeeStatistics = stateBeeData[i];
                    foundState = true;
                    break;
                }
            }
            if (foundState) {
                for (const [key, value] of Object.entries(stateBeeStatistics)) {
                    if (key != "code") {
                        stateYearPopArray.push({ year: key, population: value });
                        stateYearPopArray.sort((a, b) => {
                            return a.year - b.year;
                        });
                        // sortYears(stateYearPopArray);
                    }
                }
                setSwarmYrPop(stateYearPopArray[0].year, stateYearPopArray[0].population);
                createSwarm(stateYearPopArray);
            } else {
                noBeeDataFound();
            }
        });
}

function noBeeDataFound() {
    // Handle case when no bee data found for selected state
    const alertDiv = document.querySelector(".alert");
    alertDiv.style.display = "flex";
    const alertText = document.getElementById("alertText");
    alertText.textContent = "No bee population data found for selected state";
    console.log("No bee population data found for the selected state");
}

function closeAlert() {
    const alertDiv = document.querySelector(".alert");
    alertDiv.style.display = "none";
}


function setSwarmYrPop(yrValue, popValue) {
    document.getElementById("stateYear").textContent = yrValue;
    document.getElementById("statePopulation").textContent = popValue;
}

function convertPopulationToTwoDigits(stateYearPopulationArray) {
    // console.log("ConvertPopulationToTwoDigits Called");
    let statePopulationArray = [];
    for (const yearPopulation of stateYearPopulationArray) {
        let population = yearPopulation.population;
        if (population !== null) {
            let populationString = population.toString();
            let populationStringBaseTen;
                if (populationString.length >= 6 && population < 1000000) {
                    populationStringBaseTen = populationString.slice(0, 2);
                } else if (populationString.length >= 5 && population < 100000) {
                    populationStringBaseTen = populationString.slice(0, 1);
                } else if (populationString.length <= 4) {
                    populationStringBaseTen = 1;
                }
                populationStringBaseTen = parseInt(populationStringBaseTen);
                let populationNumber = parseInt(population);
                populationNumber = populationNumber.toLocaleString()
                statePopulationArray.push({ year: yearPopulation.year, population: populationStringBaseTen, populationNumber: populationNumber });
            }
    }
    // console.log(statePopulationArray+"Type of"+typeof(populationStringTwoDigit));
    return statePopulationArray;
}

// function to accept stateYearPopulationArray to call convertPopulationToTwoDigitString then for each year in the array call controlSwarmSize
// swarmCreateDelay defined globally
function createSwarm(statePopulationArray) {
    let swarmPopulationArray = convertPopulationToTwoDigits(statePopulationArray);
    let i = 0;
    let statistic = swarmPopulationArray[i];
    let newPop = statistic.populationNumber;
    let newYr = statistic.year;
    let swarmSize = statistic.population;
    setSwarmYrPop(newYr, newPop);
    // controlSwarmSize(swarmSize);
    intervalId = setInterval(() => {
        if (i >= swarmPopulationArray.length) {
            // Stop all animations
            stopSwarm(intervalId);
            swarming = false;
            return;
        }
        console.log("CreateSwarm i:" + i);
        let statistic = swarmPopulationArray[i];
        let newPop = statistic.populationNumber;
        let newYr = statistic.year;
        let swarmSize = statistic.population;
        // console.log("CreateSwarm Called with Yr:" + newYr + "Pop:" + newPop + " Swarmsize:" + swarmSize);
        setSwarmYrPop(newYr, newPop);
        controlSwarmSize(swarmSize);
        i++;
    }, swarmCreateDelay);
}


function controlSwarmSize(swarmSize) {
    // console.log("Called Control SwarmSize: " + swarmSize);
    let currentSwarmSize = swarmArray.length;
    // console.log("CurrentSwarmSize: " + currentSwarmSize);
    if (swarmSize > currentSwarmSize) {
        let newBeePop = swarmSize - currentSwarmSize;
        // console.log("NewBeePop: " + newBeePop);
        increaseSwarm(newBeePop);
    } else if (swarmSize < currentSwarmSize) {
        let removeBeePop = currentSwarmSize - swarmSize;
        // console.log("RemoveBeePop: " + removeBeePop);
        decreaseSwarm(removeBeePop);
    } else {
        // console.log("swarmSize is already: " + swarmSize);
        return;
    }
}

async function increaseSwarm(newBeePop) { // add bees to the swarm array
    let currentSwarmSize = swarmArray.length;
    console.log("Adding bee to currentSwarmSize: " + currentSwarmSize);
    for (let i = 0; i < newBeePop; i++) {
        let newBee = await createBee();
        swarmArray.push(newBee);
    }
    console.log("Swarm: " + swarmArray.length);
        if (currentSwarmSize === 0) { // Only start the animation if it's not already running
            if (swarming === false) { // Only continue swarming if swarming is not false
                animateSwarm(swarmArray, cx);
            }    }
}
// remove bees from the swarm array
function decreaseSwarm(removeBeePop) {
    // console.log("Removing " + removeBeePop + " bees from currentSwarmSize: " + swarmArray.length);
    for (let i = 0; i < removeBeePop; i++) {
        let bee = swarmArray.pop();
        clearInterval(bee.beeIntervalId); // stop the animation for this bee
    }
    console.log("Swarm: " + swarmArray.length);
    animateSwarm(swarmArray, cx);
}

class Bee {
    constructor(image, size, position, speed, beeState, beeIntervalId) {
        this.image = image;
        this.dwidth = size.width;
        this.dheight = size.height;
        this.dx = position.dx;
        this.dy = position.dy;
        this.speed = speed;
        this.stepX = Math.random() * 2 - 1; // random x-axis direction from start position
        this.stepY = Math.random();
        this.beeState = beeState;
        this.beeIntervalId = beeIntervalId;
    }

    drawBee(cx) {
        cx.drawImage(this.image, this.dx, this.dy, this.dwidth, this.dheight);
    }

updateBee(cx, beeIntervalId) {
    this.beeIntervalId = beeIntervalId;
    if (this.beeState === "newBee") {
        this.stepX = this.stepX * this.speed;
        this.stepY = this.stepY * this.speed;
        this.beeState = "swarming";
    } else if (this.beeState === "swarming") {
        // Do not multiply stepX and stepY by speed
    }

    this.dx += this.stepX;
    if (this.dx + this.image.width > cx.canvas.width || this.dx < 0) {
        this.stepX = -this.stepX;
    }
    this.dy += this.stepY;
    if (this.dy + this.image.height > cx.canvas.height || this.dy < 0) {
        this.stepY = -this.stepY;
    }

    this.drawBee(cx);
}


    }

function createBee() {
    console.log("CreateBee Called");
    let beeImg = new Image();
    beeImg.src = "images/bumbee-plain.png";
    let newBee, size, position, speed, beeState, beeIntervalId;
    return new Promise((resolve, reject) => {
        beeImg.onload = function () {
            size = resizeBee();
            position = beeStartPosition(size.width, size.height);
            speed = swarmSpeed; // global variable
            beeState = "newBee";
            newBee = new Bee(beeImg, size, position, speed, beeState, beeIntervalId);
            resolve(newBee); // resolve the promise with the new bee to manage image src loading
        };
        beeImg.onerror = function () {
            reject(new Error('Failed to load image'));
        };
    });
}


function animateSwarm(swarmArray, cx) {
    console.log("animateSwarm Called.");
    swarming = true;
    let intervalId = setInterval(() => {
        // Clear the canvas at each interval
        cx.clearRect(0, 0, cx.canvas.width, cx.canvas.height);
        for (let bee of swarmArray) {
            if (swarming === false) {
            break}
            // If swarming is true update and draw each bee at each interval
            bee.updateBee(cx, intervalId);
            bee.drawBee(cx);
        }
    }, intervalDuration);
   return;
}


function stopSwarm(intervalId) {
    swarming = false;
    clearInterval(intervalId);
    for (let bee of swarmArray) {
        clearInterval(bee.beeIntervalId);
    }
        // Clear the canvas
    cx.clearRect(0, 0, cx.canvas.width, cx.canvas.height);
    resetSwarm();
    console.log("Swarm stopped.");
}

function checkDrawBee(drawBee) {
    if (!(drawBee.image instanceof Image)) {
        console.error('drawBee.image is not an Image object');
    }
    if (typeof drawBee.dx !== 'number') {
        console.error('drawBee.dx is not a number');
    }
    if (typeof drawBee.dy !== 'number') {
        console.error('drawBee.dy is not a number');
    }
    if (typeof drawBee.dwidth !== 'number') {
        console.error('drawBee.dwidth is not a number');
    }
    if (typeof drawBee.dheight !== 'number') {
        console.error('drawBee.dheight is not a number');
    }
}


function logSizes() {
    let canvasWidth = cx.canvas.width;
    let canvasHeight = cx.canvas.height;
    // console.log('Canvas width: ' + canvasWidth);
    // console.log('Canvas height: ' + canvasHeight);

    let beehiveContainer = document.querySelector('.beehive-container');
    let beehiveContainerWidth = beehiveContainer.offsetWidth;
    let beehiveContainerHeight = beehiveContainer.offsetHeight;
    // console.log('Beehive container width: ' + beehiveContainerWidth);
    // console.log('Beehive container height: ' + beehiveContainerHeight);
}
