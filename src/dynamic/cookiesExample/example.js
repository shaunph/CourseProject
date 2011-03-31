/* Author: Mitchell Ludwig
 This is an example of how to use cookies to persist a session, 
 and also uses the principles of dynamic page generation 
 and URL encoded parameters.
 The example is formatted as a game. You first enter a username 
 and then begin to play. The game sets your username as a cookie,
 and when you close your browser or hit logout, your cookie is 
 deleted, and you will need to log in again.
 NOTE: The session begins at ./static/cookiesExample/index.html
*/

var pagemaker = require('pagemaker');
var url = require('url');
var upops = require('uploadOps.js');

exports.getReq = function (request,response) {
    // Parses the URL encoded parameters, which you can 
    //  see in your address bar.
    var params = url.parse(request.url, true).query;

    // Parses the cookies received by the server, which you
    //  can use to detect the username, or any persistent info.
    var cookies = upops.parseCookies(request.headers);
    
    // If the user is just logging in for the first time:
    if (params.user!=undefined) {
        //Write a 301 - page redirect to example.js (this script). And set the "user" cookie.
        // This will cause the browser to refresh the page, and send the cookie to the server.
        //NOTE: If you choose to use setHeader instead of writeHead, you will need to call it BEFORE writeHead.
        //The order of execution should be setHeader->writeHead->write->end, though some steps can be skipped.
        response.writeHead(301, {'Location': 'example.js', 'Content-Type': 'text/html', 'Set-Cookie': 'user='+params.user});
        response.end();
    } else {
        //If the logout button was clicked, resulting in a URL of example.js?logout=Logout
        // This URL is set by the browser, because "logout" is the name of the Logout Button
        if (params.logout!=undefined) {
            //Erase the user cookie and redirect to the log in page.
            //Cookies are erased by setting an expiry date in the past.
            response.writeHead(301, {'Location': 'index.html', 'Content-Type': 'text/html', 'Set-Cookie': 'user=' + params.user + '; expires=Thu, 01-Jan-1970 00:00:01 GMT;'});
            response.end();
        //If the user is logged in
        } else if (cookies.user!=undefined) {
            //Begin dynamic page generation
            page1 = new StandardPage();
            //Set the title
            page1.setTitle("Cookies Game");
            //Set the initial content
            page1.setContent('<p>Which direction do you want to look to?</p>');
            //Load the standard menus
            page1.standardMenus();
            //If the user entered a direction, display some text, "act" is the name of the textbox on the game page.
            if (params.act!=undefined) {
                //If the user clicked the look button
                if (params.look=="Look") {
                    switch(params.act) {
                    case "the north":
                        //You can access cookies sent by the browser very easily with the parseCookies function in uploadOps.js
                        //Here we access the username, to make the game more intense.
                        page1.addContent('<p> To the north ' + cookies.user + ' sees vast rolling prairies streatching in front of them. Bison roam freely. The sports teams suck. </p>');
                        break;
                    case "the south":
                        page1.addContent('<p> To the south ' + cookies.user + ' sees a vast people. The kind of people who eat a MacDonalds. </p>');
                        break;
                    case "the east":
                        page1.addContent('<p> To the east you see your birthplace. On the bed there is a sign: </p><p>' + cookies.user + "</p><p>It's a boy!</p><p> And you realize, there are very few girls in CPSC. Sorry Cindy, I called you a boy.</p>");
                        break;
                    case "the west":
                        page1.addContent('<p> To the west the mountains loom on the horizon. The snow capped peaks glisten in the sunlight. ' + cookies.user + ' realizes that they are outdoors and far away from their computer. The sharp emotional pain at this realization pushes you back inside to the comfort of the glowing screen.</p>');
                        break;
                    default:
                        page1.addContent("<p>You clearly don't know your directions...you'll probably look at the code to see what the program expects. Seriously get a life, go outside, breathe real air. Buy a compass, even if your iPhone already has one.</p>");
                    }
                }
            }
            
            //This adds the form, and puts a textbox and two buttons on it.
            //Note the form method is "get", which means that an HTTP GET request
            // will be sent to the server.
            //The action parameter specifies which page to encode into the URL
            //The look button, when clicked, appends "look=Look" into the URL encoding
            //The logout button, when clicked, appends "logout=Logout" into the URL encoding
            page1.addContent('<form method=get name=upform action="example.js">' + 
                '<p>Direction: <input type="text" name="act" value="" /></p>'  + 
                '<p><input type="submit" name="look" value="Look" /></p>' + 
                '<p><input type="submit" name="logout" value="Logout" /></form></p>');
            
            page1.addContent("<p>Logged in as " + cookies.user + '</p>');
            
            response.writeHead(200, {'Content-Type': 'text/html'});
            response.write(page1.toHTML());
            response.end();
        } else {
            //If the user erroneously came to the page, with no set username, redirect them to the login page
            console.log("Redirecting no user");
            response.writeHead(301, {'Location': 'index.html', 'Content-Type': 'text/html'});
            response.end();
        }
    }
}