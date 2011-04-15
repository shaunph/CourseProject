#!/bin/sh

cd ..
cd ..
node js/createDatabase.js

node tests/nodeunit/bin/nodeunit tests/comments/commentstest_nodeunit.js

