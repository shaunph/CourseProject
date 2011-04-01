var basepath = require('basepath').mainpath,
    errorPage = require(basepath + 'dynamic/error_pages/errorPage'),
    exec = require('child_process').exec,
    db = require('SQLiteHelper'),
    fs = require('fs'),
    http = require('http'),
    os = require('os'),
    pagemaker = require('pagemaker'),
    path = require('path'),
    qs = require('querystring'),
    url = require('url'),
    util = require('util');

var extTypes = [];
extTypes["html"]="text/html";
extTypes["htm"]="text/html";
extTypes["js"]="aplication/javascript";
extTypes["css"]="text/css";
extTypes["jpg"]="image/jpg";
extTypes["jpeg"]="image/jpg";
extTypes["png"]="image/png";
extTypes["gif"]="image/gif";

var staticRoot = "static",
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
    if (pathName == "/") { 
        // Simply call resolve again with the pathname switch to index.html.
        // TODO: if somebody creates a dynamic index page, please replace this with "index"
        request.url = "/index.html";
        resolve(request, response);
    } else {

        // Means there was no file extension i.e. dynamic
        if (pathName.split(".").length == 1) {

            filePath = basepath + dynamicRoot + pathName + ".js";

            // NOTE: No time to do a path.exists, in the case of a post request it will take too
            // long to execute and data chunks will begin to arrive before node can process it.
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
                // If there was an error, it means no such dynamic page exists,
                // or there is an error on the dynamic page.
                // Thus we chop off the ".js" we added and try for a static page.
                filePath = basepath + staticRoot + pathName;
                SendStaticObj(request, response, filePath);
            }
        } else {
            // If no dynamic page was found, try static
	    filePath = basepath + staticRoot + pathName;
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
