'use strict';
/*jshint indent:4 */

/**
 * @ngdoc service
 * @name <%= scriptAppName %>.restFactory
 * @description
 * # restFactory
 * Factory in the <%= scriptAppName %>.
 */

(function (angular) {

	angular.module( '<%= scriptAppName %>' )

	.factory( 'restFactory', function ( $rootScope, $q, $http, APP_CONFIG ) {

		var defaults = {
			paths: {
				server: APP_CONFIG.SHAREPOINT_SERVER,
				api: APP_CONFIG.SHAREPOINT_API,
				list: APP_CONFIG.SHAREPOINT_LIST,
				url: false
			},
			itemId: false,
			data: false,
			queryParams: {
				select: false,
				orderBy: false,
				filter: false,				// Only works on Boolean types, for example it does not filter strings if they are emtpy or not
				expand: false,
				top: false,
				skip: false,
				inlinecount: 'allpages'
			}
		};


		// Shared Functions
		function getConfig(defaults, options) {
			options = options || {};
			defaults = defaults || {};
			return $.extend(true, {}, defaults, options);
		}

		function buildUrl(config) {
			var queryParams = [];
			if(config.queryParams.select) {
				queryParams.push( '$select=' + config.queryParams.select.toString() );
			}
			if(config.queryParams.orderBy) {
				queryParams.push( '$orderby=' + config.queryParams.orderBy.toString() );
			}
			if(config.queryParams.expand) {
				queryParams.push( '$expand=' + config.queryParams.expand.toString() );
			}
			if(config.queryParams.filter) {
				var filter = config.queryParams.filter.toString();
				filter = filter.replace(/,/g, ' and ');
				queryParams.push( '$filter=' + filter );
			}
			if(config.queryParams.top) {
				queryParams.push( '$top=' + config.queryParams.top.toString() );
			}
			if(config.queryParams.skip) {
				queryParams.push( '$skip=' + config.queryParams.skip.toString() );
			}
			if(config.queryParams.inlinecount) {
				queryParams.push( '$inlinecount=' + config.queryParams.inlinecount.toString() );
			}

			var query = '';
			if(queryParams[0]) {
				query = '?';
				angular.forEach(queryParams, function(param, index){
					if(queryParams[index+1]) {							// check for next param then add the & if necessary
						query = query + param + '&';
					} else {
						query = query + param;
					}
				});
			}

			// config.paths.url value overrides anything else that is set
			return config.paths.url || config.paths.server + config.paths.api + config.paths.list + query;

		}


		// Public Method
		function getList(options) {

			// @if DEBUG
			if(APP_CONFIG.DEPLOYMENT_TYPE !== 'dev') {
				// @endif

				var config = getConfig(defaults, options);
				config.url = buildUrl(config);

				var requestConfig = {
					method: 'GET',
					url: config.url,
					headers: {
						'Accept': 'application/json; odata=verbose'
					}
				};

				return $http(requestConfig)
					.then(getListComplete)
					.catch(getListFailed);

				// @if DEBUG
			} else {
				// Development
				return getListTest(options);
			}
			// @endif
		}

		function getListTest(options) {
			// Local Test setup, loads data from static json files
			var config = getConfig(defaults, options);

			if(config.paths.list === 'Pages') {
				return $http.get('json/pages.json').then(getListComplete);
			} else {
				return $http.get('json/menu.json').then(getListComplete);
			}

		}


		function getListComplete(data) {

			return data;
		}

		function getListFailed(data) {

			return data;
		}




		// Public Method
		function getListItem(options) {

			var config = getConfig(defaults, options);

			config.url = config.url || config.paths.server + config.paths.api + config.paths.list + config.paths.query + '(' + config.paths.itemId + ')';

			var requestConfig = {
				method: 'GET',
				url: config.url,
				headers: {
					'Accept': 'application/json;odata=verbose'
				}
			};

			$http(requestConfig)
				.then(getListItemComplete)
				.catch(getListItemFailed);
		}

		function getListItemComplete(data) {

			return data;
		}

		function getListItemFailed(data) {

			return data;
		}




		// Public Method
		function createListItem(options) {
			var deferred = $q.defer();
			var config = getConfig(defaults, options);
			config.queryParams.inlinecount = false;
			config.url = buildUrl(config);

			var requestConfig = {
				method: 'POST',
				url: config.url,
				data: JSON.stringify(config.data),
				headers: {
					'Accept': 'application/json;odata=verbose',
					'Content-Type': 'application/json;odata=verbose'
				}
			};

			//requestConfig.data = JSON.stringify(requestConfig.data);
			$http(requestConfig)
				.then(function(data) {
				deferred.resolve( { status: 'success', statusText: data.statusText } );
			})
				.catch(function(data) {
				deferred.resolve( { status: 'failed', statusText: data.statusText } );
			});

			return deferred.promise;
		}




		// Public Method
		function updateListItem(options) {
			// Reference http://blog.vgrem.com/2014/03/22/list-items-manipulation-via-rest-api-in-sharepoint-2010/
			// Must read the list item and get these before you can post the update: __metadata { uri, etag }
			// The IF-Match header should be the etag
			// Url must be the specific uri to the item like: _vti_bin/ListData.svc/Pages(4)

			var deferred = $q.defer();

			var config = getConfig(defaults, options);

			config.url = config.url || config.paths.server + config.paths.api + config.paths.list + config.paths.query + '(' + config.paths.itemId + ')';

			var requestConfig = {
				method: 'POST',
				url: config.url,
				headers: {
					'Accept': 'application/json;odata=verbose',
					'Content-Type': 'application/json;odata=verbose',
					'X-HTTP-Method': 'MERGE',
					'If-Match': config.etag
				},
				data: config.data
			};

			$http(requestConfig)
				.then(function(data) {
				deferred.resolve( { status: 'success', statusText: data.statusText } );
			})
				.catch(function(data) {
				deferred.resolve( { status: 'failed', statusText: data.statusText } );
			});

			return deferred.promise;
		}





		// Public Method
		function deleteListItem() {

		}




		// Public Method
		function uploadFile() {

		}



		return {
			getList: getList,
			getListItem: getListItem,
			createListItem: createListItem,
			updateListItem: updateListItem,
			deleteListItem: deleteListItem,
			uploadFile: uploadFile
		};
		
	});
	
})(window.angular);
