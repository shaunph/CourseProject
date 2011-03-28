var exec = require('child_process').exec,
    basepath = require('basepath').mainpath,
    fs = require('fs'),
    http = require('http'),
    os = require('os'),
    pagemaker = require('pagemaker'),
    path = require('path'),
    url = require('url'),
    util = require('util'),
    db = require('SQLiteHelper'),
    qs = require('querystring'),
    errorPage = require(basepath + '/static/error_pages/errorPage');

var extTypes = [];
extTypes["html"]="text/html";
extTypes["htm"]="text/html";
extTypes["js"]="aplication/javascript";
extTypes["css"]="text/css";
extTypes["jpg"]="image/jpg";
extTypes["jpeg"]="image/jpg";
extTypes["png"]="image/png";
extTypes["gif"]="image/gif";
   
var docRoot = "static",
    dynamicRoot = "dynamic",
    errorRoot = "static/error_pages";

/*
error sends an error page in response to a bad request
*/
function error(request, response, code, file) {
    log(request, code, file);
    response.writeHead(code, {"Content-Type": "text/html"});
    if(code != 200) {
        errorPage.getReq(request, response, code);
    }
}

/*
log logs a response sent by the server
*/
function log(request, statusCode, fileMatch) {
    strings = new Array(request.socket.remoteAddress, statusCode, request.url + "  ->  " + fileMatch);
    util.log(strings.join("\t"));
}

/*
Upon receiving a request, resolve will try to match it with a file. If
no corresponding file is found, respond with a 404 error page. The lookup
order is dynamic followed by static.
*/
function resolve(request, response) {
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
                handler = require(filePath);
                handler.getReq(request,response);
                log(request, 200, filePath);
            }
            // If not, check for a static index
            else {
                filePath = process.cwd() + "/" + docRoot + pathName + "index.html"; // Get the file location for static  
                sendStaticObj(request, response, filePath);
            }
        });
    } else {
        var dynamic = true;                                         // This is used to check if we should try
                                                                    // sending static content or not.
        filePath = process.cwd() + "/" + dynamicRoot + pathName;    // Get the file location where the dynamic file would be
        var extension = filePath.split(".").pop();                  // Get the file extension

        // Check if file is a js file, or if it has no extension
        if (extension != "js" && extension != filePath) {
            // If not, we dont want to bother trying to send dynamic content
            dynamic = false;
        } 
        // If there is no extension, append ".js"
        else if (extension == filePath) {
            filePath += ".js";
        }
        
        if (dynamic == true) {
            // NOTE: No time to do a path.exists, in the case of a post request it will take too
            // long to execute and data chuncks will begin to arrive before node can process it.
            try {
                handler = require(filePath);
                
                // If we are getting a post request, call the post function
                if (request.method=='POST') {
                    handler.postReq(request,response);
                } 
                // If we are getting a get request, call the get function
                else if (request.method=='GET') {
                    handler.getReq(request,response);
                }
                
                log(request, 200, filePath);
            } catch (err) {
                // If there was an error, it means no such dynamic page exists
				// It could also mean theres an error on the dynamic page.
                dynamic = false;
            }
        }
        
        // If no dynamic page was found, try static
        if (dynamic == false) {
            filePath = process.cwd() + "/" + docRoot + pathName;    // Get the file location for static
            sendStaticObj(request, response, filePath);
        }
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

            if(extension == "html" || extension == "htm") {

                pagemaker.ParsePage(file, function (html) {
                    response.end(html);
                });

            } else {
                util.pump(fs.createReadStream(file), response, function () {});
            }
        } else {
            error(request, response, 404, file);
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
    var extension = pathname.split(".").pop();
    if(extension!='js') {
        pathname = pathname + ".js";
    }
    //NOTE: No time to do a path.exists, it will take too long to execute and data will begin to arrive before it is processed.
    try {
        console.log("File GET with: " + pathname);
        var handler = require(pathname);
        handler.getReq(request,response);
    } catch (err) {
        console.log(err);
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
