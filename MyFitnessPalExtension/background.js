//Called when the url of a tab changes.
function checkForValidUrl(tabId, changeInfo, tab) {
    // if the url contains myfitnesspal
    var myFitnessPalString = "myfitnesspal";
    if(tab.url.indexOf(myFitnessPalString) != -1)
    {
        // show the page action
        chrome.pageAction.show(tabId);
    }
};

      
chrome.runtime.onMessage.addListener(function(msg, _, sendResponse) {
  
    sendResponse(JSON.stringify([
        localStorage["days"],
        localStorage["data"],
        localStorage["fixURL"],
        localStorage["addNetCarbs"]
        ]));
  
  
  // If we don't return anything, the message channel will close, regardless
  // of whether we called sendResponse.
});
