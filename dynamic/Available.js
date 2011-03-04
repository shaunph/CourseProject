var db = require('../js/SQLiteHelper');


exports.send = function (res, params) {
	
	res.writeHead(200, {'content-type':'text/html'});	

	for(var i in params) {
		if(i == "Username") {
			db.nickExists(params[i], function(codes) {
				if(codes.status == 0) {
					if(codes.exists == false) {
							

}
