/* 
Author of original code: Mitchell Ludwig

This is a modified version of the file upload code by Mitchell used to store tasks in the database
*/

var upops = require('uploadOps');
    
/*
postReq will process the HTTP POST request, and extract the profile picture and save it as <username>.<ext> somewhere.
TODO: 
Decide where to store profile pics
write the actual file, once one can determine the current user
*/
exports.postReq = function (request, response) {
    var allChunks = [];
    var chunkCount = 0;
    var bops = require('bufferOps.js'); //Useful operations on Buffer objects
    var db = require('SQLiteHelper');
    var tsk = require('task');
    var disp = require('./CourseProject/js/dispatcher');
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
	    var req = client.request('GET', '/');
	    req.end();
	    disp.sendStaticObj(req, response, "index");	   
	    
        } catch (error) {
            //Log errors
            console.log("Error in taskLoad.js->postReq: " + error);
        }
        //TODO: Write code to write this buffer to a file after I can retreive the username of the current user
        //console.log("|"+fileBuffer.toString('ascii')+"|");
    });
};
