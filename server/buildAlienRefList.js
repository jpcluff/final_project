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
                    // Modify this part based on the structure of your JSON objects
                    newArray.push({
                        name: item.Name,
                        source: item.Source
                    });
                });
                return newArray;
            } else {
                console.error('Unexpected JSON structure');
                return [];
            }
        })
        .catch(error => {
            console.error('Error fetching data:', error);
            return [];
        });
}

function buildAlienRefList() {
    let alienRefList = [];
    let promises = [];
    alphabet.forEach(letter => {
        let url = `"${wikiurl + wikiPageRoot + letter + keyRows}"`;
        promises.push(fetchAndProcessData(url));
    });

    Promise.all(promises)
        .then(results => {
            results.forEach(result => {
                alienRefList = alienRefList.concat(result);
            });
            console.log(alienRefList);
        });
}