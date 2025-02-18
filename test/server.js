const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();

app.use(express.static(__dirname));
console.log("Starting node app in", __dirname);

// Folder containing the text files
const TEXTS_FOLDER = path.join(__dirname, 'texts');

// Serve the index.html file
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Get all text files in the folder
app.get('/api/text-files', (req, res) => {
    fs.readdir(TEXTS_FOLDER, (err, files) => {
        if (err) {
            return res.status(500).json({ error: 'Failed to read files' });
        }
        const txtFiles = files.filter(file => file.endsWith('.txt'));
        res.json(txtFiles);
    });
});

app.listen(3000, () => {
    console.log('Server running at http://localhost:3000');
});
