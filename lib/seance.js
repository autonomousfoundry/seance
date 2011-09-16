var util = require("./util");
var channel = require("./channel");
var assert = require("assert");

var messageId = 0;

exports.attach = function(server) {
    var port = util.getUnusedPort();
    server.listen(port);
    var newChannel = channel.create("http://localhost:"+port);
    newChannel.on("close", function(){ server.close(); });
    return phantomPage(newChannel);
};

var savedCallbacks = {};
function phantomPage(channel) {
    channel.on("output", function(data) {
        var tokens = data.split(":"), status = tokens[0];
        if(status !== "SUCCESS" || tokens.length < 3) {
            throw new Error("(on page) "+data);
        }
        var id = tokens[1], value = tokens.slice(2).join(":");
        if(savedCallbacks[id]) savedCallbacks[id](value);
    });
    function evaluate(script, callback) {
        var id = "m" + (messageId++);
        savedCallbacks[id] = callback;
        channel.send("console.log('SUCCESS:"+id+":'+("+script+"));");
    }
    function execute(script, callback) {
        var id = "m" + (messageId++);
        savedCallbacks[id] = callback;
        channel.send(script+"; console.log('SUCCESS:"+id+":true');");
    }
    function expectScriptResult(script, value, callback) {
        evaluate(script, function(result) {
            assert.deepEqual(result, value);
            if(callback) callback();
        });
    }

    return {
        evaluate: evaluate,
        execute: execute,
        expectScriptResult: expectScriptResult,
        expectContent: function(content, callback) {
            var escapedContent = content.replace(/\"/, /\\\"/);
            expectScriptResult("$('*:contains(\""+escapedContent+"\")').length>0", "true", callback);
        },
        close: channel.close
    };
}
