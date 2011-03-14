#!/bin/sh
# 
# This script should execute all nodeunit tests in the Tests folder
#

node ./nodeunit/bin/nodeunit dbtest/*_nodeunit.js


# Append either the names of the folders containing your
# tests (if you want every .js file in there to run), or
# include the files like thus: <folder name>/<file>.js
# for each file you want to have executed during the tests,
# using a single space as a separator.
# - Charles (cdebavel@ucalgary.ca)

