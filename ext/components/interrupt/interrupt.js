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
					'chrome-extension://igmjihpajekbbigheciochonooocbljb/img/jon-featured.png',
					'chrome-extension://igmjihpajekbbigheciochonooocbljb/img/jon-gabe-chat.png',
					'chrome-extension://igmjihpajekbbigheciochonooocbljb/img/jon-gsummit-round2.jpg',
					'chrome-extension://igmjihpajekbbigheciochonooocbljb/img/google-dayz.jpg',
					'chrome-extension://igmjihpajekbbigheciochonooocbljb/img/hustling-2012.jpg',
					'chrome-extension://igmjihpajekbbigheciochonooocbljb/img/featured-speaker.jpg',
					'chrome-extension://igmjihpajekbbigheciochonooocbljb/img/newyork-skyline.jpg',
					'chrome-extension://igmjihpajekbbigheciochonooocbljb/img/intersections.jpg',
				];

				var randomImage =  imgList[ Math.floor(Math.random() * imgList.length) ];

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
