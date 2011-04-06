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
else
    echo "Node sqlite has already been built."
fi

if [ ! -d db ]
then
    echo "building db..." &&
    node js/createDatabase.js
else
    echo "db has already been built."
fi
