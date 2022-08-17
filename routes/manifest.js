const express = require('express');
const app = express();
const router = express.Router();
let path = require('path');
// let getManifest = require('../apiRequest/getManifest.js');
require('../extractedManifest/test.txt');
let definitions = require('../apiRequest/table.json');

router.get('/', (req, res, next)=>{
	res.json()
	});
if (process.env.NODE_ENV === "production") {
		app.use(express.static("build"));
		app.get("*", (req, res) => {
		  res.sendFile(path.resolve(__dirname,  "build", "index.html"));
		});
	  }

module.exports = router;