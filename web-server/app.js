const express = require('express');
const path = require('path');
const logger = require('morgan');

const app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.get('/', (req, res) => res.redirect(301, '/index.html'));
app.use(express.static(path.join(__dirname, 'static')));

module.exports = app;
