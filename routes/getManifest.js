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
let manifest = "/common/destiny2_content/sqlite/en/world_sql_content_c1d4ac435e5ce5b3046fe2d0e6190ce4.content"
//english entry in the zip file that must be extracted
let en_option = 'world_sql_content_c1d4ac435e5ce5b3046fe2d0e6190ce4.content'

let options = {
        url: baseUrl + manifest,
        port: 443,
        method: 'GET',
        encoding: null,
        headers: {
            'Content-Type': 'application/json',
            'X-API-Key': '4d80fc1c6b474ae5aa6c01cbc7912002'
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

router.post('/', (req, res, next)=> {
   
    let db = new sql.Database('manifest.content', (err) => {
        if (err) return console.error(err.messsage);
            });
    var test = req.body.input
    var userInput = test
    var query =  `"%${userInput}%"`
    
    console.log(test)
    // serialize makes it so that each line has to finish before the next starts
	db.serialize(function(){
		console.log('connection successful');
		let userQuery = `SELECT json_extract(DestinyInventoryItemDefinition.json, '$') AS ITEM
        FROM DestinyInventoryItemDefinition, json_tree(DestinyInventoryItemDefinition.json, '$')
        WHERE json_tree.key = 'name' AND UPPER(json_tree.value) LIKE UPPER (${query})`
        
        
		db.get(userQuery, (err, row) => {
			if(err) throw err;
            var obj = row.ITEM
            var parseData = JSON.parse(obj);
            var itemData = parseData //might have to adjust this later and add more rows for the data i need.
            console.log(itemData);
            res.json(itemData);
        
		});
	});
    db.close(console.log('db is closed'))

})


// getManifest();
module.exports = router;
