#!/bin/bash

# A script to start the server in a UNIX environment. 
# Usage: ./initbuild.sh

# Taken out of Jeremy's runserver.sh
# Builds sqlite3 and the database

cd src &&

if [ ! -f lib/node-sqlite/sqlite3_bindings.node ]
then
    echo "building node sqlite bindings..." &&
    cd lib/node-sqlite/ &&
    ./build.sh &&
    cd ../../
fi

echo "building db..." &&
node js/createDatabase.js
