const fs = require('fs-extra');
fs.move('./build/', './serve/automated-sdlc/app/', err => {

  if(err) return console.error(err);

  console.log('move success!');

});


const express = require('express');
const path = require('path');
const app = express();
const port = 3001;

//Serve static files from the build directory
app.use(express.static(path.join(__dirname, 'serve')));
app.get('/*', (req, res) => {
    res.sendFile(path.join(__dirname, 'serve', 'automated-sdlc/app/index.html'));
});


//Start the server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});