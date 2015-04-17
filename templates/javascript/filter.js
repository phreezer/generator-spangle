'use strict';
/*jshint indent:4 */

/**
 * @ngdoc filter
 * @name <%= scriptAppName %>.filter:<%= cameledName %>
 * @function
 * @description
 * # <%= cameledName %>
 * Filter in the <%= scriptAppName %>.
 */

(function (angular) {

	angular.module('<%= scriptAppName %>')
		.filter('<%= cameledName %>', function () {
			return function (input) {
				return '<%= cameledName %> filter: ' + input;
			};
		});

})(window.angular);
