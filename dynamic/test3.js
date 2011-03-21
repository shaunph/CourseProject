var task = require('task');
var pagemaker = require('pagemaker');
var url = require('url');

exports.getReq = function (request,response) {
    displayUpdate(response,url.parse(request.url,true).query);
}

function displayUpdate(response, params) {
	response.writeHead(200, {'Content-Type': 'text/html'});
	
	page1 = new StandardPage();
	page1.setTitle("Update Task");
	
	page1.setContent("Id: ");
	page1.addContent(params["id"] + "<br />");
	
	page1.addContent("User: <br />");
	
	page1.addContent("Date: <br />");
	
	page1.addContent(
	"<form method=post name=upform action='/profile/uploadPic.js' enctype='multipart/form-data'>"+
			
			"Status:<br />"+
			"<input type='text' id='inputStatus' value=''><br /><br />"+
			
			"Description:<br />"+
			"<textarea id='inputDescription' rows='10' cols='85'></textarea> <br /><br />"+
			
			"Priority:"+
			"<input type='radio' name='level' value='low'>Low "+
			"<input type='radio' name='level' value='medium'>Medium "+
			"<input type='radio' name='level' value='high'>High <br /><br />"+
			
			"Attachment:"+
            "<input type='hidden' name='MAX_FILE_SIZE' value='500' />"+
            "<input type=file name=uploadfile>"+
            "<br /><br />"+
			
			"<input type='button' name='Submit' value='Submit Changes' onclick='update()'>"+/*;LimitAttach(this.form, this.form.uploadfile.value)*/
			"<input type='button' name='' value='Change Estimate Values' onclick='parent.location=\'#\''>"+
			"<input type='button' value='Reset' onclick='setInput()'>"+
			"<input type='button' value='Go Back' onclick='history.go(-1);return true;'>"+

		"</form>");
	
	page1.addMenuItem("Home", "/");
	page1.addMenuItem("Display Task", "/taskpage?id=" + params["id"]);
	page1.addMenuItem("Task List", "/");

	response.write(page1.toHTML());
	
	response.end();
	
}
