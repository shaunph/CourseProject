var db = require('SQLiteHelper'),
    querystring = require('querystring'),
    pagemaker = require('pagemaker');

/*
 * Takes a post request and store the data in buffer.
 * Parses the buffer into results.
 */
exports.postReq = function(request, response) {
    var buffer, results;

    request.on('data', function(data) {
        buffer += data;
    });
    request.on('end', function() {
        results = querystring.parse(buffer);
        if (results.undefinedid) {
            results.id = results.undefinedid;
        }
        result(response, results);
    });
}

/*
 * Updates the specified task and displays a message.
 */
result = function(response, results) {
    response.writeHead(200, {'Content-Type': 'text/html'});

    page = new StandardPage();
    page.setTitle("Update Results");
    page.setContent("");
console.log(results.id + " " + results.description + " " + results.level + " " + results.progress + " " + results.status);
console.log(results);
    try {
        db.updateTask(results.id, results.description, results.level, results.progress, results.status, function(callback) {});
        page.addContent("Task was updated successfully.<br />");
    } catch(e) {
        page.addContent("Error occurred. Could not update task.<br />");
    }

    var id = results.id;

    // Specified link temporary; to be changed
    page.addContent("<a href='#'>Return to Task List page.</a>");

    page.standardMenus();

    response.write(page.toHTML());
    response.end();
}