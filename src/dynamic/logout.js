var upops = require('uploadOps');

module.exports.getReq = function(req, res) {

    try {
        var cookies = upops.parseCookies(req.headers);
        var page = new StandardPage();
        page.standardMenus();
        page.setTitle("Logout");
        page.setContent("<h1>Logout successful</h1>");

        res.writeHead(200, {    'Content-Type': 'text/html', 
                                'Set-Cookie':   'Email=' + cookies.Email + '; expires=Thu, 01-Jan-1970 00:00:01 GMT',
                                'Set-cookie':   'Nickname=' + cookies.Nickname + '; expires=Thu, 01-Jan-1970 00:00:01 GMT'});
                                // Case difference between 'cookie' and 'Cookie' is important! Don't change it!
                                // If you do, the original 'Set-Cookie' will be overwritten in the passed array
                                // by the second 'Set-cookie.' Setting the second one to be 'Set-cookie' creates
                                // two cookie entries instead of one.
                                // NORMALLY, you would just have these entries separated by semicolons, but for some
                                // reason, the cookies aren't accepting that (I tested this over and over and this was the only
                                // way that seemed to work)
        res.end(page.toHTML());
    } catch(err) {
        console.log("There was an error: " + err);
    } 
}
