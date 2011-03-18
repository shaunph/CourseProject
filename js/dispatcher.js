var exec = require('child_process').exec,
    fs = require('fs'),
    http = require('http'),
    os = require('os'),
    pagemaker = require('./pagemaker'),
    path = require('path'),
    url = require('url'),
    util = require('util'),
    db = require('./SQLiteHelper'),
    qs = require('querystring');

var extTypes = [];
extTypes["html"]="text/html";
extTypes["htm"]="text/html";
extTypes["js"]="aplication/javascript";
extTypes["css"]="text/css";
extTypes["jpg"]="image/jpg";
extTypes["jpeg"]="image/jpg";
   
var docRoot = "static",
	dynamicRoot = "dynamic",
    errorRoot = "static/error_pages";

/*
error sends an error page in response to a bad request
*/
function error(request, response, code, file) {
    log(request, code, file);
    response.writeHead(code, {"Content-Type": "text/html"});
    util.pump(fs.createReadStream(errorRoot + "/" + code + ".html"), response, function(){});
}

/*
log logs a response sent by the server
*/
function log(request, statusCode, fileMatch) {
    strings = new Array(request.socket.remoteAddress, statusCode, request.url + "  ->  " + fileMatch);
    util.log(strings.join("\t"));
}

/* Upon receiving a request, try to match it with a file. If
   no corresponding file is found, respond with a 404 error page. In case
   an unresolvable exception is encountered, repond with a 500 error page. */
function resolve(request, response) {
    //If the user is posting data, call the POST resolver
    if(request.method=='POST') {
        resolvePost(request, response);
    //If the user is retreiving data, call the GET resolver
    } else if (request.method=='GET') {
        resolveGet(request,response);
    }
}

/*
Upon receiving a request, resolve will try to match it with a file. If
no corresponding file is found, respond with a 404 error page. The lookup
order is dynamic followed by static.
*/
function resolveGet(request, response) {

    var pathName = url.parse(request.url).pathname;
    var filePath;
    var handler;

    // If no file is specified, we want to send a index page
    if (pathName.charAt(pathName.length-1) == "/") { 
        // First look for a dynamic index
        filePath = process.cwd() + "/" + dynamicRoot + pathName + "index.js";
        path.exists(filePath, function(exists) {
            // If it exists, send it.
            if (exists) {
                log(request, 200, filePath);
                handler = require(filePath);
                handler.getReq(request,response);
            }
            
            // If not, check for a static index
            else {
                filePath = process.cwd() + "/" + docRoot + pathName + "index.html";
                path.exists(filePath, function(exists) {
                    // If it exists, send it.
                    if (exists) {
                        sendStaticObj(request, response, filePath);
                    } else {
                        // If neither exist, send a 404
                        error(request, response, 404, file);
                        console.log("ERROR: file requested does not exist: " + file);
                    }
                });
            }
        });
    } else {
        // if the url does not contain "?", we assume it is static content.
        //THIS MAY NOT BE A SAFE ASSUMPTION
        if (request.url.indexOf("?") == -1)
        {
            filePath = process.cwd() + "/" + docRoot + pathName;
            sendStaticObj(request, response, filePath);
        } else {
            sendDynamicObj(request, response);
        }
    }
}
/* 
resolvePost is used to resolve a post request. All file uploads will be handled as follows:

In the HTML:
<form method=post name=upform action="/dir1/dir2/script.js">

will result in a form post calling postReq in the file: ./static/js/dir1/dir2/script.js

the code in the postReq function in script.js will handle the upload from there.
No posted data is even glanced at by the dispatcher.

Author: Mitchell Ludwig
*/
function resolvePost(request, response) {
    var pathname = process.cwd() + "/" + dynamicRoot + url.parse(request.url).pathname;
    //NOTE: No time to do a path.exists, it will take too long to execute and data will begin to arrive before it is processed.
    try {
        console.log("File POST with: " + pathname);
        var handler = require(pathname);
        handler.postReq(request,response);
    } catch (err) {
        console.log("Error: " + error);
		error(request, response, 404, pathname);
    }
}

/*
sendStaticObj is used to simply send a static file in response to a
GET request for a static object
*/
function sendStaticObj(request, response, file) {
    var extension = file.split(".").pop();

    path.exists(file, function(exists) {
        if (exists) {
            log(request, 200, file);
            response.writeHead(200, {'Content-Type': extTypes[extension]});
			//TODO: Add code here so that the static content utilizes
			//the page maker code.
            util.pump(fs.createReadStream(file), response, function() {});
        } else {
            error(request, response, 404, file);
            console.log("ERROR: file requested does not exist: " + file);
        }
    });
}

/*
sendDynamicObj runs getReq(request,response) in the js file found at url.pathname
To make a dynamic page, the js file serving the dynamic page must have a exported
function called getReq (exports.getReq=function(request,response){...};
*/
function sendDynamicObj(request, response) {
    var pathname = process.cwd() + "/" + dynamicRoot + url.parse(request.url).pathname;
    //NOTE: No time to do a path.exists, it will take too long to execute and data will begin to arrive before it is processed.
    try {
        console.log("File GET with: " + pathname);
        var handler = require(pathname);
        handler.getReq(request,response);
    } catch (err) {
        error(request, response, 404, pathname);
    }
}

function init(args) {
    if (args.length != 3) {
        console.log("Usage: node dispatcher <port>");
    } else {
        /* if node is run from the js dir, cd back to the project root */
        dirArray = process.cwd().split("/");
        if (dirArray.pop() == "js") {
            process.chdir(dirArray.join("/"));
        }

        /* dies with exception if args[2] is not a number */
        port = Number(args[2]);
        http.createServer(resolve).listen(port);

        console.log("server listening on " + os.hostname() + ":" + port);
        console.log("date/time\t  remote ip\tstatus\trequest  ->  resolution");
    }
}


init(process.argv);
