# Bungie-Project-Backend
Simple backend that contains the Destiny 2 Manifest

## Status
This project is currently in development. 
The functionality it does have is the abiliy to take inputs and return data to a front end.

## About The App
This app is acts as a simple database and server for my front end and acts as a method to extract the entire Destiny 2 manifest from bungie's API. 
It works by taking in a request from the front end, a user input, and downloading the manfiest from the api. It then extracts it and unzips it and can then be used as a database.
From there, the requested data from the user is set back as a response to be handled by the front end of my project.

## Technologies
This project primarily runs off of Node.Js with Express as a framework and utilizes SQLite3 to parse the SQLite files from the manifest. 
It uses other plugins and middleware to handle some of these processes additionally.
Also uses Nodemon as dev dependency to support on the fly changes

## Setup
Download or Clone the repo
"npm install" to install all dependencies
The app backend will start with the command "npx nodemon app.js" and runs on port 3000
Once a request is made from the front end it will log what its doing inside the console.

## My Approach and Reflections 
As I continued to learn modern Javascript, I wanted to start a project that utilized and API for my frontend. 
I chose the Destiny 2 API however, due to what is contained in it, it was structured as an SQLite database thus, I made this backend project to learn more how a front end intereact with a server and a database.
Initially, the scope was to provide any data requested from the manifest however, due to its depth and time restraints, I scaled it back to only provide information on items found throughout the game.

A big challenge I encountered was understanding the methods of which Bungie organized their data. I spent a few days famaliarizing myself with their documentation.
I also spent some time to understand Sql and SQLite databases and why they may have been the technologies that Bungie used in their API. 

In further iterations of the backend of my project, I plan to add asychronous methods, and to provide SQL queries that can search through all tables to provide more item information.
In addition, add the ability for it to serve information from the other tables inside the databse.
