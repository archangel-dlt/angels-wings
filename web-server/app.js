const express = require('express');
const fileUpload = require('express-fileupload');
const path = require('path');
const logger = require('morgan');
const fingerprint = require('./actions/fingerprint-action');

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
app.get('/fingerprint', fingerprint);

module.exports = app;
