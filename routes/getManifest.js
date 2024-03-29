require("dotenv").config();
let express = require('express');
let router = express.Router();
let path = require('path');
let request = require('request');
let https = require('https');
let fs = require('fs');
let sql = require('sqlite3')
let definitions = require('../apiRequest/table.json');
const StreamZip = require('node-stream-zip');
const port = process.env.PORT || 3000

let baseUrl = 'https://www.bungie.net';
let manifest = "/common/destiny2_content/sqlite/en/world_sql_content_c0b6f372037834a3fc8e8f12c3b02363.content"
//english entry in the zip file that must be extracted
let en_option = 'world_sql_content_c0b6f372037834a3fc8e8f12c3b02363.content'

let options = {
        url: baseUrl + manifest,
        port: 443,
        method: 'GET',
        encoding: null,
        headers: {
            'Content-Type': 'application/json',
            'X-API-Key': 'process.env.RANDOMER_API_TOKEN' 
        },
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
    let userInput = req.body.input
    let query =  `"%${userInput}%"`
    console.log(userInput)
    // serialize makes it so that each line has to finish before the next starts
	db.serialize(function() {
		console.log('connection successful');
		let userQuery = `SELECT json_extract(DestinyInventoryItemDefinition.json, '$') AS ITEM
        FROM DestinyInventoryItemDefinition, json_tree(DestinyInventoryItemDefinition.json, '$')
        WHERE json_tree.key = 'name' AND UPPER(json_tree.value) LIKE UPPER (${query})` //update later to send all tables for perks and lore data a join might be needed
  
        
		db.get(userQuery, (err, row) => {
			if(row) {
            let tableData = row.ITEM
            let itemData = JSON.parse(tableData);
            console.log(itemData)
            res.json(itemData);  
            } else {
                console.log('no rows found');
            }
                 
		});


	});
    db.close(console.log('db is closed'))

})


getManifest();
module.exports = router;