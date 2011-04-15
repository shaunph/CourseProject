/**
 * Created by .
 * User: masudio
 * Date: 26/03/11
 * Time: 2:35 PM
 * To change this template use File | Settings | File Templates.
 */

var basepath = require('basepath').mainpath;
var slh = require("SQLiteHelper");
var pagemaker = require("pagemaker");

exports.getReq = function(request, response, code) {

    console.log(code + " Response.");

    if(code == 404) {
        respond404(request, response);
    } else if(code == 500) {
        respond500(request, response);
    } else {
        respondOther(request, response, code);
    }
}

function respond404(request, response) {

    var page404 = new StandardPage(request);
    page404.standardMenus();
    page404.setTitle("404 Page not found");
    page404.setContent("<h3>I swear it was here before...</h3>");
    page404.addContent("<img src = '/img/pic404.jpg'>");
    page404.addContent("<h1>404</h1>")
    response.write(page404.toHTML());
    response.end();
}

function respond500(request, response) {

    var page500 = new StandardPage(request);
    page500.standardMenus();
    page500.setTitle("500 Server error");
    page500.setContent("<h3>Don't worry, we've got a great warranty...</h3>");
    page500.addContent("<img src = '/img/pic500.jpg'>");
    page500.addContent("<h1>500</h1>")
    response.write(page500.toHTML());
    response.end();
}

function respondOther(request, response, code) {

    var pageError = new StandardPage();
    pageError.standardMenus();
    pageError.setTitle(code + " Unexpected Error.");
    pageError.setContent("<h3>It's my first day!</h3>");
    pageError.addContent("<img src = '/img/picUnexpected.jpg'>");
    pageError.addContent("<h1>500</h1>")
    response.write(pageError.toHTML());
    response.end();
}
