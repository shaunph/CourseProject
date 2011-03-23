var db = require('../js/SQLiteHelper');
var qs = require('querystring');
var pagemaker = require('../js/pagemaker');

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
				page1.setContent("Signup successfull! <br />");
			}
			else if(codes.status == -1) {
				page1.setTitle("Error");
				page1.setContent("User already exists in DB");
			}
			else if(codes.status == -2) {
				page1.setTitle("Error");
				page1.setContent("Internal error while signing up");
			}
			
			res.write(page1.toHTML());
			res.end();
		});	
	});
}
