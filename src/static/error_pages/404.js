/**
 * Created by .
 * User: masudio
 * Date: 25/03/11
 * Time: 9:17 AM
 * To change this template use File | Settings | File Templates.
 */

var basepath = require('basepath').mainpath;
var slh = require(basepath + "node_modules/SQLiteHelper.js");
var pagemaker = require(basepath + "node_modules/pagemaker.js");

exports.getReq = function(request, response) {

    console.log("404 Response.");

    var page404 = new StandardPage();
    page404.standardMenus();
    page404.setTitle("404 Page not found");
    page404.addContent("<h3>I swear it was here before...</h3>");
    page404.addContent("<img src = '../img/pic404.jpg'>");
    page404.addContent("<h1>404</h1>")
    response.write(page404.toHTML());
    response.end();
}