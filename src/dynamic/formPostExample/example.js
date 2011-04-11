/* 
Author: Mitchell Ludwig
TODO: 
write the actual file, once one can determine the current user
decide where to store profile pics.
*/

var pagemaker = require('pagemaker');
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
        page1 = new StandardPage(request);
        page1.setTitle("Test Page");
        page1.setContent("This is a dynamically generated test page <br />");
        page1.standardMenus();
        var parsed = upops.parseMultipartFormdata(dataBuffer);
        for(var i in parsed)
        {
            page1.addContent(i + ": " + parsed[i] + "<br />");
        }
        response.writeHead(200, {'Content-Type': 'text/html'});
        response.write(page1.toHTML());
        response.end();
    } catch (error) {
        //Log errors
        console.log("Error in uploadpic.js->postReq: " + error);
    }
    //TODO: Write code to write this buffer to a file after I can retreive the username of the current user
    //console.log("|"+fileBuffer.toString('ascii')+"|");
};
