var launcher = require("../lib/launcher");

exports["launches Phantom and runs the provided script"] = function(test) {
    var phantom = launcher.launch("console.log('foo'); phantom.exit();");
    phantom.on("output", function(data) {
        test.equal(data, "foo");
        test.done();
    });
};
