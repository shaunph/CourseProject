var upops = require('uploadOps');

module.exports.getReq = function(req, res) {

    var cookies = upops.parseCookies(req.headers);

    var page = new StandardPage(req);
    page.standardMenus();
    page.setContent("<h1>Logout successfull</h1>");

    res.writeHead(200, {    'Content-Type': 'text/html', 
                            'Set-Cookie':   'Email=' + cookies.Email + '; expires=Thu, 01-Jan-1970 00:00:01 GMT;' + ";" +
                                            'Nickname=' + cookies.Nickname + '; expires=Thu, 01-Jan-1970 00:00:01 GMT;'});
    res.end(page.toHTML());
}
