/* 
Author: Mitchell Ludwig
TODO: 
write the actual file, once one can determine the current user
decide where to store profile pics.
*/

var upops = require('uploadOps');
   
/*
postReq will process the HTTP POST request, and extract the profile picture and save it as <username>.<ext> somewhere.
TODO: 
Decide where to store profile pics
write the actual file, once one can determine the current user
*/
exports.postReq = function (request, response, dataBuffer) {
    //Extract the file from the data Buffer.
    try {
        var parsed = upops.parseMultipartFormdata(dataBuffer);
        console.log(parsed["uploadfile"].toString());
    } catch (error) {
        //Log errors
        console.log("Error in uploadpic.js->postReq: " + error);
    }
    //TODO: Write code to write this buffer to a file after I can retreive the username of the current user
    //console.log("|"+fileBuffer.toString('ascii')+"|");
};
