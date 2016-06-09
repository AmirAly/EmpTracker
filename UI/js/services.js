empTracker.factory('API', ['$http', '$window', function ($http, $window) {
    //var _url = "http://localhost:8080";
    var _url = "http://rostersmanager.com:90";
    var headers = { 'Authorization': $window.localStorage['authenticationToken'] };
    return {
        name: 'API',
        execute: function (_req, _isAuth) {
            _req.url = _url + _req.url;
            _req.headers = headers;
            return $http(_req);
        }
    };
}]);
