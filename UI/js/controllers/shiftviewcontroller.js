empTracker.controller("shiftviewController", function ($scope, $state, $ionicPopup, $timeout, $rootScope, $stateParams, API, $ionicLoading, $window) {
    var count = true;
    //$scope.shiftNotes = 'teext1\nteext2\nteext3\nteext4\nteext5\nteext6';
    var formatedTodayDateTime;
    $scope.$on('$ionicView.enter', function () {
        $scope.errorMSG = "";
        console.log($window.localStorage['IsTempLogin']);
        console.log($stateParams.shiftid);

        $scope.today = new Date();
        var formatedTodayDate = $scope.today.getFullYear() + '-' + ($scope.today.getMonth() + 1) + '-' + $scope.today.getDate();

        formatedTodayDateTime = $scope.today.getFullYear() + '-' + ($scope.today.getMonth() + 1) + '-' + $scope.today.getDate() + ' ' + $scope.today.getHours() + ':' + $scope.today.getMinutes() + ':' + $scope.today.getSeconds();
        console.log(formatedTodayDateTime);
        //1111111111111111111111111111111111111111111111111111111111111111111111111111111111
        //Temp user login
        if ($window.localStorage['IsTempLogin'] === 'true') {
            $scope.pageTitle = "Available shift";
            $scope.tempLogin = true;
            $rootScope.toggledrag = false;
            $ionicLoading.show({
                content: 'Loading',
                animation: 'fade-in',
                showBackdrop: true,
                maxWidth: 200,
                showDelay: 0,
                template: '<i class="icon ion-loading-d"></i>'
            });
            //api here
            var req = {
                method: 'GET',
                url: '/api/Attendance/Current?currentTime=' + formatedTodayDate,
                data: {}
            }
            // add true to use authentication token
            API.execute(req, true).then(function (_res) {
                console.log(_res.data);
                console.log(_res.data.data.IsClockedIn);
                console.log(_res.data.data.IsClockedOut);
                if (_res.data.code == 200) {
                    $scope.ShiftId = _res.data.data.RosterShiftId;
                    $scope.AttendanceShiftId = _res.data.data.AttendanceShiftId;
                    $scope.pageTitle = _res.data.data.TaskName;
                    var StartingDay = new Date(new Date(_res.data.data.StartDate).getFullYear(), new Date(_res.data.data.StartDate).getMonth(), new Date(_res.data.data.StartDate).getDate());
                    $scope.shiftDate = shortMonths[StartingDay.getMonth()] + " " + StartingDay.getDate() + " , " + StartingDay.getFullYear();
                    $scope.startDate = _res.data.data.StartDate;
                    $scope.endDate = _res.data.data.EndDate;
                    $scope.shiftBreak = _res.data.data.BreakDuration;
                    $scope.shiftSite = _res.data.data.ShortSiteName;
                    $scope.shiftaddress = _res.data.data.SiteName;
                    $scope.shiftNotes = _res.data.data.NotesToEmployee;
                    $scope.ShiftLatitude = _res.data.data.SiteCoordinates.Latitude;
                    $scope.ShiftLongitude = _res.data.data.SiteCoordinates.Logitude;
                    if (_res.data.data.IsClockedIn == true && _res.data.data.IsClockedOut == false) {
                        //if already clocked in , show break btn & clockout btn
                        if (_res.data.data.IsInBreak == true) {
                            count = false;
                            $scope.timecounter = -1;
                            $scope.minutes = 0;
                            $scope.seconds = 0;

                            console.log('in break');
                            $scope.clockOut = true;
                            $scope.breakOut = true;
                            $scope.breakDurationEnd = true;
                            count = true;
                            $scope.timecounter = 0;
                            $scope.countdown = function () {
                                stopped = $timeout(function () {
                                    $scope.timecounter++;
                                    if ($scope.timecounter != 0 && $scope.minutes <= 44 && count == true) {
                                        console.log($scope.timecounter);
                                        $scope.minutes = parseInt(($scope.timecounter / 60));
                                        $scope.seconds = ($scope.timecounter % 60);
                                        console.log($scope.minutes);
                                        console.log($scope.seconds);
                                        $scope.countdown();
                                    }
                                    else {
                                        console.log('else');
                                        $scope.breakDurationEnd = false;
                                        return false
                                    };
                                }, 1000);
                            };
                            $scope.countdown();
                        }
                        else {
                            console.log('no break');
                            $scope.clockOut = true;
                            $scope.breakOut = false;
                        }

                    }
                    $ionicLoading.hide();
                }
                else {
                    $scope.pageTitle = "No upcoming shifts";
                    $ionicLoading.hide();
                }
            }, API.showtokenerror(error));
        }
            //2222222222222222222222222222222222222222222222222222222222222222222222222222222
            //next shift normal user
        else if ($stateParams.shiftid == "") {
            $rootScope.toggledrag = true;
            $scope.tempLogin = false;
            $scope.pageTitle = "Available shift";
            $ionicLoading.show({
                content: 'Loading',
                animation: 'fade-in',
                showBackdrop: true,
                maxWidth: 200,
                showDelay: 0,
                template: '<i class="icon ion-loading-d"></i>'
            });
            //api here
            var req = {
                method: 'GET',
                url: '/api/Attendance/Current?currentTime=' + formatedTodayDate,
                data: {}
            }
            // add true to use authentication token
            API.execute(req, true).then(function (_res) {
                console.log(_res.data);
                console.log(_res.data.data.IsClockedIn);
                console.log(_res.data.data.IsClockedOut);
                if (_res.data.code == 200) {
                    $scope.ShiftId = _res.data.data.RosterShiftId;
                    $scope.AttendanceShiftId = _res.data.data.AttendanceShiftId;
                    $scope.pageTitle = _res.data.data.TaskName;
                    var StartingDay = new Date(new Date(_res.data.data.StartDate).getFullYear(), new Date(_res.data.data.StartDate).getMonth(), new Date(_res.data.data.StartDate).getDate());
                    $scope.shiftDate = shortMonths[StartingDay.getMonth()] + " " + StartingDay.getDate() + " , " + StartingDay.getFullYear();
                    $scope.startDate = _res.data.data.StartDate;
                    $scope.endDate = _res.data.data.EndDate;
                    $scope.shiftBreak = _res.data.data.BreakDuration;
                    $scope.shiftSite = _res.data.data.ShortSiteName;
                    $scope.shiftaddress = _res.data.data.SiteName;
                    $scope.shiftNotes = _res.data.data.NotesToEmployee;
                    $scope.ShiftLatitude = _res.data.data.SiteCoordinates.Latitude;
                    $scope.ShiftLongitude = _res.data.data.SiteCoordinates.Logitude;
                    if (_res.data.data.IsClockedIn == true && _res.data.data.IsClockedOut == false) {
                        //if already clocked in , show break btn & clockout btn
                        if (_res.data.data.IsInBreak == true) {
                            count = false;
                            $scope.timecounter = -1;
                            $scope.minutes = 0;
                            $scope.seconds = 0;

                            console.log('in break');
                            $scope.clockOut = true;
                            $scope.breakOut = true;
                            $scope.breakDurationEnd = true;
                            count = true;
                            $scope.timecounter = 0;
                            $scope.countdown = function () {
                                stopped = $timeout(function () {
                                    $scope.timecounter++;
                                    if ($scope.timecounter != 0 && $scope.minutes <= 44 && count == true) {
                                        console.log($scope.timecounter);
                                        $scope.minutes = parseInt(($scope.timecounter / 60));
                                        $scope.seconds = ($scope.timecounter % 60);
                                        console.log($scope.minutes);
                                        console.log($scope.seconds);
                                        //$scope.countdown();
                                    }
                                    else {
                                        console.log('else');
                                        $scope.breakDurationEnd = false;
                                        return false
                                    };
                                }, 1000);
                            };
                            $scope.countdown();
                        }
                        else {
                            console.log('no break');
                            $scope.clockOut = true;
                            $scope.breakOut = false;
                        }
                    }
                    $ionicLoading.hide();
                }
                else {
                    console.log('else');
                    $scope.pageTitle = "No upcoming shifts";
                    $ionicLoading.hide();
                }
            }, function (error) {
                API.showTokenError(error);
            });
        }
            //3333333333333333333333333333333333333333333333333333333333333333333333333333333
            // get certain shift data
        else {
            $scope.tempLogin = false;
            $rootScope.toggledrag = true;
            $ionicLoading.show({
                content: 'Loading',
                animation: 'fade-in',
                showBackdrop: true,
                maxWidth: 200,
                showDelay: 0,
                template: '<i class="icon ion-loading-d"></i>'
            });
            //api here
            var req = {
                method: 'GET',
                url: '/api/Roster?shiftId=' + $stateParams.shiftid,
                data: {}
            }
            // add true to use authentication token
            API.execute(req, true).then(function (_res) {
                console.log(_res.data);
                if (_res.data.code == 200) {
                    $scope.ShiftId = _res.data.data.RosterShiftId;
                    $scope.AttendanceShiftId = _res.data.data.AttendanceShiftId;
                    $scope.pageTitle = _res.data.data.TaskName;
                    var StartingDay = new Date(new Date(_res.data.data.StartDate).getFullYear(), new Date(_res.data.data.StartDate).getMonth(), new Date(_res.data.data.StartDate).getDate());
                    $scope.shiftDate = shortMonths[StartingDay.getMonth()] + " " + StartingDay.getDate() + " , " + StartingDay.getFullYear();
                    $scope.startDate = _res.data.data.StartDate;
                    $scope.endDate = _res.data.data.EndDate;
                    $scope.shiftBreak = _res.data.data.BreakDuration;
                    $scope.shiftSite = _res.data.data.ShortLocationName;
                    $scope.shiftaddress = _res.data.data.LocationName;
                    $scope.shiftNotes = _res.data.data.NotesToEmployee;
                    $scope.ShiftLatitude = _res.data.data.LocationCoordinates.Latitude;
                    $scope.ShiftLongitude = _res.data.data.LocationCoordinates.Logitude;
                    $ionicLoading.hide();
                }
                else if (_res.data.code == 403) {
                    $scope.pageTitle = "Shift not available";
                    $ionicLoading.hide();
                }
                else {
                    $scope.pageTitle = "No upcoming shifts";
                    $ionicLoading.hide();
                }
            }, function (error) {
                API.showTokenError(error);
            });
        }

    });

    var days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    var months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    var shortMonths = ["Jan", "Feb", "Mar", "Apr", "May", "June", "July", "Aug", "Sept", "Oct", "Nov", "Dec"];

    $scope.openmyaccount = function () {
        $state.go('app.myaccount');
    }
    $scope.showSubMenu = function () {
        $state.go('app.submenu');
    }
    $scope.notifications = function () {
        $state.go('app.notifications');
    }
    $scope.goBack = function () {
        window.history.back();
    }
    $scope.updateNotes = function (text) {
        console.log(text);
    }
    $scope.viewMap = function () {
        $state.go('app.viewmap', { Latitude: $scope.ShiftLatitude, Longitude: $scope.ShiftLongitude });
    }
    $scope.load = function () {
        $scope.clockOut = false;
        $scope.minutes = 0;
        $scope.seconds = 0;
        $scope.timecounter = 0;
    }
    $scope.load();
    var stopped;
    // A confirm dialog
    $scope.showConfirmIn = function () {
        if ($scope.pageTitle != "No upcoming shifts") {

            var confirmPopup = $ionicPopup.confirm({
                cssClass: 'bluePopup',
                title: '<i class="ion-information-circled "></i> Confirm Clock-In',
                template: 'Are you sure you want to check in?'
            });

            confirmPopup.then(function (res) {
                if (res) {
                    console.log('You are sure In');
                    $scope.clockInShift();
                } else {
                    console.log('You are not sure In');
                }
            });
        }
        else {
            $scope.pageTitle = "You can't clock in , No upcoming shifts"
        }

    };

    $scope.showConfirmOut = function () {
        var confirmPopup = $ionicPopup.confirm({
            cssClass: 'bluePopup',
            title: '<i class="ion-information-circled "></i> Confirm Clock-Out',
            template: 'Are you sure you want to check out?'
        });

        confirmPopup.then(function (res) {
            if (res) {
                console.log('You are sure Out');
                $scope.clockOutShift();

            } else {
                console.log('You are not sure Out');
            }
        });
    };
    $scope.breakDurationEnd = false;
    
    $scope.takeBreak = function () {
        $scope.errorMSG = "";
        $ionicLoading.show({
            content: 'Loading',
            animation: 'fade-in',
            showBackdrop: true,
            maxWidth: 200,
            showDelay: 0,
            template: '<i class="icon ion-loading-d"></i>'
        });
        //api here
        var req = {
            method: 'PUT',
            url: '/api/Attendance?action=breakstart',
            data: {
                "ShiftID": $scope.ShiftId,
                "AttendanceShiftId": $scope.AttendanceShiftId,
                "Notes": "",
                "Clocking": {
                    "ClockingTime": formatedTodayDateTime,
                    "PunchedVia": "MOB"
                }
            }
        }
        console.log(req.data);
        // add true to use authentication token
        API.execute(req, true).then(function (_res) {
            console.log(_res);
            console.log(_res.data);
            if (_res.data.code == 200) {
                $scope.breakDurationEnd = true;
                $scope.breakOut = true;
                count = true;
                $scope.timecounter = 0;
                $scope.countdown = function () {
                    stopped = $timeout(function () {
                        $scope.timecounter++;
                        if ($scope.timecounter != 0 && $scope.minutes <= 44 && count == true) {
                            console.log($scope.timecounter);
                            $scope.minutes = parseInt(($scope.timecounter / 60));
                            $scope.seconds = ($scope.timecounter % 60);
                            console.log($scope.minutes);
                            console.log($scope.seconds);
                            $scope.countdown();
                        }
                        else {
                            console.log('else');
                            $scope.breakDurationEnd = false;
                            return false
                        };
                    }, 1000);
                };
                $scope.countdown();
                console.log('pass');
                $ionicLoading.hide();
            }
            else {
                $scope.errorMSG = _res.data.data;
                console.log('fail');
                $ionicLoading.hide();
            }
        }, function (error) {
            API.showTokenError(error);
        });
    }
    $scope.finishBreak = function () {
        $scope.errorMSG = "";
        $ionicLoading.show({
            content: 'Loading',
            animation: 'fade-in',
            showBackdrop: true,
            maxWidth: 200,
            showDelay: 0,
            template: '<i class="icon ion-loading-d"></i>'
        });
        //api here
        var req = {
            method: 'PUT',
            url: '/api/Attendance?action=breakend',
            data: {
                "ShiftID": $scope.ShiftId,
                "AttendanceShiftId": $scope.AttendanceShiftId,
                "Notes": "",
                "Clocking": {
                    "ClockingTime": formatedTodayDateTime,
                    "PunchedVia": "MOB"
                }
            }
        }
        console.log(req.data);
        // add true to use authentication token
        API.execute(req, true).then(function (_res) {
            console.log(_res.data);
            if (_res.data.code == 200) {
                count = false;
                $scope.timecounter = -1;
                $scope.minutes = 0;
                $scope.seconds = 0;
                $scope.breakOut = false;

                console.log('pass');
                $ionicLoading.hide();
            }
            else {
                console.log('fail');
                $ionicLoading.hide();
            }
        }, function (error) {
            API.showTokenError(error);
        });
    }

    $scope.logout = function () {
        $rootScope.UserIsInShift = false;
        // logout
        $window.localStorage['IsTempLogin'] = false;
        localStorage.clear();
        $state.go('login');
    }

    $scope.clockInShift = function () {
        $rootScope.currentUserLatitude = 0;
        $rootScope.currentUserLongitude = 0;
        $scope.errorMSG = "";
        $ionicLoading.show({
            content: 'Loading',
            animation: 'fade-in',
            showBackdrop: true,
            maxWidth: 200,
            showDelay: 0,
            template: '<i class="icon ion-loading-d"></i>'
        });
        $rootScope.getCurrentLocation();
        $scope.$watch('$root.currentUserLongitude', function () {
            if ($rootScope.currentUserLongitude != 0) {
                console.log($rootScope.currentUserLatitude);
                console.log($rootScope.currentUserLongitude);

                //api here
                var req = {
                    method: 'PUT',
                    url: '/api/Attendance?action=in',
                    data: {
                        "RosterShiftID": $scope.ShiftId,
                        "Notes": "",
                        "Clocking": {
                            "ClockingTime": formatedTodayDateTime,
                            "Latitude": $rootScope.currentUserLatitude,
                            "Longitude": $rootScope.currentUserLongitude,
                            "GPSTrackingMethod": "Network",
                            "PunchedVia": "MOB",
                            "EmployeeNotes": ""
                        }
                    }
                }
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
                    else if (_res.data.code == 500) {
                        $scope.errorMSG = 'you are already clocked in this shift.';
                        $scope.clockOut = true;
                        $scope.breakOut = false;
                        $ionicLoading.hide();
                    }
                    else if (_res.data.code == 400) {
                        $scope.errorMSG = 'You are already clocked in shift.';
                        $ionicLoading.hide();
                        console.log('fail');

                    }
                    else {
                        $scope.errorMSG = _res.data.data;
                        $ionicLoading.hide();
                        console.log('fail');
                    }
                },
               function (error) {
                   API.showTokenError(error);
               });
            }
        });

    }
    $scope.clockOutShift = function () {
        $rootScope.currentUserLatitude = 0;
        $rootScope.currentUserLongitude = 0;
        $scope.errorMSG = "";
        $ionicLoading.show({
            content: 'Loading',
            animation: 'fade-in',
            showBackdrop: true,
            maxWidth: 200,
            showDelay: 0,
            template: '<i class="icon ion-loading-d"></i>'
        });
        $rootScope.getCurrentLocation();
        $scope.$watch('$root.currentUserLongitude', function () {
            if ($rootScope.currentUserLongitude != 0) {
                console.log($rootScope.currentUserLatitude);
                console.log($rootScope.currentUserLongitude);
                //api here
                var req = {
                    method: 'PUT',
                    url: '/api/Attendance?action=out',
                    data: {
                        "RosterShiftID": $scope.ShiftId,
                        "AttendanceShiftId": $scope.AttendanceShiftId,
                        "Notes": "",
                        "Clocking": {
                            "ClockingTime": formatedTodayDateTime,
                            "Latitude": $rootScope.currentUserLatitude,
                            "Longitude": $rootScope.currentUserLongitude,
                            "GPSTrackingMethod": "Network",
                            "PunchedVia": "MOB",
                            "EmployeeNotes": ""
                        }
                    }
                }
                console.log(req.data);
                // add true to use authentication token
                API.execute(req, true).then(function (_res) {
                    console.log(_res.data);
                    if (_res.data.code == 200) {
                        $rootScope.UserIsInShift = false;
                        console.log('pass');
                        $scope.clockOut = false;
                        $scope.breakOut = false;
                        $ionicLoading.hide();
                    }
                    else if (_res.data.code == 500) {
                        $scope.errorMSG = 'you are already clocked in';
                        $scope.clockOut = true;
                        $scope.breakOut = false;
                        $ionicLoading.hide();
                    }
                    else {
                        $scope.errorMSG = _res.data.data;
                        $ionicLoading.hide();
                        console.log('fail');
                    }
                },
                function (error) {
                    API.showTokenError(error);
                });
            }
        });

    }
});