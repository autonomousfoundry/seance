var launcher = require("./launcher");
var util = require("./util");
var fs = require("fs");
var path = require("path");
var http = require("http");

exports.create = function(initialUrl) {
    var commandQueue = [], responseQueue = [];
    var payload = fs.readFileSync(path.join(__dirname, "payload.js"), "utf8");
    var port = util.getUnusedPort();
    payload = payload.replace("LISTEN_PORT", port);
    if(initialUrl) payload = payload.replace("INITIAL_URL", initialUrl);
    var phantom = launcher.launch(payload);
    var channel = util.extendEmitter();
    phantom.on("output", function(data) {
        channel.emit("output", data);
    });

    function processQueues() {
        if(commandQueue.length>0 && responseQueue.length>0) {
            responseQueue.shift().end(commandQueue.shift());
        }
    }

    var server = http.createServer(function(req, res) {
        responseQueue.push(res);
        processQueues();
    });

    server.listen(port);

    channel.send = function(code) {
        commandQueue.push(code);
        processQueues();
    }

    channel.close = function() {
        phantom.close();
        server.close();
        channel.emit("close");
    };

    return channel;
};
