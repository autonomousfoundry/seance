var seance = require("../lib");
var http = require("http");

exports["attaches to a node http server and closes it when done"] = function(test) {
    var server = createServer();
    var page = seance.attach(server);
    page.close();
    test.done();
};

exports["executes javascript and calls back with the result"] = function(test) {
    var server = createServer();
    var page = seance.attach(server);
    page.evaluate("document.title", function(value) {
        test.equal("TheTitle", value);
        page.close();
        test.done();
    });
};

exports["executes javascript and compares the result when available"] = function(test) {
    var server = createServer();
    var page = seance.attach(server);
    page.expectScriptResult("document.title", "TheTitle", function() {
        page.close();
        test.done();
    });
};

function createServer() {
    return http.createServer(function(req, res) {
        res.writeHead(200, {"Content-Type": "text/html"});
        res.end("<html><head><title>TheTitle</title></head><body></body></html>");
    });
}
