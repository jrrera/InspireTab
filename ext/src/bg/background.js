var disabled = false;

var currentSite;

var urlPatterns = {
  facebook: /^https?:\/\/(www)?\.?facebook.com/,
  twitter: /^https?:\/\/(www)?\.?twitter.com/,
  groupme: /^https?:\/\/(app)?\.?groupme.com/,
  reddit: /^https?:\/\/(www)?\.?reddit.com/,
};

var disableDurationInMinutes = 5;

/**
 * Helper function that generates a date string YYYYMMDD as storage key.
 * @return {string} Date string in form of YYYYMMDD.
 */
function getCountsKey() {
  var today = new Date();
  var dd = today.getDate();
  var mm = today.getMonth() + 1; // 0 based months.
  var yyyy = today.getFullYear();
  return yyyy + mm + dd;
}

chrome.tabs.onUpdated.addListener(function(tabId, status, changeInfo) {
  var counts, site,
      countsKey = getCountsKey();

  // console.log('tab changed!', status, changeInfo);

  if (disabled) { return; }

  for (site in urlPatterns) {
    if (urlPatterns.hasOwnProperty(site)) {
      if (changeInfo.url && changeInfo.url.search(urlPatterns[site]) > -1) {

        currentSite = site; // Set as module global.

        // Get access to total number of accesses and send it as query string
        // along with redirect URL and sitename.
        counts = store.get(countsKey) || {};
        chrome.tabs.update(tabId, {
          url: 'src/interrupt/interrupt.html?redirect=' + encodeURIComponent(changeInfo.url) +
               '&site=' + site + '&count=' + (counts[site] || 0) +
               '&minutes=' + disableDurationInMinutes
        });
      }
    }
  }
});

chrome.runtime.onMessage.addListener(function(msg, sender, sendResponse) {
  countsKey = getCountsKey();
  if (msg.allowEntry) {
    disabled = true;

    var counts = store.get(countsKey) || {};

    if (counts[currentSite]) {
      counts[currentSite]++;
    } else {
      counts[currentSite] = 1; // init
    }

    store.set(countsKey, counts);

    setTimeout(function() {
      disabled = false;
    }, msg.allowFor || (disableDurationInMinutes * 60 * 1000));

    sendResponse({ 'success': true });
  }
});
