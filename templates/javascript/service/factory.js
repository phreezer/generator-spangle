'use strict';
/*jshint indent:4 */

/**
 * @ngdoc service
 * @name <%= scriptAppName %>.<%= cameledName %>
 * @description
 * # <%= cameledName %>
 * Factory in the <%= scriptAppName %>.
 */

(function (angular) {

	angular.module('<%= scriptAppName %>')

	.factory('<%= cameledName %>', function ($http, $q, restFactory, APP_CONFIG) {

		var <%= cameledName %> = {};
		<%= cameledName %>.data = false; 					// Processed data used by application
		<%= cameledName %>.initialData = false; 			// Untouched data loaded from file/server


		<%= cameledName %>.get = function () {
			var deferred = $q.defer();

			// @if PROD
				restFactory.getList({
					paths: {
						list: 'LIST NAME HERE'
					},
					queryParams: {
						select: ['Title', 'Order'],
						filter: ['Active'],
						orderBy: ['Order asc']
					}
				}).then(function (data) {
					deferred.resolve(processInitialData(data.data.d.results));
				});
			// @endif

			// @if DEBUG
				$http.get('json/<%= cameledName %>.json').then(function (data) {
					<%= cameledName %>.initialData = data.data.d.results;
					deferred.resolve(processInitialData(data.data.d.results));
				});
			// @endif


			<%= cameledName %>.data = deferred.promise;

			return <%= cameledName %>.data;
		};




		function processInitialData(data) {
			var arr = [];
			var obj = {};
			angular.forEach(data, function (award) {
				obj = {};
				obj.title = award.Title;
				obj.order = award.Order;
				arr.push(obj);
			});

			arr.sort(function (a, b) {
				return a.order - b.order;
			});

			return arr;
		}



		return <%= cameledName %>;

	});

})(window.angular);
