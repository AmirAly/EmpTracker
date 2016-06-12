empTracker.factory('API', ['$http', '$window', function ($http, $window) {
    //var _url = "http://localhost:8080";
    var _url = "http://rostersmanager.com:90";
    var headers = {'Content-Type': 'application/x-www-form-urlencoded' };
    return {
        name: 'API',
        execute: function (_req, _isAuth) {
            if (_isAuth) {
                headers.Authorization = $window.localStorage['authorizationToken'];
            }
            _req.url = _url + _req.url;
            _req.headers = headers;
            _req.transformRequest = function (obj) {
                var str = [];
                for (var p in obj)
                    str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
                return str.join("&");
            };
            return $http(_req);
        }
    };
}]);
