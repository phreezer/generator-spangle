'use strict';
/*jshint indent:4 */

/**
 * @ngdoc service
 * @name <%= scriptAppName %>.menuFactory
 * @description
 * # menuFactory
 * Factory in the <%= scriptAppName %>.
 */

(function (angular) {

	angular.module( '<%= scriptAppName %>' )

	.factory( 'menuFactory', function ( $http, $q, restFactory ) {

		var menuData = false;

		function init() {
			var deferred = $q.defer();


			// Live Site Setup
			restFactory.getList({
				paths: {
					list: 'Menu'
				},
				queryParams: {
					select: ['UID','Parent','Level','Active','Order','Label','URL'],
					filter: ['Active'],
					orderBy: ['Level asc','Order asc']
				}
			}).then(function(data) {
				deferred.resolve( processMenu(data.data.d.results) );
			});


			/*
			// Local Test Setup
			$http.get('json/menu.json').then(function(data){

				menu = processMenu(data.data.d.results);
				deferred.resolve( menu );
			});
			*/

			menuData = deferred.promise;
			return menuData;
		}

		function processMenu(data) {
			var menu = [];
			angular.forEach(data, function(value){
				if(value.Level === 0){
					menu.push(value);								// Create Root Level Menu Item
				} else {
					traverse(menu,value);							// Add Submenu, items must be in order for this to work in one pass
				}
			});
			return menu;
		}

		function traverse(data,menuItem) {
			for (var i in data) {
				if(menuItem.Parent && data[i].UID === menuItem.Parent){
					if(data[i].Submenu){
						data[i].Submenu.push(menuItem);
					} else {
						data[i].Submenu = [];
						data[i].Submenu.push(menuItem);
					}
					return true;
				} else {
					if (data[i].Submenu !== null && typeof(data[i].Submenu) === 'object') {
						if(traverse(data[i].Submenu, menuItem)){
							return true;
						}
					}
				}
			}
		}




		function get() {
			var deferred = $q.defer();
			if(!menuData){						// first load
				deferred.resolve( init() );
				return deferred.promise;
			} else {							// load cached results
				deferred.resolve( menuData );
				return deferred.promise;
			}
		}




		function set() {
			// Not needed
		}




		return {
			get: get,
			set: set
		};
	
	});

})(window.angular);
