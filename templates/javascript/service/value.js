'use strict';
/*jshint indent:4 */

/**
 * @ngdoc service
 * @name <%= scriptAppName %>.<%= cameledName %>
 * @description
 * # <%= cameledName %>
 * Value in the <%= scriptAppName %>.
 */

(function (angular) {
	angular.module('<%= scriptAppName %>')
	.value('<%= cameledName %>', 42);
})(window.angular);
