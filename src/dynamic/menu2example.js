var pagemaker = require('pagemaker');

exports.getReq = function (request, response) {
    response.writeHead(200, {'Content-Type': 'text/html'});
    
    var page1 = new StandardPage();
    page1.setTitle("onClick Menu Demo");
    page1.setContent("<h1> Try the menu!</h1>");

    page1.standardMenus();

    page1.addOnClickItem("Big Feed", "pullGenFeedsTo('column2')");
    page1.addOnClickItem("Nest this Page", "pullURLTo('/menu2example','column2')");
    page1.addOnClickItem("Alert", "alertfunc();");
    page1.addContent("<script type='text/javascript'>function alertfunc() { alert('This menu item works properly') }</script>");

    response.write(page1.toHTML());
    
    response.end();
    
}
