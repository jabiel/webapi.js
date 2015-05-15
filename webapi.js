angular.module('webapi', [])

.value('webapiConfig', {
	baseUrl: 'http://google.com/',
	onError: function(error){ 
		console.log('webapi error:', error);
	}
})
.factory('webapi', ['$http', 'webapiConfig', function ($http, webapiConfig) {

    var apiurl = webapiConfig.baseUrl;
	
    var service = {};
    var cashe = {};
    var casheEnabled = false;
    
    service.setPath = function (contrlr) {
        service.resourcePath = contrlr;
    }

	service.debug = function () {
        console.log('webapi debug: ', webapiConfig);
    }

    var _handleError = function (error) {
        var msg = '';
        if (error.data && error.data.exceptionMessage) {
            msg = error.data.exceptionMessage;
        } else if (error.data && error.data.message) {
            msg = error.data.message;
        } else if (error.statusText) {
            msg = error.status + ' ' + error.statusText;
        } else {
			msg = error;
		}
		webapiConfig.onError(msg);
    };

    var _transformArgs = function ()
    {
        var uri = apiurl + service.resourcePath;
        var callbackFunc, model;
        for (var i = 0; i < arguments.length; i++) {
            // url
            if (typeof arguments[i] == 'string' || arguments[i] instanceof String) {
                if (arguments[i].indexOf("^") > -1) {
                    uri = arguments[i].replace("^", uri); // replace wildcard with resourcePath
                } else {
                    uri = apiurl + arguments[i];
                }
            }

            if (typeof (arguments[i]) == "function") { // callback
                callbackFunc = arguments[i];
            }

            if(arguments[i] !== null && typeof arguments[i] === 'object') { // model must be object
                model = arguments[i];
            }
        }

        return {
            uri: uri,
            callback: callbackFunc,
            model: model
        };
    }

    // Get with cashing
    service.getc = function () {
        var r = _transformArgs.apply(this, arguments);
        //console.log('get: ', r, Array.prototype.slice.call(arguments));

        if (cashe[r.uri]) {
            var d = { data: cashe[r.uri] };
            r.callback(d);
        } else {
            
            $http.get(r.uri).then(function (d) {
                cashe[r.uri] = d.data;
                r.callback(d);
            }, _handleError);
        }

    };

    service.get = function () {
        var r = _transformArgs.apply(this, arguments);
        $http.get(r.uri).then(function (d) {
            cashe[r.uri] = d.data;
            r.callback(d);
        }, _handleError);
    };

    service.post = function () {
        var r = _transformArgs.apply(this, arguments);
        //console.log('post: ', r, Array.prototype.slice.call(arguments));
        $http.post(r.uri, r.model).then(r.callback, _handleError);
    };

    service.put = function () {
        var r = _transformArgs.apply(this, arguments);
        $http.put(r.uri, r.model).then(r.callback, _handleError);
    };

    service.delete = function () {
        var r = _transformArgs.apply(this, arguments);
        $http.delete(r.uri).then(r.callback, _handleError);
    };
    
    return service;

}]);
