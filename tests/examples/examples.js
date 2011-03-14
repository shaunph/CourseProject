/*****************************************************
 * This is an example test file which demonstrates
 * how tests should be designed for testing with
 * nodeunit. More info in NodeUnitTesting.pdf.
 * 
 * If you have any trouble or questions,
 * send me an email at cdebavel@ucalgary.ca
 *			- Charles
 *
 *****************************************************


/**
 * Format:
 * exports.<test name> = function(test) {
 *     test.expect(<number of expected Assertions>);
 *     test.ok(<value to test, should equal 'true'>, "<message to show if this fails>");
 *     test.equal(<actual value>, <expected value>, "<message to show if this fails>");
 *     test.done();    // All assertions/tests for this particular test are done
 * };
 *
 * This may be followed by as many as you like.
 * A full list of possible tests (assertions) can be found
 * in the other file I've included, NodeUnitTesting.pdf
 *
 **/
 
exports.testPass = function(test) {
    test.expect(1);
    test.ok(true, "You should NOT see this message when this test is run.");
    test.done();
};

exports.testFail = function(test){
    test.expect(1);
    test.equal(1, 0, "You SHOULD see this message when this test is run. This test fails.");
    test.done();
};

exports.testWrongNumberOfAsserts = function(test){
    test.expect(2);
    test.ok(true, "You should NOT see this message at test run, because the expected number of assertions is wrong.");
    test.done();
};

exports.testNoExpectedAssertsGiven = function(test){
    // Notice that you do not have to provide the
    // expected number of assertions if you don't want to.
    // However, they should be provided as this will make
    // catch some potential mistakes made in the creation
    // of your unit tests.
    test.ok(3 > 2, "You should NOT see this message at test run.");
    test.done();
};


/**
 * Tests may also be written as suites.
 * This makes it easier when analyzing the
 * tests results, as you can more easily
 * see which area of your unit is failing.
 *
 **/
 
exports.testSuiteOne = {
    'Suit 1 Member One': function (test) {
        test.ok(true, "Shouldn't see this at test run");
        test.done();
    },
    
    'Suit 1 Member Two': function (test) {
        test.ok(2 < 3, "Shouldn't see this at test run");
        test.done();
    }
};

exports.testSuiteTwo = {
    'Suit 2 Member One': function (test) {
        test.equal(2, 2, "Shouldn't see this at test run");
        test.done();
    },
    
    'Suit 2 Member Two': function (test) {
        test.notEqual(1, 2, "Shouldn't see this at test run");
        test.done();
    }
};

exports.TwoAssertionsOfTenShouldFail = function(test) {
    test.expect(1);
    test.ok(true, "When this example is run, it should say that 2/10 assertions failed.");
    test.done();
};

