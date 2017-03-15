empTracker.factory('API', ['$http', '$window', '$ionicLoading', '$timeout', '$state', '$rootScope', function ($http, $window, $ionicLoading, $timeout, $state, $rootScope) {
    var _url = "http://rostersmanager.com:90";
    //console.log('');
    return {
        name: 'API',
        execute: function (_req, _isAuth) {
            var headers = {};
            //console.log('111');
            if (_isAuth) { //// _isAuth means need token
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
            _req.timeout = 20000; 
            _req.url = _url + _req.url;
            _req.headers = headers;
            return $http(_req);
        },
        refreshtoken: function (_req, _isAuth) {
            var headers = {};
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
        showTokenError: function (_error) {
            console.log(_error);
            if (_error.status == 0) {
                console.log('timeout Err');
                $ionicLoading.show({
                    //templateUrl: 'templates/tokenexpired.html',
                    template: '<div class="padding">\
                                <a class="button button-icon icon energized ion-alert-circled"></a>\
                                <h4>Timeout Error</h4>\
                                <h5>Make sure that WIFI or Mobile Data is turned on, then try again</h5>\
                              </div>',
                    animation: 'slide-in-up'
                });
                $timeout(function () {
                    $ionicLoading.hide();
                }, 5000);
            }
            else if (_error.status == 401 && _error.statusText == "Unauthorized") { /* catch 401  Error here */
                console.log(_error.data.Message);
                // should use refresh token here ?
                //.. 
                if (!ionic.Platform.isAndroid()) {
                    $ionicLoading.show({
                        //templateUrl: 'templates/tokenexpired.html',
                        template: '<div class="padding">\
                                    <a class="button button-icon icon energized ion-alert-circled"></a>\
                                    <h4>' + _error.data.Message + '</h4>\
                                  </div>',
                        animation: 'slide-in-up'
                    });
                }


                $rootScope.showToast(_error.data.Message);
                $timeout(function () {
                    console.log(_error);
                    console.log(_error.data); /* catch 400  Error here */
                    //$ionicLoading.hide();
                    $rootScope.UserIsInShift = false;
                    // logout
                    $window.localStorage['IsTempLogin'] = false;
                    localStorage.clear();
                    $ionicLoading.hide();
                    $state.go('login');
                }, 5000);
            }
            else {
                $ionicLoading.hide();
            }
        },
        convertUTCToLocalTime: function (_uTCTime) {
            return (new Date(_uTCTime));
        },
        convertLocalTimeToUTC: function (_LocalTime) {
            return new Date(_LocalTime).toISOString();
        }
    };
}]);

empTracker.factory('InternetConnection', function ($http, $rootScope, $ionicLoading, $timeout) {
    var timeoutCounter = 0;
    return {
        checkConnection: function () {
            $http({
                type: "HEAD",
                method: "GET",
                timeout: 20000,
                url: "http://rostersmanager.com:90"
            }).then(function (response) {
                timeoutCounter = 0;
                $rootScope.internetStatus = 'connected';
                console.log(timeoutCounter);
            }, function (error) {
                console.log(error);
                timeoutCounter++;
                console.log(timeoutCounter);
                $rootScope.internetStatus = 'disconnected';
                if (timeoutCounter == 1) {
                    console.log('timeout Err InternetConnection Function');
                    if (error.status == 0) {
                        console.log('timeout Err, The connection to the server failed');
                        $ionicLoading.show({
                            template: '<div class="padding">\
                                <a class="button button-icon icon energized ion-alert-circled"></a>\
                                <h4>No Internet Connection</h4>\
                                <h5>No internet connection. Make sure that WIFI or Mobile Data is turned on, then try again</h5>\
                              </div>',
                            animation: 'slide-in-up'
                        });
                        $timeout(function () {
                            $ionicLoading.hide();
                        }, 5000);
                    }
                }

            });

        }
    };
});

empTracker.factory('CurrentLocation', function ($rootScope, $cordovaGeolocation, $ionicLoading, $timeout) {
    //var options = { timeout: 10000, enableHighAccuracy: true };
    return {
        getLatLng: function (options) {
            console.log('getLatLng');
            if ($rootScope.userSettings.TimeAttendanceSettings.AllowClockingWithoutGPS == false) {
                console.log('if');
                $rootScope.locationService = 'active';
                $rootScope.currentUserLatitude = null;
                $rootScope.currentUserLongitude = null;
                return true;
            }
            else {
                console.log('else');

                var posOption = {
                    timeout: 15000,
                    enableHighAccuracy: false
                };
                $cordovaGeolocation.getCurrentPosition(posOption).then(function (position) {
                    //$scope.lat = position.coords.latitude;
                    //$scope.long = position.coords.longitude;
                    console.log('Geolocation pass');
                    $rootScope.locationService = 'active';
                    $rootScope.currentUserLatitude = position.coords.latitude;
                    $rootScope.currentUserLongitude = position.coords.longitude;

                    console.log($rootScope.currentUserLatitude);
                    //socket.emit('my other event', {
                    //    latitude: $rootScope.currentUserLatitude,
                    //    longitude: $rootScope.currentUserLongitude
                    //});
                    return true;

                }, function (err) {
                    console.log(err);
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
                    return false;
                });
                //var watchOptions = {
                //    frequency: 1000,
                //    timeout: 15000,
                //    enableHighAccuracy: false
                //    // may cause errors if true
                //};
                //var watch = $cordovaGeolocation.watchPosition(watchOptions);
                //watch.then(null, function (err) {
                //    // error
                //    console.log(err);
                //    $rootScope.locationService = 'inactive';
                //    console.log("Could not get location , You have to enable location on your device");
                //    $ionicLoading.show({
                //        template: '<div class="padding">\
                //                    <a class="button button-icon icon energized ion-alert-circled"></a>\
                //                    <h4>Can\'t get your location</h4>\
                //                    <h5>You have to allow geolocation service on your device.</h4>\
                //                </div>',
                //        animation: 'slide-in-up'
                //    });
                //    $timeout(function () {
                //        $ionicLoading.hide();
                //    }, 5000);
                //    return false;
                //}, function (position) {
                //    //var lat = position.coords.latitude
                //    //var long = position.coords.longitude
                //    console.log('Geolocation pass');
                //    $rootScope.locationService = 'active';
                //    $rootScope.currentUserLatitude = position.coords.latitude;
                //    $rootScope.currentUserLongitude = position.coords.longitude;

                //    $window.alert(lat);
                //    //socket.emit('my other event', {
                //    //    latitude: lat,
                //    //    longitude: long
                //    //});
                //    return true;

                //});
                //watch.clearWatch();






                //$cordovaGeolocation.getCurrentPosition(options).then(function (position) {
                //    console.log('Geolocation pass');
                //    $rootScope.locationService = 'active';
                //    $rootScope.currentUserLatitude = position.coords.latitude;
                //    $rootScope.currentUserLongitude = position.coords.longitude;
                //    return true;
                //}
                //            , function (err) {
                //                $rootScope.locationService = 'inactive';
                //                console.log("Could not get location , You have to enable location on your device");
                //                $ionicLoading.show({
                //                    template: '<div class="padding">\
                //                    <a class="button button-icon icon energized ion-alert-circled"></a>\
                //                    <h4>Can\'t get your location</h4>\
                //                    <h5>You have to allow geolocation service on your device.</h4>\
                //                </div>',
                //                    animation: 'slide-in-up'
                //                });
                //                $timeout(function () {
                //                    $ionicLoading.hide();
                //                }, 5000);
                //                return false;
                //            });
            }
        }
    };
});

empTracker.factory('CallPerodicalUpdate', function ($rootScope, $window, $state, API) {
    return {
        sendUpdate: function () {
            $rootScope.currentUserLatitude = 0;
            $rootScope.currentUserLongitude = 0;
            //if ($rootScope.userSettings.TimeAttendanceSettings.AllowClockingWithoutGPS == false) { //Not allowed without GPS 
            // what is periodical update required setting option ?
            //}
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

empTracker.factory('LocalStorage', function ($window) {
    return {
        //set: function (key, value) {
        //    $window.localStorage.setItem(key, value);
        //},
        //get: function (key, defaultValue) {
        //    return $window.localStorage.getItem(key) || defaultValue;
        //},

        setObject: function (key, value) {
            $window.localStorage.setItem(key, JSON.stringify(value));
        },
        getObject: function (key) {
            return JSON.parse($window.localStorage.getItem(key) || '{}');
        },
        clear: function (key) {
            $window.localStorage.setItem(key, null);
            //$window.localStorage.clear();
        }

        //, resetObject: function (key, value) {
        //    $window.localStorage.setItem(key, JSON.stringify(value));
        //}

    }

});