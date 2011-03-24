/*
Author: Mitchell Ludwig
This module is intended as an example of the topic discussed in class, 
 how to change a page without refreshing it. The page consists of a simple layout, 
 with a text box and a div field below it. Typing "win" into the textbox will
 send a request serverside through a GET request with the text encoded in the URL.
 On the serverside, the url is parsed and the textbox text is retreived, and 
 compared to the string literal "win". If they type win, it links to the
 Wikipedia article for Win, and displays a totally win picture. If not, the
 serverside code sends the response to indicate a failure to enter "win".
*/
var pagemaker = require('pagemaker'); //Helper module for dynamic page generation
var url = require('url'); //Helper module for url parsing
var upops = require('uploadOps'); //Helper module for common upload operations

//Processes dynamic GET requests
exports.getReq = function (request,response) {
    //Parses the url from "/veryDynamic/example.js?attack=win"
    // into an array containing one element, "attack" with a value of "win"
    send(response,url.parse(request.url,true).query);
}

//Sends the response back to the client
send = function (response, parameters) {
    //Write a 200 header to indicate normal error-free operation
	response.writeHead(200, {'Content-Type': 'text/html'});
    //Compare the text to "win" and respond appropriately
    if (parameters['attack']=="win") {
        response.write('<a href="http://en.wikipedia.org/wiki/Win">VICTORY!</a><br /><img src="riverTam.png" />');
    } else {
        response.write("DEFEAT! You must win to acheive victory, and you tried to " + parameters['attack']);
    }
    //Send the response and mark it as complete
	response.end();
}