var pagemaker = require('pagemaker');
var url = require('url');
var upops = require('uploadOps');

exports.getReq = function (request,response) {
    send(response,url.parse(request.url,true).query);
}

send = function (response, parameters) {
	response.writeHead(200, {'Content-Type': 'text/html'});
    if (parameters['attack']=="win") {
        response.write('<a href="http://en.wikipedia.org/wiki/Win">VICTORY!</a><br /><img src="riverTam.png" />');
    } else {
        response.write("DEFEAT! You must win to acheive victory, and you tried to " + parameters['attack']);
    }
	response.end();
}