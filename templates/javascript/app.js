'use strict';
/*jshint indent:4 */

/**
 * @ngdoc overview
 * @name <%= scriptAppName %>
 * @description
 * # <%= scriptAppName %>
 *
 * Main module of the application.
 */

angular.module('<%= scriptAppName %>', [<%= angularModules %>])<% if (ngRoute) { %>
.config(function ($routeProvider) {
	$routeProvider
	.when('/', {
		template: '',
		controller: 'PageRouterCtrl'
	})
	.when('/:page', {
		template: '',
		controller: 'PageRouterCtrl'
	})
	.otherwise({
		redirectTo: '/'
	});
})<% } %>

.run(function($rootScope, $location, $route, $anchorScroll, $routeParams, $timeout) {

	var original = $location.path;

	$location.path = function (path, reload) {
		if (reload === false) {
			var lastRoute = $route.current;
			var un = $rootScope.$on('$locationChangeSuccess', function () {
				$route.current = lastRoute;
				un();
			});
		}

		return original.apply($location, [path]);
	};

	$rootScope.firstLoad = true;		// First time the site loads

	// Scroll to Anchor link
	$rootScope.$on('spa.page.transition.complete', function() {
		$location.hash($routeParams.scrollTo);
		$('#'+$location.hash()).addClass('anchor-highlight');			// highlight the anchor hashed area

		if( $location.hash() ) {
			$timeout(function() {
				$anchorScroll();
				$('html').scrollTop( $('html').scrollTop() - 80 );
			},400);
		}
	});
})

.controller('PageRouterCtrl', function ($routeParams, pageFactory) {
	// Dynamically load in the template HTML, this will load from a service that get the template from a sharepoint list
	if(!$routeParams.page) {
		pageFactory.goto('main');
	} else {
		pageFactory.goto($routeParams.page);
	}

});
