empTracker.factory('API', ['$http', '$window', '$ionicLoading', '$timeout', '$state', '$rootScope', function ($http, $window, $ionicLoading, $timeout, $state, $rootScope) {
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

        },
        showTokenError: function (error) {
            if (error.status == 401 && error.statusText == "Unauthorized") { /* catch 401  Error here */
                console.log(error.data.Message);
                // should use refresh token here ?
                //..
                $ionicLoading.show({
                    templateUrl: 'templates/tokenexpired.html',
                    animation: 'slide-in-up'
                });

                $timeout(function () {
                    console.log(error);
                    console.log(error.data); /* catch 400  Error here */
                    $ionicLoading.hide();
                    $rootScope.UserIsInShift = false;
                    // logout
                    $window.localStorage['IsTempLogin'] = false;
                    localStorage.clear();
                    $state.go('login');
                }, 5000);
            }
            else {
                $ionicLoading.hide();
            }
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

empTracker.factory('CurrentLocation', function ($rootScope, $cordovaGeolocation, $ionicLoading, $timeout) {
    var options = { timeout: 10000, enableHighAccuracy: true };
    return {
        getLatLng: function (options) {
            $cordovaGeolocation.getCurrentPosition(options).then(function (position) {
                console.log('Geolocation pass');
                $rootScope.locationService = 'active';
                $rootScope.currentUserLatitude = position.coords.latitude;
                $rootScope.currentUserLongitude = position.coords.longitude;
            }
            , function (err) {
                $rootScope.locationService = 'inactive';
                console.log("Could not get location , You have to enable location on your device");
                    $ionicLoading.show({
                        template: '<div class="padding">\
                                    <a class="button button-icon icon energized ion-alert-circled"></a>\
                                    <h4>Can\'t get your location</h4>\
                                    <h5>You have to allow geolocation service on your device.</h4>\
                                </div>',
                        animation: 'slide-in-up'
                    });
                    $timeout(function () {
                        $ionicLoading.hide();
                    }, 5000);
            });
        }
    };
});

empTracker.factory('CallPerodicalUpdate', function ($rootScope, $window, $state, API) {
    return {
        sendUpdate: function () {
            $rootScope.currentUserLatitude = 0;
            $rootScope.currentUserLongitude = 0;
            $rootScope.getCurrentLocation();
            $rootScope.$watch('$root.currentUserLongitude', function () {
                if ($rootScope.currentUserLongitude != 0) {
                    console.log($rootScope.currentUserLatitude);
                    console.log($rootScope.currentUserLongitude);
                    var today = new Date();
                    var currentTime = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate() + ' ' + today.getHours() + ':' + today.getMinutes() + ':' + today.getSeconds();
                    console.log(currentTime);
                    var req = {
                        method: 'POST',
                        url: '/api/Attendance/Log/PeriodicalUpdate',
                        data: {
                            //CurrentTime: currentTime,
                            Latitude: $rootScope.currentUserLatitude,
                            Longitude: $rootScope.currentUserLongitude,
                            GPSTrackingMethod: 'Network',
                            PunchedVia: 'MOB',
                        }
                    }
                    console.log(req);
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
                        API.showTokenError(error);
                    });

                }
            });
        }
    };
});