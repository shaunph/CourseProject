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

var docRoot = "static/",
    errorRoot = "static/error_pages/";

/* register your new pages here, until the database is working */
var pages = [["/main.html", "text/html"],
             ["/jquery-1.5.min.js", "text/javascript"],
             ["/server_error.html", "text/html"],
             ["/signup.html", "text/html"],
             ["/Available", checkAvailable],	
             ["/signupRequest", signupRequest],	
			 /*
				So this is what i was thinking.  You put the function you want/need to call as the second parameter
				then in the resolve function it checks to see if the second element is a string or a function
				if its a string it calls sendObj if its a function it calls the function.  If the function needs parameters
				whether passed in the url or in the document, the function must take the request as the parameter 
				then manipulate the request to get the requested data... doing this will minimize the amount of if then else
				or switch statements in the resolve method.  Also your function needs a call back function due to asynchonisity.
				and to tell the resolver what to send to the users.
			 */
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

function checkAvailable(request, callback) {

	var params = url.parse(request.url,true).query;		
	
	for(key in params){
		var res = db.checkAvailable(key, params[key], function (res) {
			if(res == 1) {
				callback("Available!!");
			}
			else {
				callback("Unavailable");
			}
		});
	}	
}


//copied from http://www.toxiccoma.com/random/nodejs-0195-http-post-handling-of-form-data
function postHandler(request, callback) {

    var _REQUEST = { };
    var _CONTENT = '';

	/*
	
		For some reason the below segment of code doesnt work... It just doesnt do anything.
	
	*/
	if (request.method == 'POST') {		//this conditional works fine, and detects that its a POST.
	
		request.on('data', function(chunk) {	//but here it doesn't receive any data.
			util.log("next chunk: "+chunk);
			_CONTENT+= chunk;
		});

		request.on('end', function() {
			util.log("end of post request found.");
			_REQUEST = qs.parse(_CONTENT);
			
			callback(_REQUEST);
		});
    }
};


function signupRequest(request, callback) {

	postHandler(request, function(data) {
		for(key in data) {
			util.log(key+" "+data[key]);
		}
		callback("Success");	//this is the screen that the user will see upon success full signup
	});
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
				pages[p][1](request, function(res) {//here is where we call the function with the request and callback as the parameters.
					response.writeHead(200, {'Content-Type': "text/html"});
					response.write(res);	
					response.end();
				});
				log(request, 200, pages[p][1].toString().split("{")[0]);	//log the function that was called				
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
