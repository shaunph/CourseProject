#!/bin/sh

cd ..
cd ..
node js/createDatabase.js

node tests/nodeunit/bin/nodeunit tests/dispatcher/dispatcher_nodeunit.js

