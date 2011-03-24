/* 
Author of original code: Mitchell Ludwig

This is a modified version of the file upload code by Mitchell used to store tasks in the database (changed by Justin Kelly)
*/

var upops = require('uploadOps');
    
/*
Tries to store task in the database. After, redirect to main page
TODO: redirect to dynamic task display page
*/
exports.postReq = function (request, response) {
    var allChunks = [];
    var chunkCount = 0;
    var bops = require('bufferOps.js'); //Useful operations on Buffer objects
    var db = require('SQLiteHelper');
    var tsk = require('task');
    //Record all received chunks
    request.on('data', function (chunk) {
        allChunks[chunkCount] = chunk;
        chunkCount++;
    });
    //Once everything is received
    request.on('end', function () {
        //Make one huge data Buffer that holds the entire HTTP request data section
        var dataBuffer = bops.join(allChunks);
        //Extract the file from the data Buffer.
        try {
            var parsed = upops.parseMultipartFormdata(dataBuffer);
	    var date = new Date();
	    var aTask = new task(parsed["tNom"].toString(), parsed["desc"].toString(), parsed["ETR"].toString(), parsed["timeS"].toString(), parsed["priority"].toString(), parsed["status"].toString(), parsed["uNom"].toString(), date);
	    db.addTask(aTask);	  	   
	    
        } catch (error) {
            //Log errors
            console.log("Error in taskLoad.js->postReq: " + error);
        }
    });
    response.end('<meta http-equiv="refresh" content="0; URL=index.html">');
};
