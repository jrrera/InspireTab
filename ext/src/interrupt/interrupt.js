console.log('script');
angular.module('inspiretab.interrupt', [])
	.config(function($locationProvider) {
		$locationProvider.html5Mode(true).hashPrefix('!');
	})
	.directive('itInterruptDialogue', function($location) {
		console.log('running!');
		return {
			restrict: 'EA',
			transclude: true,
			link: function(scope, elem, attrs, ctrl, transclude) {
				scope.number = 12;
				console.log($location.search());
				transclude(scope, function(clone, scope) {
					elem.append(clone);
				});

			scope.continue = function() {
				window.location.href = $location.search().redirect;
				// chrome.tabs.create({url: 'chrome://net-internals/'});
			};
			}
		};
  });
