#!/bin/sh
# 
# This script should execute all nodeunit tests in the Tests folder
#

node ../js/createDatabase.js	#TEMPORARY. remove when the callback in createDatabase is implemented
node ./nodeunit/bin/nodeunit dbtest/dbtest_nodeunit.js
node ./nodeunit/bin/nodeunit dispatcher/dispatcher_nodeunit.js
node ./nodeunit/bin/nodeunit signup/signup_nodeunit.js

CONFIRM="Yes No"
    select resp in $CONFIRM; do
        if [ "$resp" = "Yes" ]; then
            rm -r ./db
            echo "Database removed."
            exit
        else
            exit
        fi
    done



# Add a new line with either the names of the folders containing your
# tests (if you want every .js file in there to run), or
# include the files like thus: <folder name>/<file>.js
# for each file you want to have executed during the tests,
# using a single space as a separator.
# - Charles (cdebavel@ucalgary.ca)
