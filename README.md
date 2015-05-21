# webapi.js [![Build Status](https://travis-ci.org/jabiel/webapi.js.svg)](https://travis-ci.org/jabiel/webapi.js)

Angular module for working with web api

Used to learn Angular 

## Install
Load the script file

```javascript
<script type="text/javascript" src="webapi.js"></script>
```

## Configure
Add module to your dependencies
```html
angular.module('myApp', ['ui.keypress', 'ui.event', ...])
```

Configure webapi

```javascript
app.run(function (webapiConfig, toaster) {
	webapiConfig.baseUrl = 'http://myApiHost.com/api/';
	webapiConfig.onError = function (error) {
		console.log('webapi error: ', error);
	};
});
```

## How to use

Add dependency to your service or controller

```javascript
app.factory('myService', ['$scope', 'webapi', function ($scope, webapi) {
```

And use it

```javascript
webapi.get('controller/action', function(apidata){
	$scope.data = apidata;
});
```



## Unit tests
Working on it..


## License

Licensed under MIT.