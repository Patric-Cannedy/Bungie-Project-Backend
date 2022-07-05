var express = require('express');
let http = require('http');
var path = require('path');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
const manifest = require('./routes/getManifest');
const port = 3000;
const app = express();
let definitions = require('./apiRequest/table.json');
const router = express.Router();
const cors = require('cors');
// app.use('/manifest', manifest);

//body parser middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false })); 
app.use(cookieParser());
app.use('/search', manifest);
app.use(cors({
    origin: '*'
}));


app.listen(3000, () => console.log('server is up'));

module.exports = app;