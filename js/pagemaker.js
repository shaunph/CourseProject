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
				link(page.css)
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
 */

StandardPage = function()
{
	this.title = "<!-- needs a title -->";
	this.menu = new Array();
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
					css: this.css}); 
		}

	/*
	 * standardMenus() - adds 3 menus to the page as a sample.
	 *
	 */
	this.standardMenus = function()
	{
		this.addMenuItem("To Page 1", "page1.htm");
		this.addMenuItem("To Page 2", "page2.htm");
		this.addMenuItem("To Page 3", "page3.htm");
	}
}


