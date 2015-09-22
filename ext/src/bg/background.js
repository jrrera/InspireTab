var disabled = false;

var currentSite;

var urlPatterns = {
  facebook: /^https?:\/\/(www)?\.?facebook.com/,
  twitter: /^https?:\/\/(www)?\.?twitter.com/,
  groupme: /^https?:\/\/(app)?\.?groupme.com/,
  reddit: /^https?:\/\/(www)?\.?reddit.com/,
};

chrome.tabs.onUpdated.addListener(function(tabId, status, changeInfo) {
  var counts, site;

  // console.log('tab changed!', status, changeInfo);

  if (disabled) { return; }

  for (site in urlPatterns) {
    if (urlPatterns.hasOwnProperty(site)) {
      if (changeInfo.url && changeInfo.url.search(urlPatterns[site]) > -1) {

        currentSite = site; // Set as module global.

        // Get access to total number of accesses and send it as query string
        // along with redirect URL and sitename.
        counts = store.get('counts') || {};
        chrome.tabs.update(tabId, {
          url: 'src/interrupt/interrupt.html?redirect=' + encodeURIComponent(changeInfo.url) +
               '&site=' + site + '&count=' + (counts[site] || 0)
        });
      }
    }
  }
});

chrome.runtime.onMessage.addListener(function(msg, sender, sendResponse) {
  if (msg.allowEntry) {
    disabled = true;

    var counts = store.get('counts') || {};

    if (counts[currentSite]) {
      counts[currentSite]++;
    } else {
      counts[currentSite] = 1; // init
    }

    store.set('counts', counts);

    setTimeout(function() {
      disabled = false;
    }, msg.allowFor || (1 * 60 * 1000));

    sendResponse({ 'success': true });
  }
});
