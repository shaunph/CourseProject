var db = require('../js/SQLiteHelper'),
	jaml = require('../js/jaml'),
	url = require('url');

Jaml.register('tableheader', function(header){
	th(header.toString());
});

Jaml.register('tablerow', function(row){
	tr(Jaml.render('tablecell', row));
});

Jaml.register('tablecell', function(cell){
	td(cell.toString());
});

Jaml.register('table', function(input)	{
	table(
		tr(Jaml.render('tableheader', input.head)),
		Jaml.render('tablerow', input.rows)
	);
});

Jaml.register('option', function(opt){
	option({onClick:"document.location='viewTable?table=" + opt + "'"},opt);
})

Jaml.register('selectform', function(input){
	form({id:"form1"},
		select(Jaml.render('option', input.data))
		);
});


var getHeader = function(row) {
	var header = [];

	for (var key in row[0]){
		header[header.length] = key;
	}
	
	return header;
}

var getData = function(row){
	var data = [[]];
	var i,j;
	
	for (i = 0; i < row.length; i++){
		data[i] = [];
		for (j in row[i]){
			data[i][data[i].length] = row[i][j];
		}
	}

	return data;
}

var tableToHTML = function(row){
	if ((row == undefined) || (row.length <= 0)) { return ""; }
	console.log(getHeader(row));
	console.log(getData(row));
	return Jaml.render('table', {head:getHeader(row), rows: getData(row)});
}

var tableToSelectForm = function(row){
	var data1 = getData(row);
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
			res.write(tableToHTML(row));
			res.write(tableToSelectForm(row));
			db.getTable(lookup ,function (err2,row2){
				if (err) {
					console.log(err);
				}else{
	console.log(row2);
					res.write(tableToHTML(row2));
				}
				res.end(tailstring);
			});
		}
	});
}
