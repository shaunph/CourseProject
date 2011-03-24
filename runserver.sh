#!/bin/bash

# A script to start the server in a UNIX environment. 
# Usage: ./runserver.sh <port>

# To start the server without using this script, use:
# $ node src/js/dispatcher.js <port>

if [ $# -ne 1 ]
then
	echo "Usage: runserver.sh <port>"
	exit 1
fi

if [ -f src/lib/node-sqlite/sqlite3_bindings.node ]
then
	node src/js/dispatcher.js $1
else
	echo "building node sqlite bindings..."
	cd src/lib/node-sqlite/ &&
	./build.sh &&
	cd ../../../ &&
	node src/js/dispatcher.js $1
fi
