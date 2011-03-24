var db = require('SQLiteHelper');
var qs = require('querystring');
var pagemaker = require('pagemaker');

exports.postReq = function(req, res) {

	var body = '';
	var fields = {};

	req.on('data', function(data) {
		body += data;
	});

	req.on('end', function () {
		fields = qs.parse(body);
		
		db.addUser(fields.Email, fields.Username, fields.Password, function(codes) {
			res.writeHead(200, {'content-type':'text/html'});
			page1 = new StandardPage();
			page1.standardMenus();
			if(codes.status == 0) {
				page1.setTitle("Success");
				page1.setContent("<h1>Signup successfull!</h1> <br />");
			}
			else if(codes.status == -1) {
				page1.setTitle("Error");
				page1.setContent("<h1>User already exists in DB</h1>");
			}
			else if(codes.status == -2) {
				page1.setTitle("Error");
				page1.setContent("<h1>Internal error while signing up</h1>");
			}
			
			res.write(page1.toHTML());
			res.end();
		});	
	});
}
