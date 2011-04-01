#!/bin/sh

cd ..
cd ..
node js/createDatabase.js

node tests/nodeunit/bin/nodeunit tests/tasktest/tasktest_nodeunit.js
