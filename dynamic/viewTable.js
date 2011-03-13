var db = require('../js/SQLiteHelper'),
	jaml = require('../js/jaml'),
	tables = require('renderTable'),
	url = require('url');


Jaml.register('option', function(opt){
	option({onClick:"document.location='viewTable?table=" + opt + "'"},opt);
})

Jaml.register('selectform', function(input){
	form({id:"form1"},
		select(Jaml.render('option', input.data))
		);
});



var tableToSelectForm = function(row){
	var data1 = tables.getData(row);
	var outdata = [];

	for (i in data1){
		outdata[i] = data1[i][0];
	}

	return Jaml.render('selectform', {data:outdata});
}

exports.getReq = function (req, res) {
	var headstring = "<!doctype html>\n<html>\n<head><title>ViewTables</title></head>\n<body>\n";
	var tableform = "<form id=form1> <input type=select>"
	var tailstring = "\n</body></html>"; 
	var lookup = url.parse(req.url , parseQueryString=true).query.table;
	res.writeHead(200, {'content-type':'text/html'});
	db.getTables(function (err,row){
		if (err){
			res.end(err.toString());
		} else {
			res.write(headstring);
			res.write(tables.tableToHTML(row));
			res.write(tableToSelectForm(row));
			db.getTable(lookup ,function (err2,row2){
				if (err) {
					console.log(err);
				}else{
					res.write(tables.tableToHTML(row2));
				}
				res.end(tailstring);
			});
		}
	});
}
