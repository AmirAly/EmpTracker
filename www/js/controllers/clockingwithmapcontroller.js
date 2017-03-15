empTracker.controller("clockingwithmapController", function ($scope, $state, $timeout, $stateParams, $rootScope, $window, $cordovaGeolocation, $ionicLoading) {
    var currentShiftLatitude; var currentShiftLongitude; var currentUserLatitude; var currentUserLongitude;
    var options = { timeout: 15000, enableHighAccuracy: false };
    $scope.$on('$ionicView.enter', function () {
        if ($stateParams.Latitude == null || $stateParams.Longitude == null) {
            $scope.noCoordinates = true;
        }
        else {
            $scope.noCoordinates = false;

            var map;
            $ionicLoading.show({
                content: 'Loading',
                animation: 'fade-in',
                showBackdrop: true,
                maxWidth: 200,
                showDelay: 0,
                template: '<i class="icon ion-loading-d"></i>'
            });
            $cordovaGeolocation.getCurrentPosition(options).then(function (position) {
                // shift coordinates
                currentShiftLatitude = $stateParams.Latitude;
                currentShiftLongitude = $stateParams.Longitude;
                console.log(currentShiftLatitude);
                console.log(currentShiftLongitude);
                // user coordinates ('ll be used in navigation)
                currentUserLatitude = position.coords.latitude;
                currentUserLongitude = position.coords.longitude;
                console.log(currentUserLatitude);
                console.log(currentUserLongitude);

                var latLngShift = new google.maps.LatLng(currentShiftLatitude, currentShiftLongitude);
                var latLngUser = new google.maps.LatLng(currentUserLatitude, currentUserLongitude);

                var mapOptions = {
                    center: latLngShift,
                    zoom: 18,
                    mapTypeId: google.maps.MapTypeId.ROADMAP
                };

                $scope.map = new google.maps.Map(document.getElementById("map"), mapOptions);
                ////Add a Marker and Info Window to Your Map
                //Wait until the map is loaded
                google.maps.event.addListenerOnce($scope.map, 'idle', function () {

                    var marker1 = new google.maps.Marker({
                        map: $scope.map,
                        animation: google.maps.Animation.DROP,
                        position: latLngShift
                    });

                    var infoWindow1 = new google.maps.InfoWindow({
                        content: "Here the shift!"
                    });

                    google.maps.event.addListener(marker1, 'click', function () {
                        infoWindow1.open($scope.map, marker1);
                    });


                    var marker2 = new google.maps.Marker({
                        map: $scope.map,
                        animation: google.maps.Animation.DROP,
                        position: latLngUser
                    });

                    var infoWindow2 = new google.maps.InfoWindow({
                        content: "Here I'm!"
                    });

                    google.maps.event.addListener(marker2, 'click', function () {
                        infoWindow2.open($scope.map, marker2);
                    });
                    //$ionicLoading.hide();


                });
            }, function (error) {
                console.log(error);
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
                //$timeout(function () {
                //    $ionicLoading.hide();
                //}, 5000);

                //console.log("Could not get location");
                //var alertPopup = $ionicPopup.alert({
                //    title: 'Can\'t display map',
                //    template: 'Could Not Find Address On Map. Please Contact Your Company'
                //});
            }).finally(function () {
                $ionicLoading.hide();
            });
        }
    });




    $scope.clockInWithMap = function () {
        //api here
        var str = $rootScope.empPhotoForClocking;
        str = str.substring(str.indexOf(",") + 1);
        var req = {
            method: 'PUT',
            url: '/api/Attendance?action=in',
            data: {
                "RosterShiftID": $rootScope.shiftIdForClocking,
                "Notes": "",
                "Clocking": {
                    "ClockingTime": $rootScope.shiftDateTimeForClocking,
                    "Latitude": $stateParams.Latitude,
                    "Longitude": $stateParams.Longitude,
                    "GPSTrackingMethod": "Network",
                    "PunchedVia": "MOB",
                    "EmployeeNotes": $rootScope.shiftNotesForClocking,
                    "Photo": str
                }
            }
        }
        console.log(JSON.stringify(req.data));
        // add true to use authentication token
        API.execute(req, true).then(function (_res) {
            console.log(JSON.stringify(_res));
            if (_res.data.code == 200) {
                $rootScope.UserIsInShift = true;
                console.log('pass');
                $scope.clockOut = true;
                $scope.breakOut = false;
                $ionicLoading.hide();
                $scope.AttendanceShiftId = _res.data.data.AttendanceShiftId;
            }
            else if (_res.data.code == 300) { // outside geofencing
                $ionicLoading.hide();
                var confirmPopup = $ionicPopup.confirm({
                    cssClass: 'bluePopup',
                    title: '<i class="ion-information-circled "></i> Confirm Clock-In',
                    template: 'You are clocking Far away from the Job Site. Shift Might be Rejected By Your Company.'
                });

                confirmPopup.then(function (res) {
                    if (res) {
                        $ionicLoading.show({
                            content: 'Loading',
                            animation: 'fade-in',
                            showBackdrop: true,
                            maxWidth: 200,
                            showDelay: 0,
                            template: '<i class="icon ion-loading-d"></i>'
                        });
                        console.log('You are sure In');
                        var req = {
                            method: 'PUT',
                            url: '/api/Attendance?action=in',
                            data: {
                                "RosterShiftID": $rootScope.shiftIdForClocking,
                                "Notes": "",
                                "Clocking": {
                                    "ClockingTime": $rootScope.shiftDateTimeForClocking,
                                    "Latitude": $stateParams.Latitude,
                                    "Longitude": $stateParams.Longitude,
                                    "GPSTrackingMethod": "Network",
                                    "PunchedVia": "MOB",
                                    "EmployeeNotes": $rootScope.shiftNotesForClocking,
                                    "Photo": str
                                },
                                "Confirmations": [{ "Code": 300 }]
                            }
                        }
                        // Same Api Again
                        console.log(req.data);
                        // add true to use authentication token
                        API.execute(req, true).then(function (_res) {
                            console.log(_res.data);
                            if (_res.data.code == 200) {
                                $rootScope.UserIsInShift = true;
                                console.log('pass');
                                $scope.clockOut = true;
                                $scope.breakOut = false;
                                $ionicLoading.hide();
                                $scope.AttendanceShiftId = _res.data.data.AttendanceShiftId;
                            }
                            else {
                                $ionicLoading.hide();
                                console.log(_res.data.data);
                                $scope.errorMSG = _res.data.data;
                                console.log('fail');
                                $rootScope.showToast(_res.data.data);
                            }
                        },
                       function (error) {
                           API.showTokenError(error);
                       });

                    } else {
                        console.log('You are not sure In');
                    }
                });
            }
                //else if (_res.data.code == 500) {
                //    $ionicLoading.hide();
                //    console.log(_res.data.data);
                //    $rootScope.showToast(_res.data.data);
                //    //$scope.errorMSG = 'you are already clocked in this shift.';
                //    $scope.clockOut = true;
                //    $scope.breakOut = false;

                //}
            else {
                $ionicLoading.hide();
                console.log(_res.data.data);
                $scope.errorMSG = _res.data.data;
                console.log('fail');
                $rootScope.showToast(_res.data.data);
            }
        },
       function (error) {
           API.showTokenError(error);
       });

    }

    $scope.openmyaccount = function () {
        $state.go('supervisormenu.supervisoraccount');
    }
    $scope.notifications = function () {
        $state.go('supervisormenu.supervisornotifications');
    }

});

