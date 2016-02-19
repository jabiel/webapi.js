/*
 * webapi - easy access .net webapi
 * https://github.com/jabiel/webapi.js
 * (c) 2014-2015 MIT License, https://jabiel.pl
 */

(function (module) {

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

            return $q.reject(error);
        }

        function getData(response) {
            return response.data;
        }

        function buildUrl(url) {
            if (url.indexOf('http') == 0)
                return url;
            else
                return webapiConfig.baseUrl + url;
        }

        function buildConfig() {
            var c = {};
            var authData = (localStorage.getItem('authData') !== null) ? JSON.parse(localStorage.getItem('authData')) : null;

            if (authData && authData.access_token) {
                c.headers = c.headers || {};
                c.headers.Authorization = 'Bearer ' + authData.access_token;
            }
            return c;
        }



        function get(url) {

            return $http.get(buildUrl(url), buildConfig())
                .then(getData, handleError)
            //.catch(handleError);
        }

        function getc(url) {
            if (cache[url]) {
                var deferred = $q.defer();
                deferred.resolve(cache[url]);
                return deferred.promise;
            } else {
                return get(url).then(function (data) {
                    cache[url] = data;
                    return data;
                });
            }
        }

        function post(url, model) {
            return $http.post(buildUrl(url), model, buildConfig())
                .then(getData, handleError);
        }

        function put(url, model) {
            return $http.put(buildUrl(url), model, buildConfig())
                .then(getData, handleError);
        }

        function _delete(url) {
            return $http.delete(buildUrl(url), buildConfig())
                .then(getData, handleError);
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

        function logout() {
            localStorage.removeItem('authData');
        }

        // cors needs to be configured to allow content-dsiposition heder in Expose-Headers
        function downloadPost(url, model) {
            return $http({
                method: 'POST',
                cache: false,
                url: buildUrl(url),
                data: model,
                //responseType: 'arraybuffer'
            }).then(onDownloadSuccess, handleError);
        }


        ////  FILE DOWNLOAD 
        // USE THIS TO IVOKE API:
        // return $http({
        //  method: 'POST',
        //  cache: false,
        //   url: urlBase + 'api/invoice/' + invoiceId + '/print',
        //  responseType: 'arraybuffer',
        //  }).success(downloadServices.onDownloadSuccess);
        function onDownloadSuccess(response) { // data, status, headers

            var octetStreamMime = 'application/octet-stream';
            var success = false;
            var data = response.data;
            var headers = response.headers();
            
            var s = headers['content-disposition'];

            var filename = s.substring(s.indexOf("filename=") + 9, 99);
            // Determine the content type from the header or default to "application/octet-stream"
            var contentType = headers['content-type'] || octetStreamMime;
            var blob;
            try {
                // Try using msSaveBlob if supported
                blob = new Blob([data], { type: contentType });
                if (navigator.msSaveBlob)
                    navigator.msSaveBlob(blob, filename);
                else {
                    // Try using other saveBlob implementations, if available
                    var saveBlob = navigator.webkitSaveBlob || navigator.mozSaveBlob || navigator.saveBlob;
                    if (saveBlob === undefined) throw "Not supported";
                    saveBlob(blob, filename);
                }
                success = true;
            } catch (ex) {
                // $log.debug("saveBlob method failed with the following exception:");
                // $log.debug(ex);
            }

            if (!success) {
                // Get the blob url creator
                var urlCreator = window.URL || window.webkitURL || window.mozURL || window.msURL;
                if (urlCreator) {
                    // Try to use a download link
                    var link = document.createElement('a');
                    var url;
                    if ('download' in link) {
                        // Try to simulate a click
                        try {
                            // Prepare a blob URL
                            // $log.debug("Trying download link method with simulated click ...");
                            blob = new Blob([data], { type: contentType });
                            url = urlCreator.createObjectURL(blob);
                            link.setAttribute('href', url);

                            // Set the download attribute (Supported in Chrome 14+ / Firefox 20+)
                            link.setAttribute("download", filename);

                            // Simulate clicking the download link
                            var event = document.createEvent('MouseEvents');
                            event.initMouseEvent('click', true, true, window, 1, 0, 0, 0, 0, false, false, false, false, 0, null);
                            link.dispatchEvent(event);
                            // $log.debug("Download link method with simulated click succeeded");
                            success = true;

                        } catch (ex) {
                            // $log.debug("Download link method with simulated click failed with the following exception:");
                            // $log.debug(ex);
                        }
                    };

                    if (!success) {
                        // Fallback to window.location method
                        try {
                            // Prepare a blob URL
                            // Use application/octet-stream when using window.location to force download
                            // $log.debug("Trying download link method with window.location ...");
                            blob = new Blob([data], { type: octetStreamMime });
                            url = urlCreator.createObjectURL(blob);
                            window.location = url;
                            // $log.debug("Download link method with window.location succeeded");
                            success = true;
                        } catch (ex) {
                            // $log.debug("Download link method with window.location failed with the following exception:");
                            // $log.debug(ex);
                        }
                    }
                }
            }

            if (!success) {
                window.open(httpPath, '_blank', '');
            }
        }



        return {
            get: get,
            post: post,
            put: put,
            delete: _delete,

            // cache support
            getc: getc,
            clearc: clearc,

            download: downloadPost,
            // asp.net identity login
            login: login
        };
    };

    module.factory("webapi", webapi);
    webapi.$inject = ['$http', '$q', 'webapiConfig'];
    module.value('webapiConfig', {
        baseUrl: '',
        onError: function (error) {
            console.error('webapi error:', error);
        }
    });


}(angular.module("webapi", [])));

