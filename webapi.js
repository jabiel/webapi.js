(function(module) {

    var webapi = function ($http, $q, webapiConfig) {
        
		var cache = {};
		
		function handleError(error) {
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
		}
		
        function getData(response) {            
            return response.data;
        }  
		
        function get(url) {
            return $http.get(webapiConfig.baseUrl + url)
                .then(getData)
                .catch(handleError);
        }
		
		function getc(url) {
            if (cache[url]) {
				var deferred = $q.defer();
				deferred.resolve(cache[url]);
				return deferred.promise;
			} else {
				return get(url).then(function(data){
					cache[url] = data;
					return data;
				});
			}
        }
		
        function post(url, model) {
            return $http.post(webapiConfig.baseUrl + url, model)
                .then(getData)
                .catch(handleError);
        }

		function put(url, model) {
            return $http.put(webapiConfig.baseUrl + url, model)
                .then(getData)
                .catch(handleError);
        }
		
		function _delete(url) {
            return $http.delete(webapiConfig.baseUrl + url)
                .then(getData)
                .catch(handleError);
        }
      
		function clearc() {
            cache = {};
        }
		
		return {
            get: get,
            post: post,
			put: put,
			delete: _delete,
			
			getc: getc,
			clearc: clearc
        };
    };

    module.factory("webapi", webapi);
    webapi.$inject = ['$http', '$q','webapiConfig'];
	module.value('webapiConfig', {
		baseUrl: '',
		onError: function (error) {
			console.error('webapi error:', error);
		}
	});
	
	
}(angular.module("webapi", [])))
