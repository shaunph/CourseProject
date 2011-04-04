var basepath = require('basepath').mainpath,
    errorPage = require(basepath + '/dynamic/error_pages/errorPage'),
    exec = require('child_process').exec,
    db = require('SQLiteHelper'),
    fs = require('fs'),
    http = require('http'),
    os = require('os'),
    pagemaker = require('pagemaker'),
    path = require('path'),
    qs = require('querystring'),
    url = require('url'),
    util = require('util'),
    bops = require('bufferOps');

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
            try {
                var handler = require(filePath);

                if (request.method === 'POST') {
                    handler.postReq(request, response, dataBuffer);
                } else if (request.method === 'GET') {
                    handler.getReq(request, response, dataBuffer);
                }
                log(request, 200, filePath);
            } catch (err) {
                // If there was an error, it means no such dynamic page exists,
                // or there is an error on the dynamic page.
                // Thus we chop off the ".js" we added and try for a static page.
                filePath = basepath + staticRoot + pathName;
                sendStaticObj(request, response, filePath);
            }
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
            log(request, 200, file);
            response.writeHead(200, {'Content-Type': extTypes[extension]});

            if (extension === "html" || extension === "htm") {
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
        console.log("date/time\t  remote ip\tstatus\trequest  ->  resolution");
    }
}

init(process.argv);
