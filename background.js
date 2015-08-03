var feedSelector = "div[id^=\"topnews_main_stream\"]"
var facebookUrlPattern = "facebook.com"

var setFeedVisibility = function(tabId, visibility) {
  chrome.tabs.executeScript(
    tabId,
    { code: "document.querySelector('" + feedSelector + "').style.visibility = '" + visibility + "'" }
  );
}

// Add pageAction
chrome.runtime.onInstalled.addListener(function() {
  chrome.declarativeContent.onPageChanged.removeRules(undefined, function() {
    chrome.declarativeContent.onPageChanged.addRules([
      {
        conditions: [
          new chrome.declarativeContent.PageStateMatcher({
            pageUrl: { urlContains: facebookUrlPattern }
          })
        ],
        actions: [ new chrome.declarativeContent.ShowPageAction() ]
      }
    ]);
  });
});

// When pageAction is clicked, toggle feed visibility
chrome.pageAction.onClicked.addListener(function(tab) {
  chrome.tabs.executeScript(
    tab.id,
    { code: "document.querySelector('" + feedSelector + "').style.visibility" },
    function(results) {
      if (results[0] == "hidden") {
        setFeedVisibility(tab.id, "visible");
      } else {
        setFeedVisibility(tab.id, "hidden");
      }
    }
  );
});

// Start with feed hidden
chrome.tabs.onUpdated.addListener(function(tabId, change, tab) {
  if (change.status == "complete" && tab.url.includes(facebookUrlPattern)) {
    setFeedVisibility(tabId, "hidden");
  }
});

