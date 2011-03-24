var db = require('../js/SQLiteHelper'),
    qs = require('querystring'),
    url = require('url');


exports.getReq = function (req, res ) {
    
    res.writeHead(200, {'content-type':'text/html'});    
    
    var params = url.parse(req.url, true).query;

    if(params.Email != undefined) {
        db.userExists(params.Email, function(codes) {
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
    else if(params.Username != undefined) {
        db.nickExists(params.Username, function(codes) {
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
