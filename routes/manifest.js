var express = require('express');
var router = express.Router();
let path = require('path');
// let getManifest = require('../apiRequest/getManifest.js');
require('../extractedManifest/test.txt');
let definitions = require('../apiRequest/table.json');

router.get('/Bungie-Project', (req, res, next)=>{
	res.json()
	});


module.exports = router;