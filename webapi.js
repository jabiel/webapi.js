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
		
		function buildUrl(url) {
			if(url.indexOf('http')==0)
				return url;
			else 
				return webapiConfig.baseUrl + url;
        } 
		
		function buildConfig() {
			var c = {};
			var authData =(localStorage.getItem('authData')!==null) ? JSON.parse(localStorage.getItem('authData')) : null;
			
			if(authData && authData.access_token)
			{
				c.headers = c.headers || {};
				c.headers.Authorization = 'Bearer ' + authData.access_token;
			}
			return c;
        } 
		
		
		
        function get(url) {
		
            return $http.get(buildUrl(url), buildConfig())
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
            return $http.post(buildUrl(url), model, buildConfig())
                .then(getData)
                .catch(handleError);
        }

		function put(url, model) {
            return $http.put(buildUrl(url), model, buildConfig())
                .then(getData)
                .catch(handleError);
        }
		
		function _delete(url) {
            return $http.delete(buildUrl(url), buildConfig())
                .then(getData)
                .catch(handleError);
        }
      
		function clearc() {
            cache = {};
        }
		
		function login(userName, password) {
			
			var data = "grant_type=password&username=" + userName + "&password=" + password;
			
			return $http.post(buildUrl('token'), data, { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } })
				.then(function (response) {                
					localStorage.setItem('authData', JSON.stringify(response.data));
					return response.data;
				}).catch(handleError);
        }
		
		function logout()
		{
			localStorage.removeItem('authData');
		}
		
		
		return {
            get: get,
            post: post,
			put: put,
			delete: _delete,
			
			// cache support
			getc: getc,
			clearc: clearc,
			
			// asp.net identity login
			login: login
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
