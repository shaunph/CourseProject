var db = require('SQLiteHelper');
var qs = require('querystring');
var upops = require('uploadOps');
var pagemaker = require('pagemaker');

exports.postReq = function(req, res, dataBuffer) {
    var parsed = upops.parseMultipartFormdata(dataBuffer);
 
    db.addUser(parsed["Email"].toString(), parsed["Username"].toString(), parsed["Password"].toString(), function(codes) {
        res.writeHead(200, {'content-type':'text/html'});
        page1 = new StandardPage();
        page1.standardMenus();
        if(codes.status == 0) {
            page1.setTitle("Success");
            page1.setContent("<h1>Signup successfull!</h1> <br /> <h2>Welcome: "+parsed["Email"].toString()+ "</h2> ");
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
}
