var jaml = require('jaml');
var db = require('SQLiteHelper');

/*
 * Jaml template to convert a row returned from SQLite into a proper
 * feed entry
 */
Jaml.register('feedentry', function(row){
	div({class:'feedEntry'},
		div({class:'feedUser'}, row.UserName),
		div({class:'feedTopic'}, row.Topic),
		div({class:'feedCreated'}, row.Created)
	);
});


/*
 * The General Feeds Page
 * This will display recent activity, not associated with a particular 
 * user, for those not signed in.
 *
 *
 */
exports.getReq = function (request,response) {
	response.writeHead(200, {'Content-Type': 'text/html'});
	
	db.getRecentActivity(function (error){
		if (error.status != 0){
			repsonse.end(error.detail.message);
			throw error;
		} else {
			response.end(Jaml.render('feedentry',(error.rows)));
		}
	});
}

