var http = require('http'),
    url = require('url'),
    util = require('util'),
    path = require('path'),
    fs = require('fs'),
	pagemaker = require('./pagemaker'),
    exec = require('child_process').exec;

var port = 5678;
var page_root = "html",
    img_root = "html/img",
    error_root = "html/error_pages",
	js_root = "html/js"
	css_root = "html";

function error_404(response, filename)
{
	util.log("\tERROR: 404: " + filename);
	response.writeHead(404, {"Content-Type": "text/html"});
	util.pump(fs.createReadStream(error_root + "/404.html"), response, function(){});
}

function error_500(response)
{
	util.log("\tERROR: 500");
	response.writeHead(500, {"Content-Type": "text/html"});
	util.pump(fs.createReadStream(error_root + "/500.html"), response, function(){});
}

/* Upon receiving a request, try to match it with a response object. If
   no corresponding object is found, respond with a 404 error page. In case
   an unresolvable exception is encountered, repond with a 500 error page. */
function resolve(req, res) {
    pathname = url.parse(req.url).pathname;
    util.log("request: " + pathname);

    /* presumably the requested path will be searched for in a database, for now
       let's use a simple switch statement */
    switch(pathname) {
	case "/":
	    send_obj(res, "/main.html", "text/html");
	    break;
	case "/test.jpg":
	    send_obj(res, "/test.jpg", "image/jpeg");
	    break;
	case "/style.css":
	    send_obj(res, pathname, "text/css");
	    break;
	
	/* START: Files needed for the signup page */
	case "/signup.html":	//The signup page.
		send_obj(res, pathname, "text/html");			
		break;
	case "/signup.js":	//The signup page.
		send_obj(res, pathname, "text/javascript");
		break;
	case "/jquery-1.5.min.js":	//The signup page.
		send_obj(res, pathname, "text/javascript");
		break;
	/* END */

	/* reported to exist, but doesn't actually exist */
        case "/server_error":
	    send_obj(res, "does_not_exist", "text/html");
	    break;
	    
	/* Nothing was found, 404 */
        default:
	    error_404(res, pathname);
	    break;
    }
}

function send_obj(response, filename, type) {
    var fullpath;
    if (type == "text/html") {
	   fullpath = page_root + filename;
    } else if (type == "image/jpeg") {
	   fullpath = img_root + filename;
    } else if (type == "text/javascript") {
	   fullpath = js_root + filename;
    } else if (type == "text/css") {
	   fullpath = css_root + filename;
    } else {
           error_500(response);
           util.log("\t-> file type not recognized: " + type);
    }
    path.exists(fullpath, function(exists) {
		if (exists) {
		util.log("\tSending file: " + fullpath);
			response.writeHead(200, {'Content-Type': type});
		   
			/* use page generation for pages
			
			
			var page = new StandardPage();
			page.setTitle("Testing");
		   
			//create header

			//create file input stream
			var istream = fs.createReadStream(fullpath);
			var content;
			istream.on('data', function(data) {
				content += data;	//write data
			});
			istream.on('end', function() {
			
				page.setContent(content);
				response.write(page.toHTML());
				response.end();
			});
			//if there was an error handle it.
			istream.on('error', function(error) {
			});
		   	 */	   
			 
			 
            util.pump(fs.createReadStream(fullpath), response, function() {});
       } else {
	   error_500(response);
           util.log("\t-> file reported to exist, but can't be found: " + fullpath);
       }
    });
}

function init(args) {
	if (args.length != 3) {
		console.log("Usage: node dispatcher <port>");
	} else {
		/* dies with exception if args[2] is not a number */
		port = Number(args[2]);
		http.createServer(resolve).listen(port);

		/* TODO: put this back when node is upgraded using os.getHostName() */
		/* Intelligently report the hostname and port. Assumes we are using a UNIX environment. */
		//exec("uname -n", function(error, stdout, stderr) {
		//	util.log("Server running at " + stdout.slice(0, stdout.length-1) + ":" + port);
		//});
	}
}

init(process.argv);
