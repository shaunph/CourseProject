#!/bin/sh

cd ..
node ../js/createDatabase.js	#TEMPORARY. remove when the callback in createDatabase is implemented

# Have to run dbtest_nodeunit from the tests directory because right now SQLite uses the
# working directory to refer to main.db
node nodeunit/bin/nodeunit dbtest/dbtest_nodeunit.js

rm -r ./db
