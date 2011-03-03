var exec = require('child_process').exec,
    fs = require('fs'),
    http = require('http'),
    os = require('os'),
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
             ["/signup.js", "text/javascript"],
             ["/style.css", "text/css"],
             ["/test.jpg", "image/jpg"],
             ["/profile/imgup.js", "text/javascript"],
             ["/profile/imguptest.html", "text/html"]];

   
function error(request, response, code, file) {
    log(request, code, file);
    response.writeHead(code, {"Content-Type": "text/html"});
    util.pump(fs.createReadStream(errorRoot + code + ".html"), response, function(){});
}

function log(request, statusCode, fileMatch) {
    strings = new Array(request.socket.remoteAddress, statusCode, request.url + "  ->  " + fileMatch);
    util.log(strings.join("\t"));
}

/* Upon receiving a request, try to match it with a response object. If
   no corresponding object is found, respond with a 404 error page. In case
   an unresolvable exception is encountered, repond with a 500 error page. */
function resolve(request, response) {
    //If the user is posting data, call the POST resolver
    if(request.method=='POST') {
        resolvePost(request, response);
    //If the user is retreiving data, call the GET resolver
    } else if (request.method=='GET') {
        resolveGet(request,response);
    }
}

function resolveGet(request, response) {

    var pathname = url.parse(request.url).pathname;
    var fileMatch;

    /* some miscellaneous work: redirect / to /main.html, look for images
       right place */
    if (pathname == "/") { 
        pathname = "/main.html"; 
    }
    var extension = pathname.split(".").pop();
    if (extension == "jpg" || extension == "png" || extension == "gif") {
        extension = "img";
    }

    match = 0;
    for (p in pages) {
        if (pages[p][0] == pathname) {
            match++;
            fileMatch = docRoot + extension + pathname;
            sendObj(request, response, fileMatch, pages[p][1]);
            break;
        }
    } 
    if (!match) {
        error(request, response, 404, fileMatch);
    }
}

/* 
resolvePost is used to resolve a post request. All file uploads will be handled as follows:

In the HTML:
<form method=post name=upform action="/dir1/dir2/script.js">

will result in a form post calling postReq in the file: ./static/js/dir1/dir2/script.js

the code in the postReq function in script.js will handle the upload from there.
No posted data is even glanced at by the dispatcher.

Author: Mitchell Ludwig
*/
function resolvePost(request, response) {
    console.log("File posted with: " + process.cwd() + "/" + docRoot + "js" + url.parse(request.url).pathname);
    var handler = require(process.cwd() + "/" + docRoot + "js" + url.parse(request.url).pathname);
    handler.postReq(request,response);
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
