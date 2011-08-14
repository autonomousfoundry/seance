var util = require("./util");
var channel = require("./channel");

var messageId = 0;

exports.attach = function(server) {
    var port = util.getUnusedPort();
    server.listen(port);
    return phantomPage(channel.create("http://localhost:"+port));
};

var savedCallbacks = {};
function phantomPage(channel) {
    channel.on("output", function(data) {
        var parts = data.split(":");
        savedCallbacks[parts[0]](parts[1]);
    });
    return {
        evaluate: function(script, callback) {
            var id = "m" + (messageId++);
            savedCallbacks[id] = callback;
            channel.send("console.log('"+id+":'+("+script+"));");
        },
        close: channel.close
    };
}
