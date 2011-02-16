#!/bin/bash

# A script to start the server in a UNIX environment. 
# Usage: ./runserver.sh <port>

# To start the server without using this script, use:
# $ node js/dispatcher.js <port>

if [ $# -ne 1 ]
then
	echo "Usage: runserver.sh <port>"
	exit 1
fi

node js/dispatcher.js $1
