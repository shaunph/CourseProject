var jaml = require('jaml');
var db = require('SQLiteHelper');
var pagemake = require('pagemaker');



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
            response.end(error.detail.message);
            throw error;
        } else {
            response.end(Jaml.render('feedentry',(error.rows)));
        }
    });
}

