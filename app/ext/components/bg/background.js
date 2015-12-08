/* jshint esnext: true */

var disabled = false;

var currentSite;

var urlPatterns = {
  facebook: /^https?:\/\/(www)?\.?facebook.com/,
  twitter: /^https?:\/\/(www)?\.?twitter.com/,
  groupme: /^https?:\/\/(app)?\.?groupme.com/,
  reddit: /^https?:\/\/(www)?\.?reddit.com/,
  mail: /^https?:\/\/mail\.google.com/,
  inbox: /^https?:\/\/inbox\.google.com/,
};

const DISABLE_DURATION_MINUTES = 10;

const SCORE_KEY = 'dailyScores';

const CUT_OFF_HOUR = 18; // Beyond this hour of the day, no more blocker.

/**
 * Helper function that generates a date string YYYYMMDD as storage key.
 * @return {string} Date string in form of YYYYMMDD.
 */
function getCountsKey() {
  var today = new Date();
  var dd = today.getDate();
  var mm = today.getMonth() + 1; // 0 based months.
  var yyyy = today.getFullYear();

  // Standardize to two digits.
  if (dd<10) { dd='0'+dd; }
  if (mm<10) { mm='0'+mm; }

  return '' + yyyy + mm + dd; // Coerce to string with ''.
}

/**
 * Tallies total accesses of forbidden sites and returns a score.
 *
 * @param {Object} counts
 * @return {number} score
 */
function getProductivityScore(counts) {
  var score = 100,
      highPenaltyThreshold = 5,
      penaltyMultiplier = 3, // Each subsequent visit over the threshold has a penalty multiplier
      scoresObj = store.get(SCORE_KEY) || {},
      todayString = getCountsKey(),
      siteVisits, highPenaltyCount;

  for (var site in counts) {
    if (counts.hasOwnProperty(site)) {
      siteVisits = counts[site];
      console.log('siteVisits', siteVisits);

      // Add extra penalty of you cross the threshold.
      if (siteVisits <= highPenaltyThreshold) {
        score -= siteVisits;
      } else {
        highPenaltyCount = siteVisits - highPenaltyThreshold;
        score -= (highPenaltyThreshold + (highPenaltyCount * penaltyMultiplier));
      }

    }
  }
  scoresObj[todayString] = score;
  store.set(SCORE_KEY, scoresObj);
  return score;
}

chrome.tabs.onUpdated.addListener(function(tabId, status, changeInfo) {
  var counts, site,
      countsKey = getCountsKey(),
      currentDate = new Date();

  // console.log('tab changed!', status, changeInfo);

  if (disabled || currentDate.getHours() >= CUT_OFF_HOUR) { return; }

  for (site in urlPatterns) {
    if (urlPatterns.hasOwnProperty(site)) {
      if (changeInfo.url && changeInfo.url.search(urlPatterns[site]) > -1) {

        currentSite = site; // Set as module global.

        // Get access to total number of accesses and send it as query string
        // along with redirect URL and sitename.
        counts = store.get(countsKey) || {};
        chrome.tabs.update(tabId, {
          url: 'ext/components/interrupt/interrupt.html?redirect=' + encodeURIComponent(changeInfo.url) +
               '&site=' + site +
               '&count=' + (counts[site] || 0) +
               '&minutes=' + DISABLE_DURATION_MINUTES +
               '&score=' + getProductivityScore(counts)
        });
      }
    }
  }
});

chrome.runtime.onMessage.addListener(function(msg, sender, sendResponse) {
  var countsKey = getCountsKey();
  if (msg.allowEntry) {
    disabled = true;

    var counts = store.get(countsKey) || {};

    getProductivityScore(counts); // This updates stored score as you access site.

    if (counts[currentSite]) {
      counts[currentSite]++;
    } else {
      counts[currentSite] = 1; // init
    }

    store.set(countsKey, counts);

    setTimeout(function() {
      disabled = false;
    }, msg.allowFor || (DISABLE_DURATION_MINUTES * 60 * 1000));

    sendResponse({ 'success': true });
  }
});
