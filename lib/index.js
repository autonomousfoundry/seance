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
        var parts = data.split(":");
        savedCallbacks[parts[0]](parts[1]);
    });
    function evaluate(script, callback) {
        var id = "m" + (messageId++);
        savedCallbacks[id] = callback;
        channel.send("console.log('"+id+":'+("+script+"));");
    }

    return {
        evaluate: evaluate,
        expectScriptResult: function(script, value, callback) {
            evaluate(script, function(result) {
                assert.deepEqual(result, value);
                if(callback) callback();
            });
        },
        close: channel.close
    };
}
