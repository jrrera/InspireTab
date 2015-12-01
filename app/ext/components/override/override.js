angular.module('inspiretab', [])
	.directive('itQuotes',function() {
		return {
			restrict: 'EA',
			template: '<p> {{ currentQuote.text }} </p><br /> -- {{currentQuote.author}}',
			link: function(scope, elem, attrs) {
			  console.log('running.');
				var quotes = [
					{ author: 'That Guy You Like', text: 'To be great, sometimes you need to be great.'},
					{ author: 'Jon', text: 'Quote 2'},
					{ author: 'Jon', text: 'Quote 3'},
				];

				scope.currentQuote = quotes[0];
			}
		};
  })
	.directive('itMomentum', function($q) {
		return {
			restrict: 'EA',
			template: '<p> Today\'s Momentum: {{ currentMomentum }} </p><br /><a href="#">Breakdown</a>',
			link: function(scope, elem, attrs) {
        // Mock out a promise until hooking into Chrome API.
			  $q.when({score: 25}).then(function(data) {
          scope.currentMomentum = data.score;
        });
			}
		};
  });
