var angular = require('angular');

angular.module('inspiretab.interrupt', [])
	.config(function($locationProvider, $compileProvider) {
		// Support for query string given by bg script.
		$locationProvider.html5Mode(true).hashPrefix('!');

		// Support chrome extensions in ng-src and ng-href for angular.
		$compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|ftp|mailto|chrome-extension):/);
		$compileProvider.imgSrcSanitizationWhitelist(/^\s*(https?|local|data|chrome-extension):/);
	})
	.directive('itInterruptDialogue', function($location, $window, $http) {
		return {
			restrict: 'EA',
			transclude: true,
			link: function(scope, elem, attrs, ctrl, transclude) {
				var queryData = $location.search();

				var imgList = [
					'http://www.livingforimprovement.com/wp-content/uploads/2012/06/gsummit-action-shot.jpg',
					'chrome-extension://mgpbncibdliefhheocckldgnjbemhbbm/ext/img/jon-featured.png',
					'chrome-extension://mgpbncibdliefhheocckldgnjbemhbbm/ext/img/jon-gabe-chat.png',
					'chrome-extension://mgpbncibdliefhheocckldgnjbemhbbm/ext/img/jon-gsummit-round2.jpg',
					'chrome-extension://mgpbncibdliefhheocckldgnjbemhbbm/ext/img/google-dayz.jpg',
					'chrome-extension://mgpbncibdliefhheocckldgnjbemhbbm/ext/img/hustling-2012.jpg',
					'chrome-extension://mgpbncibdliefhheocckldgnjbemhbbm/ext/img/featured-speaker.jpg',
					'chrome-extension://mgpbncibdliefhheocckldgnjbemhbbm/ext/img/newyork-skyline.jpg',
					'chrome-extension://mgpbncibdliefhheocckldgnjbemhbbm/ext/img/intersections.jpg',
					'chrome-extension://mgpbncibdliefhheocckldgnjbemhbbm/ext/img/coffeeshop-bg.jpg',
					'chrome-extension://mgpbncibdliefhheocckldgnjbemhbbm/ext/img/coffee-shop-paris-cozy-interior-cafe-lomi.jpg',
				];

				var randomImage =  imgList[ Math.floor(Math.random() * imgList.length) ];

				// NB: For some reason, adding the fade-in class without pushing this
				// farther up the stack with a setTimeout prevents the animation from
				// happening. May have to do with postLink timing.
				setTimeout(function(){
					angular.element(document.getElementById('background-overlay'))
							.css('background-image', 'url(' + randomImage + ')')
							.addClass('fade-in');
				}, 0);

				// View props
				scope.numberOfTimes = queryData.count;
				scope.currentSite = queryData.site;
				scope.inspireImage = randomImage;
				scope.minutesAllowed = queryData.minutes;
				scope.productivityScore = queryData.score;

				// Manual transclusion, as its more readable to keep DOM out of a
				// separate template.
				transclude(scope, function(clone, scope) {
					elem.append(clone);
				});


				scope.continue = function() {
					chrome.runtime.sendMessage({ allowEntry: true }, function() {
						$window.location.href = queryData.redirect;
					});
				};

			}
		};
  });
