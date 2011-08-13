var fs = require("fs"), childProcess = require("child_process");
var util = require("./util");

exports.launch = function(script) {
    var tempFile = "/tmp/seance_phantom_script.js";
    fs.writeFileSync(tempFile, script);
    var args = ["phantomjs", "--load-images=no", tempFile];
    var phantomProcess = childProcess.spawn("/usr/bin/env", args);
    var phantom = util.extendEmitter();
    phantomProcess.stdout.on("data", function(data) {
        data = turnNodeJsPseudoStringIntoRealString(data);
        data = stripTrailingNewline(data);
        phantom.emit("output", data);
    });
    phantomProcess.stderr.on("data", function(data) {
        throw new Error("Error launching Phantom: "+data);
    });
    phantom.close = function() {
        phantomProcess.kill();
    };
    return phantom;

    function stripTrailingNewline(string) {
        return string.replace(/\n$/, "");
    }

    function turnNodeJsPseudoStringIntoRealString(string) {
        return string + "";
    }
}; 