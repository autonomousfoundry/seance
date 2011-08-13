var channel = require("../lib/channel");

exports["creates a two-way channel of communication with PhantomJS"] = function(test) {
    var c = channel.create();
    c.send("console.log('one');");
    c.once("output", function(data) {
        test.equal(data, "one");
        c.send("console.log('two');");
        c.once("output", function(data) {
            test.equal(data, "two");
            c.close();
            test.done();
        });
    });
};
