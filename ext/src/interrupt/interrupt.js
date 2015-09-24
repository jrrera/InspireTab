angular.module('inspiretab.interrupt', [])
	.config(function($locationProvider, $compileProvider) {
		// Support for query string given by bg script.
		$locationProvider.html5Mode(true).hashPrefix('!');

		// Support chrome extensions in ng-src and ng-href for angular.
		$compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|ftp|mailto|chrome-extension):/);
		$compileProvider.imgSrcSanitizationWhitelist(/^\s*(https?|local|data|chrome-extension):/);
	})
	.directive('itInterruptDialogue', function($location, $window) {
		return {
			restrict: 'EA',
			transclude: true,
			link: function(scope, elem, attrs, ctrl, transclude) {
				var queryData = $location.search();

				var imgList = [
					'http://www.livingforimprovement.com/wp-content/uploads/2012/06/gsummit-action-shot.jpg',
					'chrome-extension://igmjihpajekbbigheciochonooocbljb/img/jon-featured.png',
					'chrome-extension://igmjihpajekbbigheciochonooocbljb/img/jon-gabe-chat.png'
				];

				var randomImage =  imgList[ Math.floor(Math.random() * imgList.length) ];

				scope.numberOfTimes = queryData.count;
				scope.currentSite = queryData.site;
				scope.inspireImage = randomImage;
				scope.minutesAllowed = queryData.minutes;

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
