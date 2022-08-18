require("dotenv").config();
var express = require('express');
var router = express.Router();
let path = require('path');
let request = require('request');
let https = require('https');
let fs = require('fs');
let sql = require('sqlite3')
let definitions = require('../apiRequest/table.json');
const StreamZip = require('node-stream-zip');


let baseUrl = 'https://www.bungie.net';
let manifest = "/common/destiny2_content/sqlite/en/world_sql_content_a32fd2a48a47c41fc8d1b8038d43fe27.content"
//english entry in the zip file that must be extracted
let en_option = 'world_sql_content_a32fd2a48a47c41fc8d1b8038d43fe27.content'

let options = {
        url: baseUrl + manifest,
        port: 443,
        method: 'GET',
        encoding: null,
        headers: {
            'Content-Type': 'application/json',
            'X-API-Key': 'process.env.RANDOMER_API_TOKEN' // hard coded for simplicity must hide in env file later!
        }
    };

//Bungie's api sends a sql db as a zip that must be extracted 
//Extracts it to my directory as manifest.content
function getManifest(){

    let outStream = fs.createWriteStream('manifest.zip');

    request(options)
    .on('response', function(res, body){
            console.log(res.statusCode);
        }).pipe(outStream)
        .on('finish', function(){
            const zip = new StreamZip({
                file: './manifest.zip',
                storeEntries: true
            });
            console.log('dowloaded');
             zip.on('ready', () => {
                zip.extract(en_option, './manifest.content', () => {
                   zip.close();
                   console.log('unzipped');
                });
            });  
        });
};

router.post('/', (req, res)=> {
   
    let db = new sql.Database('manifest.content', (err) => {
        if (err) return console.error(err.messsage);
            });
    var userInput = req.body.input
    var query =  `"%${userInput}%"`
    
    console.log(userInput)
    // serialize makes it so that each line has to finish before the next starts
	db.serialize(function() {
		console.log('connection successful');
		let userQuery = `SELECT json_extract(DestinyInventoryItemDefinition.json, '$') AS ITEM
        FROM DestinyInventoryItemDefinition, json_tree(DestinyInventoryItemDefinition.json, '$')
        WHERE json_tree.key = 'name' AND UPPER(json_tree.value) LIKE UPPER (${query})` //update later to send all tables for perks and lore data a join might be needed

        
		db.get(userQuery, (err, row) => {
			if(err) throw err;
            var tableData = row.ITEM
            var itemData = JSON.parse(tableData);
            console.log(itemData)
            res.json(itemData);       
		});


	});
    db.close(console.log('db is closed'))

})


getManifest();
module.exports = router;