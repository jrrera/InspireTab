angular.module('inspiretab', [])
	.directive('itQuotes',function() {
		return {
			restrict: 'EA',
			template: `
				<div id="inspire-message" class="text-left">
					<p>{{ currentQuote.text }} </p>
					<br /> <p>~ {{currentQuote.author}}</p>
				</div>
			`,
			link: function(scope, elem, attrs) {
			  console.log('running.');
				var quotes = [
					{ author: 'Dan Harris, 10% Happier', text: 'Practicing meditation and mindfulness will make you at least 10 percent happier. Being mindful doesn’t change the problems in your life, but mindfulness does help you respond to your problems rather than react to them. Mindfulness helps you realize that striving for success is fine as long as you accept that the outcome is outside your control.'},
					{ author: 'Grant Cardone, The 10X Rule', text: 'The 10X Rule says that 1) you should set targets for yourself that are 10X greater than what you believe you can achieve and 2) you should take actions that are 10X greater than what you believe are necessary to achieve your goals. The biggest mistake most people make in life is not setting goals high enough. Taking massive action is the only way to fulfill your true potential.'},
					{ author: 'Anna Quindlen, A Short Guide to a Happy Life', text: 'The only thing you have that nobody else has is control of your life. The hardest thing of all is to learn to love the journey, not the destination. Get a real life rather than frantically chasing the next level of success.'},
					{ author: 'James Webb Young, A Technique for Producing Ideas', text: 'An idea occurs when you develop a new combination of old elements. The capacity to bring old elements into new combinations depends largely on your ability to see relationships. All ideas follow a five-step process of 1) gathering material, 2) intensely working over the material in your mind, 3) stepping away from the problem, 4) allowing the idea to come back to you naturally, and 5) testing your idea in the real world and adjusting it based on feedback.'},
					{ author: 'Tim Harford, Adapt', text: 'Seek out new ideas and try new things. When trying something new, do it on a scale where failure is survivable. Seek out feedback and learn from your mistakes as you go along.'},
					{ author: 'Derek Sivers, Anything You Want', text: 'Too many people spend their life pursuing things that don’t actually make them happy. When you make a business, you get to make a little universe where you create all the laws. Never forget that absolutely everything you do is for your customers.'},
					{ author: 'Tom Rath, Are You Fully Charged?', text: 'There are three keys to being fully charged each day: doing work that provides meaning to your life, having positive social interactions with others, and taking care of yourself so you have the energy you need to do the first two things. Trying to maximize your own happiness can actually make you feel self-absorbed and lonely, but giving more can drive meaning and happiness in your life. People who spend money on experiences are happier than those who spend on material things.'},
				];

				scope.currentQuote = quotes[ Math.floor(Math.random() * quotes.length) ];

				const FADE_OUT_TIMER = 8500;
				const IMAGE_SWITCH_TIMER = 10000;
				const SECONDS_TO_WAIT_PER_ACCESS = 5;

				var imgList = [
					// 'http://www.livingforimprovement.com/wp-content/uploads/2012/06/gsummit-action-shot.jpg',
					'http://static.panoramio.com/photos/original/8932506.jpg',
					'http://orig10.deviantart.net/60e4/f/2010/248/6/b/most_awesome_nature_shot_by_salomewilde-d2y41l3.png',
					'http://www.wallcoo.net/1680x1050/1680x1050_wallpaper_02_nature/images/%5Bwallcoo.com%5D_1680x1050_nature_widescreen_wallpaper__200708042612-1789.jpg'
				];

				var refreshImage = function() {
					var randomImage = imgList[ Math.floor(Math.random() * imgList.length) ];

					// NB: For some reason, adding the fade-in class without pushing this
					// farther up the stack with a setTimeout prevents the animation from
					// happening. May have to do with postLink timing.
					setTimeout(function(){
						angular.element(document.getElementById('background-overlay'))
								.css('background-image', 'url(' + randomImage + ')')
								.addClass('fade-in');
					}, 0);

					setTimeout(function() {
						angular.element(document.getElementById('background-overlay'))
								.removeClass('fade-in');
					}, FADE_OUT_TIMER);
				};

				// Set background image and set up an interval.
				refreshImage();
				setInterval(function() { refreshImage(); }, IMAGE_SWITCH_TIMER);
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
