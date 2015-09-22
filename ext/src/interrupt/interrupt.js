angular.module('inspiretab.interrupt', [])
	.config(function($locationProvider) {
		$locationProvider.html5Mode(true).hashPrefix('!');
	})
	.directive('itInterruptDialogue', function($location, $window) {
		console.log('running!');
		return {
			restrict: 'EA',
			transclude: true,
			link: function(scope, elem, attrs, ctrl, transclude) {
				var queryData = $location.search();

				scope.numberOfTimes = queryData.count;
				scope.currentSite = queryData.site;

				scope.inspireImage = 'http://www.livingforimprovement.com/wp-content/uploads/2012/06/gsummit-action-shot.jpg';

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
