// This file can be used by tests to get the path of CourseProject. This makes
// it much easier to have tests work whether they are run from within their test folder, or
// from alltests.sh

var fs = require('fs');
var path = require('path');

exports.mainpath = function () {
    var currDir = process.cwd();
    for (var nextDir = currDir.split("/"); nextDir.pop() != 'CourseProject'; currDir = nextDir.join("/")){
    }
    return currDir;
};
