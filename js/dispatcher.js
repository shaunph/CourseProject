var exec = require('child_process').exec,
    fs = require('fs'),
    http = require('http'),
    os = require('os');
    pagemaker = require('./pagemaker'),
    path = require('path'),
    url = require('url'),
    util = require('util');

var docRoot = "static/",
    errorRoot = "static/error_pages/";

/* register your new pages here, until the database is working */
var pages = [["/main.html", "text/html"],
             ["/jquery-1.5.min.js", "text/javascript"],
             ["/server_error.html", "text/html"],
             ["/signup.html", "text/html"],
             ["/Available", checkAvailable],	
             ["/signup-request.html", "text/javascript"],
             ["/signup.js", "text/javascript"],
             ["/style.css", "text/css"],
             ["/test.jpg", "image/jpg"]];

   
function error(request, response, code, file) {
    log(request, code, file);
    response.writeHead(code, {"Content-Type": "text/html"});
    util.pump(fs.createReadStream(errorRoot + code + ".html"), response, function(){});
}

function log(request, statusCode, fileMatch) {
    strings = new Array(request.socket.remoteAddress, statusCode, request.url + "  ->  " + fileMatch);
    util.log(strings.join("\t"));
}

function checkAvailable(field, entry) {
	return "Available";
}

/* Upon receiving a request, try to match it with a response object. If
   no corresponding object is found, respond with a 404 error page. In case
   an unresolvable exception is encountered, repond with a 500 error page. */
function resolve(request, response) {
    var pathname = url.parse(request.url).pathname;
    var fileMatch;

    /* some miscellaneous work: redirect / to /main.html, look for images
       right place */
    if (pathname == "/") { pathname = "/main.html"; }
    var extension = pathname.split(".").pop();
    if (extension == "jpg" || extension == "png" || extension == "gif") {
        extension = "img";
    }

    match = 0;
    for (p in pages) {
        if (pages[p][0] == pathname) {
            match++;
            fileMatch = docRoot + extension + pathname;
			
			if(typeof pages[p][1] == "string") {
				sendObj(request, response, fileMatch, pages[p][1]);
				break;
			}
			else if(typeof pages[p][1] == "function") {
				if(pages[p][0] == "Available") {
					var params = url.parse(request.url, true).query;
					
					log(request, 200, "checkAvail(...) function");
					response.writeHead(200, {'Content-Type': "text/html"});
					response.write( checkAvailable(params.fiels, params.entry));
					response.end();
				}
			}
        }
    } 
    if (!match) {
        error(request, response, 404, fileMatch);
    }
}

function sendObj(request, response, file, type) {
    var statusCode = 200;
    path.exists(file, function(exists) {
        if (exists) {
            log(request, 200, file);
            response.writeHead(200, {'Content-Type': type});

            /* TODO: use page generation for pages

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
            error(request, response, 500, file);
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
