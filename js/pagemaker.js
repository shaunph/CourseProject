var jaml = require('./jaml');

/*
 * pagemaker.js
 * Renders HTML pages in a standard 2 column floating div form.
 * Sample usage:
 * 
 * page1 = new StandardPage();
 * page1.setTitle("Main Page");
 * page1.setContent("This is the main page" 
 *	 +"<img src='http://www.boncherry.com/blog/wp-content/"
 *		+"uploads/2010/01/popcorn.jpg'>");
 * page1.addMenuItem("Next Page", "/page2.htm");
 *
 * response.write(page1.toHTML());
 *
 * This is probably the most basic possible usage (assuming the existance of 
 *	a HTTP request 'response') and will return the following:
 *
 * <html>
 *  <head>
 *    <title>Main Page</title>
 *    <link href="style.css" rel="stylesheet" type="text/css"/>
 *  </head>
 *  <body>
 *    <div id="header">
 *      <h1>Project Title</h1>
 *      <h2>Main Page</h2>
 *    </div>
 *    <div id="menus"><a href="/page2.htm">Next Page</a>
 *     <br/>
 *    </div>
 *    <div id="content">This is the main page<img src='http://www.boncherry.com/
 *		blog/wp-content/uploads/2010/01/popcorn.jpg'></div>
 *  </body>
 * </html>
 */


/*
 * 'script' Jaml function- takes a script={String url} object 
 *	as argument, formats a reference in the page head to this file
 */
Jaml.register('script', function(file)
		{
			script({type:'text/javascript', src:file.url });
		});

/*
 * 'menu' Jaml function- takes a menu={String url, String display} object 
 *	as argument, and formats a link for the menu div of the page
 */
Jaml.register('menu', function(menuitem)
		{
			a({href:menuitem.url}, menuitem.display);
			br();
		});

/*
 * 'stdpage' Jaml function- takes a page=	{String title, 
 *						 [menu] menu, 
 *						 String content
 *						 String css} object,
 *		This renders a page in a standard 2 column floating div style 
 *		described by the html/style.css file.
 */

Jaml.register('stdpage', function(page)
	{
		html(
			head(
				title(page.title.toString()),
				link(page.css),
				Jaml.render('script', page.script)
				),
			body(
				div({id:"header"},
					h1("Project Title"), 
					h2(page.title.toString())),
				div({id:"menus"}, Jaml.render('menu', page.menu)),
				div({id:"content"}, page.content)
			)
		);
	});
	
      
/*
 * The standard page constructor, takes no arguments returns a page object 
 * which may be modified to change the content and add title etc.
 *
 * Note: We dont need exports for StandardPage as it is a class, and we
 *      create instances of it with 'new', which doesnt require the exports. -CM
 */

StandardPage = function()
{
	this.title = "<!-- needs a title -->";
	this.menu = new Array();
	this.script = new Array();
	this.content = "<!-- needs some content -->";
	this.css = {href: "style.css", rel:"stylesheet", type: "text/css"};
	
	/*
	 * setContent(String newcontent) sets the content for the page.
	 *	This will be in the form of HTML, and will be placed in it's 
	 *	literal form into the main content div of the page.
	 *
	 */
	this.setContent = function(newcontent) 
		{ this.content = newcontent; }

	/*
	 * addContent(String newContent) adds the newContent to the current
	 * content that is already there.
	 */
	this.addContent = function(newcontent) {
		this.content += newcontent;
	}
	
	/*
	 * setTitle(String newtitle) sets the title for the page
	 *
	 */
	this.setTitle = function(newtitle) 
		{ this.title = newtitle; }
	/*
	 * addMenuItem(String newdisplay, String newurl)
	 *	adds a new menu link, with the display name 'newdisplay'
	 *	to the url 'newurl'
	 */
	this.addMenuItem = function(newdisplay, newurl) 
		{ 
			this.menu[this.menu.length] = {display:newdisplay, 
							url:newurl }; 
		}

	/*
	 * addScript(String newurl)
	 *	adds a new reference to a javascript file at the url 'newurl'
	 */
	this.addScript = function(newurl) 
		{ 
			this.script[this.script.length] = { url:newurl }; 
		}

	/*
	 * toHTML() - returns the page data, rendered in the form of HTML, 
	 *	by Jaml.
	 *
	 */
	this.toHTML = function() 
		{ 
			return Jaml.render('stdpage', 
				{title: this.title, 
					menu: this.menu, 
					content: this.content,
					css: this.css,
					script: this.script}); 
		}

	/*
	 * standardMenus() - adds 3 menus to the page as a sample.
	 *
	 */
	this.standardMenus = function()
	{
		this.addMenuItem("Main", "index.html");
		this.addMenuItem("Signup", "signup.html");
		this.addMenuItem("Task Page", "taskpage.html");
		this.addMenuItem("Update Task", "updatetask.html");
		this.addMenuItem("Add Task", "addtask.html");
		this.addMenuItem("User Profile", "UserProfile");
	}
}

exports.ParsePage = function(file, callback) {
	var page1 = new StandardPage();
	var content;
	var istream = fs.createReadStream(file);
	istream.setEncoding('utf8');
	
	istream.on('data', function(data) {
		content += data;
	});

		
	istream.on('end', function() {

		page1.standardMenus();

	//Start looking for <script></script> tags to put into the page.
		var scripts = content.split("<script");
		var scr = [];
		var scr1 = []
		var scr2 = [];
	//find the src of the script
		for(var i = 1; i < scripts.length; i++) {
			scr1.push(scripts[i].split(" src="));
		}
	//remove unneeded characters.
		for(var i = 0; i < scr1.length; i++) {
			scr2.push(scr1[i][1].substr(1).split(".js")[0]);
		}
	//add script to the page.
		for(var i = 0; i <= scr2.length; i++) {
			var s = scr2.pop();
			page1.addScript(s + ".js");
		}

	//find the body of the page
		var body = content.split("<body>");
		if(body.length > 0)
			page1.setContent(body[1].split("</body>")[0]);

		var title = content.split("<title>");
		if(title[1] !== undefined)
			page1.setTitle(title[1].split("</title>")[0]);
		
		
		callback(page1.toHTML());
	});

}
