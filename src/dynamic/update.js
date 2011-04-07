var db = require('SQLiteHelper'),
    upops = require('uploadOps'),
    pagemaker = require('pagemaker');

/*
 * Takes a post request and store the data in buffer.
 * Parses the buffer into results.
 */
exports.postReq = function(request, response, dataBuffer) {
    var results = upops.parseMultipartFormdata(dataBuffer);
    result(response, results);
}

/*
 * Updates the specified task and displays a message.
 */
result = function(response, results) {
    response.writeHead(200, {'Content-Type': 'text/html'});

    page = new StandardPage();
    page.setTitle("Update Results");
    page.setContent("");

    try {
        var tId = results["id"].toString(),
            tDescription = results["description"].toString(),
            tLevel = results["level"].toString(),
            tProgress = results["progress"].toString(),
            tStatus = results["status"].toString();

        if (tDescription.trim().length == 0) {
            tDescription = "No Description";
        }

        if (tProgress.trim().length == 0) {
            tProgress = "Unknown";
        }

        db.updateTask(tId, tDescription, tLevel, tProgress, tStatus, function(callback) {});
        page.addContent("Task was updated successfully.<br />");
    } catch(e) {
        page.addContent("Error occurred. Could not update task.<br />");
    }

    // Specified link temporary; to be changed
    page.addContent("<a href='#'>Return to Task List page.</a>");

    page.standardMenus();

    response.write(page.toHTML());
    response.end();
}