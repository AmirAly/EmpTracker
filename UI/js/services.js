empTracker.factory('API', ['$http', '$window', function ($http, $window) {
    var _url = "http://rostersmanager.com:90";
    var headers = {};
    return {
        name: 'API',
        execute: function (_req, _isAuth) {
            // _isAuth means need token
            if (_isAuth) {
                headers = { 'Content-Type': 'application/json', 'Authorization': $window.localStorage['authorizationToken'] };
            }
            else { // don't need token 'login,register'
                headers = { 'Content-Type': 'application/x-www-form-urlencoded' };
                _req.transformRequest = function (obj) {
                    var str = [];
                    for (var p in obj)
                        str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
                    return str.join("&");
                };
            }
            _req.url = _url + _req.url;
            _req.headers = headers;

            //console.log($http(_req));
            return $http(_req);
            
        },
        refreshtoken: function (_req, _isAuth) {
            // _isAuth means need token
            if (_isAuth) {
                headers = { 'Content-Type': 'application/json', 'Authorization': $window.localStorage['authorizationToken'] };
            }
            else { // don't need token 'login,register'
                headers = { 'Content-Type': 'application/x-www-form-urlencoded' };
                _req.transformRequest = function (obj) {
                    var str = [];
                    for (var p in obj)
                        str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
                    return str.join("&");
                };
            }
            _req.url = _url + _req.url;
            _req.headers = headers;

            //console.log($http(_req));
            return $http(_req);

        }

    };
}]);

empTracker.factory('InternetConnection', function ($http, $rootScope) {
    return {
        checkConnection: function () {
            $http({
                type: "HEAD",
                method: "GET",
                url: "http://rostersmanager.com:90"
            }).then(function (response) {
                $rootScope.internetStatus = 'connected';
            }, function (response) {
                $rootScope.internetStatus = 'disconnected';
            });
            
            }
    };
});

empTracker.factory('CurrentLocation', function ($rootScope, $cordovaGeolocation) {
    var options = { timeout: 10000, enableHighAccuracy: true };
    return {
        getLatLng: function () {
            $cordovaGeolocation.getCurrentPosition(options).then(function (position) {
                $rootScope.currentUserLatitude = position.coords.latitude;
                $rootScope.currentUserLongitude = position.coords.longitude;
                console.log($rootScope.currentUserLatitude);
                console.log($rootScope.currentUserLongitude);
            }), function (error) {
                console.log("Could not get location , You have to enable location on your device");
            };
        }
    };
});

empTracker.factory('CallPerodicalUpdate', function ($rootScope) {
    return {
        sendUpdate: function () {
            $scope.today = new Date();
            $scope.currentTime = $scope.today.getFullYear() + '-' + ($scope.today.getMonth() + 1) + '-' + $scope.today.getDate() + ' ' + $scope.today.getHours() + ':' + $scope.today.getMinutes() + ':' + $scope.today.getSeconds();
            console.log($scope.currentTime);
            var req = {
                method: 'POST',
                url: '/api/Attendance/Log/PeriodicalUpdate',
                data: {
                    SiteID: "AUSPO",
                    TaskCode: "Patrol",
                    Notes: "some notes",
                    Clocking: {
                        ClockingTime: $scope.currentTime,
                        Latitude: '',
                        Longitude: '',
                        GPSTrackingMethod: 'Network',
                        PunchedVia: 'MOB',
                        EmployeeNotes: 'emp notes',
                        BatteryLevel: '',
                        Vibration: ''
                    }
                }
            }
            // add true to use authentication token
            API.execute(req, true).then(function (_res) {
                console.log(_res);
                if (_res.data.code == 200) {
                    console.log('update sent');
                }
                else {
                    console.log('unexpected error');
                }

            }, function (error) {
                console.log(error);
                console.log(error.data); /* catch 400  Error here */
                $window.localStorage['IsTempLogin'] = false;
                localStorage.clear();
                $state.go('login');
            });
        }
    };
});