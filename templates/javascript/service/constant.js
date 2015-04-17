'use strict';
/*jshint indent:4 */

/**
 * @ngdoc service
 * @name <%= scriptAppName %>.<%= cameledName %>
 * @description
 * # <%= cameledName %>
 * Constant in the <%= scriptAppName %>.
 */

(function (angular) {

	angular.module('<%= scriptAppName %>')

	.constant('<%= cameledName %>', 42);

})(window.angular);
