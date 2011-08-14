// This script is designed to run inside PhantomJS.
var page = new WebPage();
page.onConsoleMessage = function(m) { console.log(m); }

function nextCommand() {
    var url = "http://localhost:LISTEN_PORT/";
    page.includeJs(url, nextCommand);
}

var initialUrl = "INITIAL_URL";
if(initialUrl !== "INITI"+"AL_URL") {
    page.open(initialUrl, function(status) {
        if(status === "fail") {
            console.log("Error opening URL: "+initialUrl);
            phantom.exit();
        } else {
            nextCommand();
        }
    });
} else {
    nextCommand();
}
