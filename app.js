
const express = require('express');
let http = require('http');
let path = require('path');
let logger = require('morgan');
let cookieParser = require('cookie-parser');
let bodyParser = require('body-parser');
const manifest = require('./routes/getManifest');
const port = process.env.PORT || 3000;
const host = '0.0.0.0';
const app = express();
let definitions = require('./apiRequest/table.json');
const router = express.Router();
const cors = require('cors');


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false })); 
app.use(cookieParser());
app.use('/search', manifest);
app.use(cors({
    origin: '*'
}));


app.listen(port, host, () => console.log('server is up'));

module.exports = app;