#!/bin/sh

cd ..
cd ..
node js/createDatabase.js

node tests/nodeunit/bin/nodeunit tests/signup/signup_nodeunit.js

