var exec = require('child_process').exec,
    fs = require('fs'),
    http = require('http'),
    os = require('os');
    pagemaker = require('./pagemaker'),
    path = require('path'),
    url = require('url'),
    util = require('util'),
	db = require('./SQLiteHelper'),
	qs = require('querystring');
	
var docRoot = "static",
	dynamicRoot = "dynamic/",
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

	// if the path splits at a ".", we assume it has a file extension
	// and in turn assume it is static content.
	if (pathname.split(".").length != 1)
	{
		var type = getMIMEType(pathname);
		
		pathname = docRoot + pathname;
		sendStaticObj(request, response, pathname, type);
	}
	else
	{
		var split = pathname.split("/"),
			route = split[1],
			params = split.slice(2);
			scriptName = dynamicRoot + route + ".js";
		
		sendDynamicObj(request, response, scriptName, params);
	}
}

function sendStaticObj(request, response, file, type) {
    path.exists(file, function(exists) {
        if (exists) {
            log(request, 200, file);
			
            response.writeHead(200, {'Content-Type': type});
            util.pump(fs.createReadStream(file), response, function() {});
        } else {
			error(request, response, 404, file);
        }
    });
}

function sendDynamicObj(request, response, scriptName, parameters) {
    path.exists(scriptName, function(exists) {
        if (exists) {
            log(request, 200, scriptName);
			
            var script = require("../" + scriptName);	//Path must relative to dispatcher.js
			script.send(response, parameters);
        } else {
			error(request, response, 404, scriptName);
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
		case 'jpeg':
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
