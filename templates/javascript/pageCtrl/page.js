'use strict';
/*jshint indent:4 */

/**
 * @ngdoc function
 * @name <%= scriptAppName %>.controller:PageCtrl
 * @description
 * # PageCtrl
 * Controller of the <%= scriptAppName %>
 */

(function ( angular ) {

	angular.module('<%= scriptAppName %>')

	.controller('PageCtrl', function ($rootScope, $scope, $routeParams, APP_CONFIG) {


		function init() {

		}


		function trackPageView() {
			// TODO: needs media, event, and product list tracking

			if($routeParams.page) {
				_paq.push(['setCustomUrl', APP_CONFIG.SHAREPOINT_SERVER + 'SitePages/index.html#/' + $routeParams.page]);
				_paq.push(['setDocumentTitle', $routeParams.page]);
				_paq.push(['trackPageView']);
			} else {
				_paq.push(['setCustomUrl', APP_CONFIG.SHAREPOINT_SERVER + 'SitePages/index.html#/']);
				_paq.push(['setDocumentTitle', 'home']);
				_paq.push(['trackPageView']);
			}
		}



		function pageLoad(e, pageId) {
			trackPageView();

			pageId ? $scope.currentPage = pageId : $scope.currentPage = false;								// Set Current Page for components to know what page loaded them
			$rootScope.$broadcast('spa.page.load.progress');												// Animations are not completed but components should be able to load

			pageTransition();
		}

		function pageTransition() {													// Page transition effects would go here
			$rootScope.$broadcast('spa.page.transition.start');

			var posTop;
			if($rootScope.firstLoad) {
				posTop = 0;
				$rootScope.firstLoad = false;
			} else {
				if( $('.app-network-bar') && $('.app-network-bar').offset() ) {
					posTop = $('.app-network-bar').offset().top;
				} else {
					posTop = 0;
				}
			}


			if( $('html').scrollTop() > 200 ) {
				$('html').animate({
					scrollTop: 100
				}, {
					duration: 0,
					done: function() {
						$('html').animate({
							scrollTop: posTop
						}, {
							duration: 800,
							done: function() {
								$rootScope.$broadcast('spa.page.transition.complete');
							}
						});
					}
				});
			} else {
				$('html').animate({
					scrollTop: posTop
				}, {
					duration: 800,
					done: function() {
						$rootScope.$broadcast('spa.page.transition.complete');
					}
				});
			}
		}

		$scope.$on('spa.page.load.start', pageLoad);
		$scope.$on('spa.page.transition.init', pageTransition);

		init();

	});

})( window.angular );
