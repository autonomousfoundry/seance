var seance = require("../lib");
var http = require("http");

exports["attaches to a node http server and signals when ready"] = function(test) {
    var server = http.createServer();
    seance.attach(server).on("ready", function(page) {
        page.close();
        server.close();
        test.done();
    });
};

exports["executes javascript in the page context"] = function(test) {
    var server = http.createServer(function(req, res) {
        res.writeHead(200, {"Content-Type": "text/html"});
        res.end("<html><head><title>TheTitle</title></head><body></body></html>");
    });
    seance.attach(server).on("ready", function(page) {
        page.evaluate("document.title", function(value) {
            test.equal("TheTitle", value);
            page.close();
            server.close();
            test.done();
        });
    });
};
