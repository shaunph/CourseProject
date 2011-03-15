var db = require('../js/SQLiteHelper'),
	jaml = require('../js/jaml'),
	tables = require('renderTable'),
	pagemaker = require('../js/pagemaker'),
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
	var lookup = url.parse(req.url , parseQueryString=true).query.table;
	var page = new StandardPage();
	page.standardMenus();
	page.setTitle("View Tables");
	res.writeHead(200, {'content-type':'text/html'});
	db.getTables(function (err,row){
		if (err.status != 0){
			res.end(err);
		} else {
			page.addContent(tables.tableToHTML(err.rows));
			page.addContent(tableToSelectForm(err.rows));
			db.getTable(lookup ,function (err2,row2){
				if (err2.status != 0) {
					console.log(err2);
				}else{
					page.addContent( tables.tableToHTML(err2.rows));
				}
				res.write(page.toHTML());
				res.end();
			});
		}
	});
}
