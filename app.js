var app = angular.module('myApp', ['webapi']);

app.run(function (webapiConfig) {
  webapiConfig.baseUrl = 'https://www.google.pl/?';
  webapiConfig.onError = function(error){
	console.log('webapi error: ', error);
  }
});

app.controller('myCtrl', ['$scope', 'webapi', function($scope, webapi) {

	$scope.greeting = 'Hello';
	$scope.result = '';
	
	$scope.search = function(qry)
	{
		webapi.get('q='+qry, function(d){
			$scope.result = d;
		});
	}
	
}]);
