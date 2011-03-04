var db = require('../js/SQLiteHelper'),
	qs = require('querystring');


exports.send = function (res, params) {
	
	res.writeHead(200, {'content-type':'text/html'});	
	console.log(params);

	if(typeof params.Email != undefined) {
		console.log("In email check");
		db.nickExists(params.Email, function(codes) {
			if(codes.status == 0) {
				if(codes.exists == false) {
					res.end("Available");
				}
				else if(codes.exists == true ){
					res.end("Unavailable");
				}
				else {
					res.end("Unknown code");
				}
			}
			else {
				res.end("An internal error occured.");
			}
		});
	}	
	else if(typeof params.Username != undefined) {
		db.userExists(params.Username, function(codes) {
			if(codes.status == 0) {
				if(codes.exists == false) {
					res.end("Available");
				}
				else if (codes.exists == true) {
					res.end("Unavailable");
				}
				else {
					res.end("Unknown code");
				}
			}
			else {
				res.end("An internal error occured.");
			}
		});
	}		
	else {
		res.end("Parameter Not Recognized");
	}
}
