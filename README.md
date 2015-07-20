# webapi.js [![Build Status](https://travis-ci.org/jabiel/webapi.js.svg)](https://travis-ci.org/jabiel/webapi.js)

Angular module for working with asp.net web api 

Supports bearer token passing without http interceptor

I use it to  learn Angular 

## Install
Load the script file

```javascript
<script type="text/javascript" src="webapi.js"></script>
```

## Configure
Add module to your dependencies
```html
angular.module('myApp', [..., 'webapi', ...])
```

Configure webapi

```javascript
angular.module('myApp').run(function (webapiConfig) {
	webapiConfig.baseUrl = 'http://myWebapiHost.com/api/';
	webapiConfig.onError = function (error) {
		console.log('webapi error: ', error);
	};
});
```

## How to use

Add dependency to your service or controller

```javascript
app.factory('myService', ['webapi', function (webapi) {
```

And use it

```javascript
webapi.get('controller/action').then(function(data){
	doSomethingWith(data);
});
```

Login to get bearer token

```javascript
webapi.login('userName', 'password').then(function(data){
	// from now all webapi calls will pass token 
	// token is saved in localStorage
});
```


## Unit tests
Working on it..


## License

Licensed under MIT.
