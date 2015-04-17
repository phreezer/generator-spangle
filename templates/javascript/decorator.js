'use strict';
/*jshint indent:4 */

/**
 * @ngdoc function
 * @name <%= scriptAppName %>.decorator:<%= classedName %>
 * @description
 * # <%= classedName %>
 * Decorator of the <%= scriptAppName %>
 */

(function (angular) {

	angular.module('<%= scriptAppName %>')
		.config(function ($provide) {
			$provide.decorator('<%= cameledName %>', function ($delegate) {
				// decorate the $delegate
				return $delegate;
			});
		});

})(window.angular);
