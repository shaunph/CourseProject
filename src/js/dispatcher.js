// NOTE: This list is alphabetized.
var basepath = require('basepath').mainpath,
    bops = require('bufferOps'),
    db = require('SQLiteHelper'),
    errorPage = require(basepath + '/dynamic/error_pages/errorPage'),
    exec = require('child_process').exec,
    fs = require('fs'),
    http = require('http'),
    os = require('os'),
    pagemaker = require('pagemaker'),
    path = require('path'),
    qs = require('querystring'),
    url = require('url'),
    util = require('util');

var extTypes = { "html" : "text/html",
                 "htm" : "text/html",
                 "js" : "text/javascript",
                 "css" : "text/css",
                 "jpg" : "image/jpg",
                 "jpeg" : "image/jpg",
                 "png" : "image/png",
                 "ico" : "image/vnd.microsoft.icon",
                 "gif" : "image/gif" };

var staticRoot = "static",
    dynamicRoot = "dynamic",
    errorRoot = "static/error_pages";

/*
error sends an error page in response to a bad request
*/
function error(request, response, code, file) {
    log(request, code, file);
    response.writeHead(code, {"Content-Type": "text/html"});
    if (code !== 200) {
        errorPage.getReq(request, response, code);
    }
}

/*
log logs a response sent by the server
*/
function log(request, statusCode) {
    /* get the current date/time, format is YYYY-MM-DD-HH:MM:SS */
    date = exec('date +"%F-%T"', function(error, stdout, stderr) {
        if (error == null) {
            /* chop the \n off the end of stdout and print all of the log data */
            console.log(stdout.substring(0, stdout.length-1) + "\t" + request.socket.remoteAddress + "\t" + statusCode + "\t" + request.url);
      } else {
            /* problem running 'date' */
            console.log("SYSTEM ERROR: could not generate date");
            return "";
      }
    });
}

/*
Upon receiving a request, resolve will try to match it with a file. If
no corresponding file is found, respond with a 404 error page. The lookup
order is dynamic followed by static.
*/
function resolve(request, response) {
    var pathName = url.parse(request.url).pathname;
    var filePath;
    
    var allChunks = [];
    chunkCount = 0;

    // Get all data sent to the server
    request.on('data', function (chunk) {
        allChunks[chunkCount] = chunk;
        chunkCount++;
    });
    // Once the request is finished, respond
    request.on('end', function () {
        // Join all the chuncks
        var dataBuffer = bops.join(allChunks);
    
        // If no file is specified, we want to send a index page
        if (pathName.charAt(pathName.length - 1) === "/") { 
            // TODO: if somebody creates a dynamic index page, please replace this with "index"
            request.url += "index.html";
            pathName += "index.html";
        }
        // Means there was no file extension i.e. dynamic
        if (pathName.split(".").length === 1) {
            filePath = basepath + dynamicRoot + pathName + ".js";

            // NOTE: No time to do a path.exists, in the case of a post request it will take too
            // long to execute and data chunks will begin to arrive before node can process it.
            path.exists(filePath, function (exists) {
                if (exists) {
                    // If the dynamic page exists, try to send it
                    try {
                        var handler = require(filePath);

                        if (request.method === 'POST') {
                            handler.postReq(request, response, dataBuffer);
                        } else if (request.method === 'GET') {
                            handler.getReq(request, response, dataBuffer);
                        }
                        log(request, 200);
                    } catch (err) {
                        // If there was a problem, send a 500 error
                        console.log("500 Error: " + err);
                        error(request, response, 500, filePath);
                    }
                } else {
                    // If not, try static
                    filePath = basepath + staticRoot + pathName;
                    sendStaticObj(request, response, filePath);
                }
            });
        } else {
            // If no dynamic page was found, try static
            filePath = basepath + staticRoot + pathName;
            sendStaticObj(request, response, filePath);
        }
    });
}

/*
sendStaticObj is used to simply send a static file in response to a
GET request for a static object
*/
function sendStaticObj(request, response, file) {
    var extension = file.split(".").pop();
    path.exists(file, function (exists) {
        if (exists) {
            // If it exists, try sending it
            try {
                log(request, 200);
                response.writeHead(200, {'Content-Type': extTypes[extension]});

                if (extension === "html" || extension === "htm") {
                    pagemaker.ParsePage(file, request, function (html) {
                        response.end(html);
                    });

                } else {
                    util.pump(fs.createReadStream(file), response, function () {});
                }
            } catch (err) {
                // If there was a problem, send a 500 error
                console.log("500 Error: " + err);
                error(request, response, 500, file);
            }
        } else {
            // If it doesn't exist, send a 404
            error(request, response, 404, file);
        }
    });
}

function init(args) {
    if (args.length !== 3) {
        console.log("Usage: node dispatcher <port>");
    } else {
        /* if node is run from the js dir, cd back to the project root */
        dirArray = process.cwd().split("/");
        if (dirArray.pop() === "js") {
            process.chdir(dirArray.join("/"));
        }

        /* dies with exception if args[2] is not a number */
        port = Number(args[2]);
        http.createServer(resolve).listen(port);

        console.log("server listening on " + os.hostname() + ":" + port);
        console.log("date/time\t\tremote ip\tstatus\trequest");
    }
}

init(process.argv);
