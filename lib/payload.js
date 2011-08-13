// This script is designed to run inside PhantomJS.
var page = new WebPage();
page.onConsoleMessage = function(m) { console.log(m); }

function nextCommand() {
    page.includeJs("http://localhost:4321/", nextCommand);
}

nextCommand();
