/**
 * Created by .
 * User: masudio
 * Date: 25/03/11
 * Time: 9:28 PM
 * To change this template use File | Settings | File Templates.
 */

var basepath = require('basepath').mainpath;
var slh = require(basepath + "node_modules/SQLiteHelper.js");
var pagemaker = require(basepath + "node_modules/pagemaker.js");

exports.getReq = function(request, response) {

    console.log("500 Response.");

    var page500 = new StandardPage();
    page500.standardMenus();
    page500.setTitle("500 Server error");
    page500.addContent("<h3>Don't worry, we've got a great warranty...</h3>");
    page500.addContent("<img src = '../img/pic500.jpg'>");
    page500.addContent("<h1>500</h1>")
    response.write(page500.toHTML());
    response.end();
}