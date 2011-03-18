var pagemaker = require('./../js/pagemaker');
var url = require('url');

exports.getReq = function (request,response) {
    send(response,url.parse(request.url,true).query);
}

send = function (response, parameters) {
	response.writeHead(200, {'Content-Type': 'text/html'});
	
	page1 = new StandardPage();
	page1.setTitle("Test Page");
	page1.setContent("This is a dynamically generated test page <br />");
	
	page1.addContent("Here are the parameters passed to this page: <br />");
	for(var i in parameters)
	{
		page1.addContent(i + ": " + parameters[i] + "<br />");
	}
	page1.addContent("<br />");
	
	page1.addContent("Here are some random numbers: <br />");
	for(var i = 0; i<10; i++)
	{
		page1.addContent(Math.random() + "<br />");
	}
	
	page1.addMenuItem("home", "/");

	response.write(page1.toHTML());
	
	response.end();
	
}