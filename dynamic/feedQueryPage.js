var pagemaker = require('pagemaker');
var jaml = require('jaml');
var db = require('SQLiteHelper');


Jaml.register('feedentry', function(row){
	div({class:'feedEntry'},
		div({class:'feedUser'}, row.UserName),
		div({class:'feedTopic'}, row.Topic),
		div({class:'feedCreated'}, row.Created)
	);
});

exports.getReq = function (request,response) {
	response.writeHead(200, {'Content-Type': 'text/html'});
	
	page1 = new StandardPage();
	page1.setTitle("Feed Query Output");
	page1.standardMenus();

	db.getRecentActivity(function (error){
		if (error.status != 0){
			page1.addContent(error.detail.message);
		} else {
			page1.addContent(Jaml.render('feedentry',(error.rows)));
		}
		response.end(page1.toHTML());
	});
}

