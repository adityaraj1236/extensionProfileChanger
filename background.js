// background.js
chrome.runtime.onInstalled.addListener(() => {
    chrome.declarativeContent.onPageChanged.removeRules(undefined, () => {
      chrome.declarativeContent.onPageChanged.addRules([{
        conditions: [
          new chrome.declarativeContent.PageStateMatcher({
            pageUrl: { hostEquals: 'www.linkedin.com', pathContains: 'feed' },
          })
        ],
        actions: [new chrome.declarativeContent.ShowPageAction()]
      }]);
    });
  });
  