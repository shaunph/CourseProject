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
			if(codes.status == 0) {
					
				page1 = new pagemaker.StandardPage();
				page1.setTitle("Success");
				page1.setContent("Signup successfull! <br />");
				page1.standardMenus();
				res.write(page1.toHTML());
				res.end();
			}
			if(codes.status == -2) {
				res.write(codes.detail);
				res.end();
			}

		});	
	});
}
