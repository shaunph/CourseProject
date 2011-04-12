var querystring = require('querystring');
var pagemaker = require('pagemaker');


exports.postReq = function(request, response){

	//rawData will take the 'data' event data
    var rawData = '';
    request.on('data', function(data){
        rawData += data;
    });

	//queryFields will take the parsed query data from rawData once
    //    the 'end' event signals that the data is completely sent.
    var queryFields = {};
	request.on('end', function(){
        queryFields = querystring.parse(rawData);

		//Trace: userExists -> queryGetBoolean -> accessDB && safeCallback
        db.userExists(queryFields.identityIn, function(code){

        	if (code.exists == true){

				//TEMP, replace with redirect to home
	            response.writeHead(200, {'content-type':'text/html' , 'Location': 'src/static/signin.html'});
	            page1 = new StandardPage();
	            page1.standardMenus();
            	page1.setTitle("Sign-in");
            	page1.setContent("<h1>Sign-in complete! (Redirect to home).</h1> <br />");
				//Set-Cookie here

			}else if (code.exists == false){
            	
				//TEMP, send back to signin.html with error display.
				response.writeHead(200, {'content-type':'text/html'});
            	page1 = new StandardPage();
            	page1.standardMenus();
            	page1.setTitle("Sign-in");
            	page1.setContent("<h1>Sign-in failed. (Redirect to sign-in page).</h1> <br />" +
					"<a href='signin.html'>GO back to signin</a>");

			}else{

				//TEMP, replace with redirect to 404

				response.writeHead(200, {'content-type':'text/html'});
            	page1 = new StandardPage();
            	page1.standardMenus();
				page1.setTitle("Internal Error");
            	page1.setContent("<h1>Replace this with 404.</h1> <br />");
			}

            //response.write(page1.toHTML());
			//response.write("/signin.html");
            response.end();


        });
    });
}



















