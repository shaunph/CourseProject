// This file can be used by tests to get the path of CourseProject. This makes
// it much easier to have tests work whether they are run from within their test folder, or
// from alltests.sh

var fs = require('fs');
var path = require('path');
var basepath;
var currDir = path.basename(process.cwd());

if (currDir == 'tests')
{
    basepath = '../';
}
else if (currDir == 'CourseProject')
{
    basepath = './';
}
else
{
    basepath = '../../';
}

exports.mainpath = fs.realpathSync(basepath);
