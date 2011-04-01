var db = require('SQLiteHelper');
var qs = require('querystring');
var upops = require('uploadOps');
var bops = require('bufferOps.js');
var pagemaker = require('pagemaker');

exports.postReq = function(req, res, dataBuffer) {

    /*var body = '';
    var fields = {};

    req.on('data', function(data) {
        body += data;
    });

    req.on('end', function () {
        fields = qs.parse(body);*/
        console.log("SIGN: " + dataBuffer);
        var parsed = upops.parseMultipartFormdata(dataBuffer);
        console.log("SIGN: " + parsed);
        
        db.addUser(parsed["Email"].toString(), parsed["Username"].toString(), parsed["Password"].toString(), function(codes) {
            res.writeHead(200, {'content-type':'text/html'});
            page1 = new StandardPage();
            page1.standardMenus();
            if(codes.status == 0) {
                page1.setTitle("Success");
                page1.setContent("<h1>Signup successfull!</h1> <br />");
            }
            else if(codes.status == -1) {
                page1.setTitle("Error");
                page1.setContent("<h1>User already exists in DB</h1>");
            }
            else if(codes.status == -2) {
                page1.setTitle("Error");
                page1.setContent("<h1>Internal error while signing up</h1>");
            }
            
            res.write(page1.toHTML());
            res.end();
        });    
    //});
}
