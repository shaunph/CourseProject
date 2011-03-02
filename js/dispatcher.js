var exec = require('child_process').exec,
    fs = require('fs'),
    http = require('http'),
    os = require('os');
    pagemaker = require('./pagemaker'),
    path = require('path'),
    url = require('url'),
    util = require('util');

var docRoot = "static",
    errorRoot = "static/error_pages/";

function error(request, response, code, file) {
    log(request, code, file);
    response.writeHead(code, {"Content-Type": "text/html"});
    util.pump(fs.createReadStream(errorRoot + code + ".html"), response, function(){});
}

function log(request, statusCode, fileMatch) {
    strings = new Array(request.socket.remoteAddress, statusCode, request.url + "  ->  " + fileMatch);
    util.log(strings.join("\t"));
}

/* Upon receiving a request, try to match it with a file. If
   no corresponding file is found, respond with a 404 error page. In case
   an unresolvable exception is encountered, repond with a 500 error page. */
function resolve(request, response) {
    var pathname = url.parse(request.url).pathname;

    /* some miscellaneous work: redirect / to /index.html */
    if (pathname == "/") { pathname = "/index.html"; }

	var type = getMIMEType(pathname);
	
	pathname = docRoot + pathname;
	sendObj(request, response, pathname, type);
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
			error(request, response, 404, file);
        }
    });
}

/* A simple function to try to map a file extension to a MIME type */
function getMIMEType(pathname) {
	var extension = pathname.split(".").pop();
	var type;

	switch(extension)
	{
		case 'html':
			type = 'text/html';
			break;
		case 'css':
			type = 'text/css';
			break;
		case 'js':
			type = 'application/javascript';
			break;
		case 'jpg':
			type = 'image/jpeg';
			break;
		case 'gif':
			type = 'image/gif';
			break;
		case 'png':
			type = 'image/png';
			break;
		default:	//if no MIME type is found, just send the data as text
			type = 'text/plain';
			console.log("WARNING: File type unknown: " + extension);
			break;
	}
	
	return type;
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
