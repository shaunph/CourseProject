/* 
TODO: 
handle malformed input to extractFileFromResponse
write the actual file, once one can determine the current user
*/

var exec = require('child_process').exec;
    fs = require('fs');
    http = require('http');
    os = require('os');
    path = require('path');
    url = require('url');
    util = require('util');
    bops = require('bufferOps.js');
    
/*
postReq will process the 
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
        //Make one huge data Buffer that holds the entire HTTP request data section
        var dataBuffer = bops.join(allChunks);
        //Extract the file
        var fileBuffer = extractFileFromResponse(dataBuffer);
        //TODO: Write code to write this buffer to a file after I can retreive the username of the current user
        //console.log("|"+fileBuffer.toString('ascii')+"|");
    });
};

function extractFileFromResponse(dataBuffer) {
        //Buffer representing the linefeed character
        var lineFeed = new Buffer(1);
        lineFeed[0]=10;
        
        var sepBuffer = dataBuffer.slice(0,bops.find(dataBuffer,lineFeed)-1);
        console.log(sepBuffer.toString('ascii'));
        //Find the filename
        
        var startIndex = bops.find(dataBuffer,new Buffer("filename="))
        if (startIndex==-1) {
            //TODO: Write code to handle malformed input
        }
        //If filename is found, extract the actual contents of the file.
        //Go down three lines
        startIndex = bops.findAfter(dataBuffer,lineFeed,startIndex+1);
        startIndex = bops.findAfter(dataBuffer,lineFeed,startIndex+1);
        startIndex = bops.findAfter(dataBuffer,lineFeed,startIndex+1);
        //Now the LineFeed right before the file is in startIndex
        startIndex++;
        //Now the first byte of the file is at startIndex
        //Now to find the end index, we look for the "------#######" in the buffer
        //But since we don't want to add the extra CRLF, we subtract 2
        var endIndex = bops.findAfter(dataBuffer,sepBuffer,startIndex)-2
        if (endIndex==-1) {
            //TODO: Write code to handle malformed input
        }
        return dataBuffer.slice(startIndex,endIndex);
}