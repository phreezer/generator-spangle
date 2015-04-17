'use strict';
/*jshint indent:4 */

/**
 * @ngdoc directive
 * @name <%= scriptAppName %>.directive:<%= cameledName %>
 * @description
 * # <%= cameledName %>
 */

(function (angular) {

	angular.module('<%= scriptAppName %>')
		.directive('<%= cameledName %>', function () {
			return {
				templateUrl: 'views/components/<%= name %>/<%= name %>.html',
				restrict: 'C',
				link: function (scope, elem, attrs) {

					function init() {

					}



					init();
				}
			};
		});

})(window.angular);
