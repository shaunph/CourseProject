#!/bin/sh
# 
# This script should execute all nodeunit tests in the Tests folder
#

cd ..
node ./js/createDatabase.js
node ./tests/nodeunit/bin/nodeunit ./tests/dbtest/dbtest_nodeunit.js
node ./tests/nodeunit/bin/nodeunit ./tests/dispatcher/dispatcher_nodeunit.js
node ./tests/nodeunit/bin/nodeunit ./tests/signup/signup_nodeunit.js

echo "Remove database?"
CONFIRM="Yes No"
    select resp in $CONFIRM; do
        if [ "$resp" = "Yes" ]; then
            echo "Removing database..."
            rm -r ./db
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
