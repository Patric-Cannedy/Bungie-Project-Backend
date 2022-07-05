let path = require('path');
let request = require('request');
let https = require('https');
let fs = require('fs');
let sql = require('sqlite3')
let definitions = require('./table.json');
const StreamZip = require('node-stream-zip');

require('../extractedManifest/test.txt');


let baseUrl = 'https://www.bungie.net';
let manifest = "/common/destiny2_content/sqlite/en/world_sql_content_9bc4fe33d850b7b81f11ce3111e4ab8c.content"
//english entry in the zip file that must be extracted
let en_option = 'world_sql_content_9bc4fe33d850b7b81f11ce3111e4ab8c.content'

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


// function queryManifest(){
// 	let db = new sql.Database('manifest.content', (err) => {
//         if (err) return console.error(err.messsage);
//         console.log('connection successful');
//     });

//     all_data = {}
// 	db.serialize(function(err){
		
// 		let query1 = `SELECT json_extract(DestinyInventoryDefinition.json, '$') AS Item
//         FROM DestinyInventoryItemDefinition, json_tree(DestinyInventoryItemDefinition.json, '$')
//         WHERE json_tree.key = 'name' AND UPPER(json_tree.value) LIKE UPPER('%Nameless%')` //use this code here to put in a variable for a serach later.
        
        
// 		// db.all(query1, (err, rows) => {
// 		// 	if (err) return console.error(err.messsage);
//         //     console.log(rows);

//         db.each(query1, function(err, row){
//                 if(err) throw err;
//             console.log(row);
   
        
//             // const myObject = { props: { match: {params: 'A new value'} } };

//             // const { props: { match: { params }, }, } = myObject;
        
// 		});
//         // db.close((err) = () => {
//         //     if (err) return console.error(err.message);
//         //     console.log('db closed')
//         // });
// 	});

// }


function queryManifest(){
	let db = new sql.Database('manifest.content', (err) => {
        if (err) return console.error(err.messsage);
        console.log('connection successful');
    });

    all_data = []
    // serialize makes it so that each line has to finish before the next starts
	db.serialize(function(){
		
		let query1 = `SELECT json_extract(DestinyInventoryItemDefinition.json, '$') AS ITEM
        FROM DestinyInventoryItemDefinition, json_tree(DestinyInventoryItemDefinition.json, '$')
        WHERE json_tree.key = 'name' AND UPPER(json_tree.value) LIKE UPPER('%Crown-Splitter%')` //use this code here to put in a variable for a serach later.
        
        
		db.get(query1, function(err, row){
			if(err) throw err;
            var parse = row.ITEM
            var fin = JSON.parse(parse);
            console.log(fin.displayProperties);
		console.log(fin.displayProperties.name);
        return fin
		});
            
console.log(fin)
        
	});

}


// getManifest();
queryManifest()


// dont forget to make queryManifest asynchronous

