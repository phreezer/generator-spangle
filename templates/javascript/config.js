'use strict';
/*jshint indent:4 */

/**
 * @ngdoc service
 * @name <%= scriptAppName %>.APP_CONFIG
 * @description
 * # APP_CONFIG
 * Constant in the <%= scriptAppName %>.
 */

(function (angular) {

	angular.module('<%= scriptAppName %>')

	.constant('APP_CONFIG',{

		BASE_DIRECTORY: '',								// Leave blank unless there is a special case to change

		SHAREPOINT_SERVER: 'https://isgs-spdf.external.lmco.com/sites/PROJECT NAME HERE/',
		SHAREPOINT_API: '_vti_bin/ListData.svc/',
		SHAREPOINT_LIST: false,
		SHAREPOINT_SHARED_DOCUMENTS: 'Shared Documents/',

		WHITEPAGES_SERVER: 'https://api-ewp.global.lmco.com/PersonService/',
		WHITEPAGES_API_KEY: ''							// Get a key here: https://ewp.global.lmco.com/#Help.aspx/Services
	});

})(window.angular);
