// if you checked "fancy-settings" in extensionizr.com, uncomment this lines

// var settings = new Store("settings", {
//     "sample_setting": "This is how you use Store.js to remember values"
// });

var disabled = false;


//example of using a message handler from the inject scripts
chrome.extension.onMessage.addListener(
  function(request, sender, sendResponse) {
  	chrome.pageAction.show(sender.tab.id);
    sendResponse();
  });

chrome.tabs.onUpdated.addListener(function(tabId, status, changeInfo) {
  console.log('tab changed!', changeInfo);
  if (disabled) { return; }
  if (changeInfo.url && changeInfo.url.search(/^https?:\/\/(www)?\.?facebook.com/) > -1) {
    chrome.tabs.update(tabId, {
      url: 'src/interrupt/interrupt.html?redirect=' + encodeURIComponent(changeInfo.url)
    });
  }
});


// listen for a message to flip the flag on and off.

// another approach would be to make a DOM overlay so you don't need to do background intercepts.
