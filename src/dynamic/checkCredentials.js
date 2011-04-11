var db = require('SQLiteHelper');
var qs = require('querystring');
var upops = require('uploadOps');
var pagemaker = require('pagemaker');

module.exports.postReq = function(request, response, dataBuffer) {

    try {
        
        var parsed = upops.parseMultipartFormdata(dataBuffer);
        
        db.userExists(parsed["Email"].toString(), function(codes) {
            if(codes.status == 0 && codes.exists == true) {
                db.getUser(parsed["Email"].toString(), function(codes) {
        
                    //right here we need to make sure the passwords match before success screen
                    if(parsed["Password"].toString() == codes.rows[0].password) {
                        //success
                        response.writeHead(200, {   'content-type':'text/html', 
                                                    'set-cookie':   'Email='+codes.rows[0].email + ' ; ; ' +
                                                                    'Nickname='+codes.rows[0].nickname
                                            });
                        var page = new StandardPage(request);
                        page.setTitle("Login Successful");
                        page.setContent("<h1>User found</h1>");
                        page.standardMenus();
                        response.end(page.toHTML());
                    }
                    else {
                        //failure
                        response.writeHead(200, { 'content-type':'text/html' });
                        var page = new StandardPage(request);
                        page.setTitle("Login Denied");
                        page.setContent("<h1> Denied </h1>");
                        page.addContent("<h2> Username and password don't match </h2>");
                        page.addContent("<p><a href=\"/login.html\">Try again</a></p>");
                        page.standardMenus();
                        response.end(page.toHTML());
                    }
              });
            }
            else if(codes.status == 0 && codes.exists == false) {
                response.writeHead(200, {'content-type':'text/html'});
                var page = new StandardPage(request);
                page.setTitle("Login");
                page.setContent("<h1>User not found</h1>");
                page.addContent("<p><a href=\"/login.html\">Try again</a></p>");
                page.standardMenus();
                response.end(page.toHTML());
            }
            else {
                response.writeHead(200, {'content-type':'text/html'});
                var page = new StandardPage(request);
                page.setTitle("Login - Error");
                page.setContent("<h1>There was a server error</h1>"); 
                page.addContent("<p><a href=\"/login.html\">Try again</a></p>");
                page.standardMenus();
                response.end(page.toHTML());               
            }
        });

    } catch(err) {
        console.log(err);
    }
}

