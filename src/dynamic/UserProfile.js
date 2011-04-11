require('pagemaker');

exports.getReq = function(req, res) {


    var page = new StandardPage(req);
    page.setContent("<h1>Not yet implemented</h1>");
    page.standardMenus();

    res.writeHead(200, {'content-type':'text/html'});
    res.end(page.toHTML());
}
