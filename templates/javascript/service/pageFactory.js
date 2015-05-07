'use strict';
/*jshint indent:4 */

/**
 * @ngdoc service
 * @name <%= scriptAppName %>.pageFactory
 * @description
 * # pageFactory
 * Factory in the <%= scriptAppName %>.
 */

(function (angular) {

	angular.module( '<%= scriptAppName %>' )

	.factory( 'pageFactory', function ( $rootScope, $location, $route, $routeParams, $compile, $http, $q, restFactory, APP_CONFIG ) {

		var pages = false;


		function init() {
			var deferred = $q.defer();


			// Live Site Setup
			restFactory.getList( {
				paths: {
					list: 'Pages'
				},
				queryParams: {
					select: [ 'UID', 'Title', 'Published', 'Active' ],
					filter: [ 'Active' ]
				}
			} ).then( function ( data ) {
				deferred.resolve( data.data.d.results );
			} );


			pages = deferred.promise;
			return pages;
		}




		function get() {
			var deferred = $q.defer();
			if ( !pages ) { // first load
				deferred.resolve( init() );
				return deferred.promise;
			} else { // load cached results
				deferred.resolve( pages );
				return deferred.promise;
			}
		}



		function goto( pageId ) {
			pageId = pageId || $routeParams.page;


			if ( $( '.page:eq(1)' )[ 0 ] ) {
				$( '.page:eq(1)' ).addClass( 'page-next' ); // .page-next tracks which container to place the new page content
			} else {
				$( '.page:eq(0)' ).addClass( 'page-next' ); // First page Load
			}


			// @if PROD
				get().then( function ( data ) {
					var pageFound = false;

					angular.forEach( data, function ( page ) {

						if ( page.UID === pageId ) {
							$( '.page-next' ).html( $compile( page.Published )( $rootScope ) );
							$rootScope.$broadcast( 'spa.page.load.start', pageId );
							pageFound = true;
							$( '.page-next' ).removeClass( 'page-next' );
						}
					} );
					if ( !pageFound ) {
						$location.path( '/' ); // Default Page
					}
				} );
			// @endif

			// @if DEBUG
				if ( $routeParams.page ) {
					$route.current.templateUrl = '/views/pages/' + $routeParams.page + '/' + $routeParams.page + '.html';
				} else {
					$route.current.templateUrl = '/views/pages/main/main.html';
				}
				$http.get( $route.current.templateUrl ).then( function ( msg ) {
					$( '.page-next' ).html( $compile( msg.data )( $rootScope ) );
					$rootScope.$broadcast( 'spa.page.load.start', $routeParams.page );
					$( '.page-next' ).removeClass( 'page-next' );
				} );
			// @endif
		}




		return {
			get: get,
			goto: goto
		};
	} );

})(window.angular);
