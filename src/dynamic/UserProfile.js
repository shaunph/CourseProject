require('pagemaker');

exports.getReq = function(req, res) {


    var page = new StandardPage();
    page.setContent("Not yet implemented");
    page.standardMenus();

    res.writeHead(200, {'content-type':'text/html'});
    res.end(page.toHTML());
}
