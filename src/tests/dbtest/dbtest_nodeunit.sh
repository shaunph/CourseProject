#!/bin/sh

cd ..
cd ..
node js/createDatabase.js

node tests/nodeunit/bin/nodeunit tests/dbtest/dbtest_nodeunit.js

