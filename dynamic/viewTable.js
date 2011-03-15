var db = require('../js/SQLiteHelper'),
	jaml = require('../js/jaml'),
	tables = require('renderTable'),
	pagemaker = require('../js/pagemaker'),
	url = require('url');


/*
 * Jaml templates for rendering the table select menu 
 *
 */

Jaml.register('option', function(opt){
	option({onClick:"document.location='viewTable?table=" + opt + "'"},opt);
})

Jaml.register('tableselectform', function(input){
	form({id:"form1"},
		select(Jaml.render('option', input.data))
		);
});

/*
 * tableToSelectForm(row)
 * 	extracts the list of tables in the database and uses it to 
 *	create the table select form using the Jaml templates
 */

var tableToSelectForm = function(row){
	var data1 = tables.getData(row);
	var outdata = [];

	for (i in data1){
		outdata[i] = data1[i][0];
	}

	return Jaml.render('tableselectform', {data:outdata});
}

/*
 * The main repsonse function.
 *
 * Queries database for list of tables and possibly also the 
 * contents of the supplied table, if a name is supplied.
 *
 * Content is rendered with pagemaker.
 */

exports.getReq = function (req, res) {
	var lookup = url.parse(req.url , parseQueryString=true).query.table;
	var page = new StandardPage();

	// inital setup of page
	page.standardMenus();
	page.setTitle("View Tables");

	res.writeHead(200, {'content-type':'text/html'});

	db.getTables(function (err,row){
		if (err.status != 0){
			res.end(err);
		} else {
			// adds the list of tables and the form
			page.addContent(tables.tableToHTML(err.rows));
			page.addContent(tableToSelectForm(err.rows));

			db.getTable(lookup ,function (err2,row2){
				if (err2.status != 0) {
					console.log(err2);
				}else{
					//if query succeeds, adds table to page
					page.addContent( tables.tableToHTML(err2.rows));
				}
				// sends page to client
				res.write(page.toHTML());
				res.end();
			});
		}
	});
}
