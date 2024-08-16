import express from 'express';
import { accessSync, mkdirSync, writeFileSync } from 'node:fs';
import fetch from 'node-fetch';
import path from 'path';

const app = express();
const __dirname = path.resolve();

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// using https://www.wikitable2json.com/ API to get table data from wikipedia 
const wikiurl = "https://www.wikitable2json.com/api/";
const wikiPageRoot = "List_of_fictional_alien_species:_";  
// key-value format using the first row as keys  
const keyRows= "?keyRows=1";
let alphabet = ["A"];
// ,"B","C","D","E","F","G","H","I","J","K","L","M","N","O","P","Q","R","S","T","U","V","W","X","Y","Z"]

app.get('/api/alien-list', async (req, res) => {
    try {
        const fetchPromises = alphabet.map(letter => 
            fetch(wikiurl + wikiPageRoot + letter + keyRows)
                .then(response => response.json())
                .then(data => ({ letter, data }))
        );

        const results = await Promise.all(fetchPromises);

        writeFileSync('alienListRefData.json', JSON.stringify(results, null, 2));
        res.json(results);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching data' });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});