sys = require('sys');
fs = require('fs');
path = require('path');

TestSuite = require('async-testing/async_testing').TestSuite;
sqlite = require('sqlite3_bindings');
common = require('./lib/common');

puts = sys.puts;
inspect = sys.inspect;

var name = "Caching of lastInsertedRowID";
var suite = exports[name] = new TestSuite(name);

function createTestTable(db, callback) {
  db.prepare('CREATE TABLE table1 (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT)',
    function (error, createStatement) {
      if (error) throw error;
      createStatement.step(function (error, row) {
        if (error) throw error;
        callback();
      });
    });
}

var tests = [
  { 'insert a row with lastinsertedid':
    function (assert, finished) {
      var self = this;

      self.db.open(':memory:', function (error) {
        function createStatement(error, statement) {
          if (error) throw error;
          statement.step(function (error, row) {
            assert.equal(this.lastInsertRowID, 101, "Last inserted id should be 1");
            assert.equal(this.affectedRows, 1, "Last inserted id should be 1");
            statement.reset();

            statement.step(function (error, row) {
              assert.equal(this.lastInsertRowID, 102, "Last inserted id should be 1");
              assert.equal(this.affectedRows, 1, "Last inserted id should be 1");

              finished();
            });
          });
        }

        createTestTable(self.db,
          function () {
            common.insertMany(self.db , 'table1'
                            , ['id', 'name']
                            , [ [100, "first post!"] ]
                            , function () {
              self.db.prepare('INSERT INTO table1 (name) VALUES ("orlando")'
                              , { affectedRows: true, lastInsertRowID: true }
                              , createStatement);
                
            });
          });
      });
    }
  }
];

// order matters in our tests
for (var i=0,il=tests.length; i < il; i++) {
  suite.addTests(tests[i]);
}

var currentTest = 0;
var testCount = tests.length;

suite.setup(function(finished, test) {
  this.db = new sqlite.Database();
  finished();
});
suite.teardown(function(finished) {
  if (this.db) this.db.close(function (error) {
                               finished();
                             });
  ++currentTest == testCount;
});

if (module == require.main) {
  suite.runTests();
}
