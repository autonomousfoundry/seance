var channel = require("../lib/channel");
var http = require("http");

exports["creates a two-way channel of communication with a PhantomJS WebPage object"] = function(test) {
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

exports["loads a URL into the WebPage upon creation, if specified"] = function(test) {
    var server = http.createServer(function(req, res) {
        res.writeHead(200, {"Content-Type": "text/html"});
        res.end("<html><body></body></html>");
    });
    server.listen("6543");
    var c = channel.create("http://localhost:6543/");
    c.send("console.log(document.location.href)");
    c.once("output", function(data) {
        test.equal("http://localhost:6543/", data);
        server.close();
        c.close();
        test.done();
    });
};