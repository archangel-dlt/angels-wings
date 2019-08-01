const express = require('express');
const fileUpload = require('express-fileupload');
const path = require('path');
const logger = require('morgan');

const app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(fileUpload({
  useTempFiles : true,
  safeFileNames : true,
  preserveExtension : true,
  tempFileDir : '/tmp/'
}));

app.get('/', (req, res) => res.redirect(301, '/index.html'));
app.use(express.static(path.join(__dirname, 'static')));

app.post('/upload', function(req, res) {
  if (Object.keys(req.files).length == 0) {
    return res.status(400).send('No files were uploaded.');
  }

  // The name of the input field (i.e. "sampleFile") is used to retrieve the uploaded file
  let sampleFile = req.files.sampleFile;

  // Use the mv() method to place the file somewhere on your server
  sampleFile.mv('/somewhere/on/your/server/filename.jpg', function(err) {
    if (err)
      return res.status(500).send(err);

    res.send('File uploaded!');
  });
});

module.exports = app;
