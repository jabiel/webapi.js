var app = angular.module('myApp', ['webapi']);

app.run(function (webapiConfig) {
  webapiConfig.baseUrl = 'http://localhost:38343/';//'http://jsonplaceholder.typicode.com/';
  webapiConfig.onError = function(error){
	console.log('webapi error: ', error);
  }
});

app.controller('myCtrl', ['$scope', 'webapi', function($scope, webapi) {

	$scope.greeting = 'Hello';
	$scope.query = '1';
	$scope.result = '';
	
	function printJson(json)
	{
		$scope.result = JSON.stringify(json,null,"    ");
	}
	
	$scope.search = function(qry)
	{
		webapi.get('posts?userId='+qry).then(printJson);
	}
	
	$scope.searchc = function(qry)
	{
		webapi.getc('posts?userId='+qry).then(printJson);
	}
	
	$scope.headers = function(qry)
	{
		webapi.get('http://headers.jsontest.com/').then(printJson);
	}
	
	$scope.login = function(qry)
	{
		webapi.login('xxx@xxx.com', 'xxxxxx').then(function(d){
			webapi.get('api/apiconfig/get/methods').then(printJson);
		});
	}
	
}]);
