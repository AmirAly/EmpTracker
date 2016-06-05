empTracker.factory('API', ['$http', '$window', function ($http, $window) {
    var _url = "http://localhost:8080";
    var headers = { 'authentication': $window.localStorage['authenticationToken'] };
    return {
        name: 'API',
        execute: function (_req, _isAuth) {
            _req.url = _url + _req.url;
            _req.headers = headers;
            return $http(_req);
        }
    };
}]);
