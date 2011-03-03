/* 
Author: Mitchell Ludwig
TODO: 
write the actual file, once one can determine the current user
decide where to store profile pics.
*/

var exec = require('child_process').exec,
    fs = require('fs'),
    http = require('http'),
    os = require('os'),
    path = require('path'),
    url = require('url'),
    util = require('util'),
    bops = require('bufferOps.js'); //Useful operations on Buffer objects
    
/*
postReq will process the HTTP POST request, and extract the profile picture and save it as <username>.<ext> somewhere.
TODO: 
Decide where to store profile pics
write the actual file, once one can determine the current user
*/
exports.postReq = function (request, response) {
    var allChunks = [];
    var chunkCount = 0;
    
    //Record all received chunks
    request.on('data', function (chunk) {
        allChunks[chunkCount] = chunk;
        chunkCount++;
    });
    //Once everything is received
    request.on('end', function () {
	/* 
        The Buffer object is preferred for binary data over the string object because
        it is significantly faster and is capable of handling input similar to utf8
        characters without unintended side effects.
        The Buffer works directly on bytes, and the algorithm for building the dataBuffer
        object is O(n), rather than O(n^2) with the equivalent code allString += chunk
        This is because bops.join is called only once, as opposed to allString += chunk, 
        which is O(n), and is called O(n) times (once per chunk).
        For larger files, (5MB+), the Buffer object is a required alternative.
        */	
        //Make one huge data Buffer that holds the entire HTTP request data section
        var dataBuffer = bops.join(allChunks);
        //Extract the file from the data Buffer.
        try {
            var fileBuffer = bops.extractFileFromResponse(dataBuffer);
        } catch (error) {
            //Log errors
            console.log("Error in uploadpic.js->postReq: " + error);
        }
        //TODO: Write code to write this buffer to a file after I can retreive the username of the current user
        //console.log("|"+fileBuffer.toString('ascii')+"|");
    });
};