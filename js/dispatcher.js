var exec = require('child_process').exec,
    fs = require('fs'),
    http = require('http'),
    os = require('os');
    pagemaker = require('./pagemaker'),
    path = require('path'),
    url = require('url'),
    util = require('util');

var cssRoot = "html",
    errorRoot = "html/error_pages",
    imgRoot = "html/img",
    jsRoot = "html/js",
    pageRoot = "html";
    
function error404(response, filename) {
    response.writeHead(404, {"Content-Type": "text/html"});
    util.pump(fs.createReadStream(errorRoot + "/404.html"), response, function(){});
}

function error500(response)
{
    response.writeHead(500, {"Content-Type": "text/html"});
    util.pump(fs.createReadStream(errorRoot + "/500.html"), response, function(){});
}

function log(request, statusCode, fileMatch) {
    strings = new Array(request.socket.remoteAddress, statusCode, request.url + "  ->  " + fileMatch);
    util.log(strings.join("\t"));
}

/* Upon receiving a request, try to match it with a response object. If
   no corresponding object is found, respond with a 404 error page. In case
   an unresolvable exception is encountered, repond with a 500 error page. */
function resolve(request, response) {
    var fileMatch;
    pathname = url.parse(request.url).pathname;

    /* presumably the requested path will be searched for in a database, for now
    let's use a simple switch statement */
    switch(pathname) {
        case "/":
            fileMatch = pageRoot + "/main.html";
            statusCode = sendObj(request, response, fileMatch, "text/html");
            break;
        case "/test.jpg":
            fileMatch = imgRoot + "/test.jpg";
            statusCode = sendObj(request, response, fileMatch, "image/jpeg");
            break;
        case "/style.css":
            fileMatch = cssRoot + "/style.css";
            statusCode = sendObj(request, response, pathname, "text/css");
            break;

        /* START: Files needed for the signup page */
        case "/signup.html":	//The signup page.
            fileMatch = pageRoot + "/signup.html";
            statusCode = sendObj(request, response, fileMatch, "text/html");
            break;
        case "/signup.js":	//The signup page.
            fileMatch = jsRoot + "/signup.js";
            statusCode = sendObj(request, response, fileMatch, "text/javascript");
            break;
        case "/jquery-1.5.min.js":	//The signup page.
            fileMatch = jsRoot + "/jquery-1.5.min.js";
            statusCode = sendObj(request, response, fileMatch, "text/javascript");
            break;
        /* END */

        /* reported to exist, but doesn't actually exist */
        case "/server_error":
            fileMatch = pageRoot + "/server_error.html";
            statusCode = sendObj(request, response, fileMatch, "text/html");
            break;

        /* Nothing was found, 404 */
        default:
            statusCode = 404;
            error404(response, pathname);
            break;
    }
}

				   
			 
function sendObj(request, response, file, type) {
    var statusCode = 200;
    path.exists(file, function(exists) {
        if (exists) {
            log(request, 200, file);
            response.writeHead(200, {'Content-Type': type});

            /* use page generation for pages

            var page = new StandardPage();
            //need a way to get the title from the page
            page.setTitle("Testing");

            //need a way to remove the <head> from the page
            //and instead put it into: 
            //page.addHead(data);

            //create header

            //create file input stream
            var istream = fs.createReadStream(fullpath);
            istream.on('data', function(data) {
                page.addContent(data);
            });
            istream.on('end', function() {
                response.end(page.toHTML());
            });
            //if there was an error handle it.
            istream.on('error', function(error) {});
            */

            util.pump(fs.createReadStream(file), response, function() {});
        } else {
            log(request, 500, file);
            error500(response);
            console.log("ERROR: file reported to exist, but can't be found: " + file);
        }
    });
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
