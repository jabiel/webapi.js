var app = angular.module('myApp', ['webapi']);

app.run(function (webapiConfig) {
  webapiConfig.baseUrl = 'http://jsonplaceholder.typicode.com/';
  webapiConfig.onError = function(error){
	console.log('webapi error: ', error);
  }
});

app.controller('myCtrl', ['$scope', 'webapi', function($scope, webapi) {

	$scope.greeting = 'Hello';
	$scope.query = '1';
	$scope.result = '';
	
	$scope.search = function(qry)
	{
		webapi.get('posts?userId='+qry, function(d){
			$scope.result = d.data;
		});
	}
	
}]);
