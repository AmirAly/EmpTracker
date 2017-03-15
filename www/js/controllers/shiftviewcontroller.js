empTracker.controller("shiftviewController", function ($scope, $state, $ionicPopup, $timeout, $rootScope, $stateParams, API, $ionicLoading, $window, LocalStorage) {
    var count = true;
    //$scope.shiftNotes = 'teext1\nteext2\nteext3\nteext4\nteext5\nteext6';
    var formatedTodayDateTime;
    $scope.$on('$ionicView.enter', function () {
        $scope.errorMSG = "";
        console.log($window.localStorage['IsTempLogin']);
        console.log($stateParams.shiftid);
        $scope.notesEnabled = false;
        if ($rootScope.userSettings.TimeAttendanceSettings.EnableEmployeeNotes == true) {
            $scope.notesEnabled = true;
        }
        $scope.today = new Date();
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
                url: '/api/Attendance/Current',
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
                    $scope.DisplayStartTime = _res.data.data.DisplayStartTime;
                    $scope.DisplayEndTime = _res.data.data.DisplayEndTime;

                    $scope.shiftBreak = _res.data.data.DisplayBreakTime;
                    $scope.shiftSite = _res.data.data.ShortSiteName;
                    $scope.shiftaddress = _res.data.data.SiteAddress.Street + " , " + _res.data.data.SiteAddress.State;
                    $scope.postalCode = _res.data.data.SiteAddress.PostalCode;
                    $scope.suburb = _res.data.data.SiteAddress.Suburb;

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
                    console.log(_res.data.data);
                    $rootScope.showToast(_res.data.data);

                }
            }, function (error) {
                API.showTokenError(error);
            });
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
            console.log(formatedTodayDateTime);
            //api here
            var req = {
                method: 'GET',
                url: '/api/Attendance/Current',
                data: {}
            }
            // add true to use authentication token
            API.execute(req, true).then(function (_res) {
                console.log(_res);
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
                    $scope.DisplayStartTime = _res.data.data.DisplayStartTime;
                    $scope.DisplayEndTime = _res.data.data.DisplayEndTime;

                    $scope.shiftBreak = _res.data.data.DisplayBreakTime;
                    $scope.shiftSite = _res.data.data.ShortSiteName;
                    $scope.shiftaddress = _res.data.data.SiteAddress.Street + " , " + _res.data.data.SiteAddress.State;
                    $scope.postalCode = _res.data.data.SiteAddress.PostalCode;
                    $scope.suburb = _res.data.data.SiteAddress.Suburb;

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
                    console.log('else');
                    $scope.pageTitle = "No upcoming shifts";
                    $ionicLoading.hide();
                    console.log(_res.data.data);
                    $rootScope.showToast(_res.data.data);

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
                    $scope.DisplayStartTime = _res.data.data.DisplayStartTime;
                    $scope.DisplayEndTime = _res.data.data.DisplayEndTime;

                    $scope.shiftBreak = _res.data.data.DisplayBreakTime;
                    $scope.shiftSite = _res.data.data.ShortSiteName;
                    $scope.shiftaddress = _res.data.data.SiteAddress.Street + " , " + _res.data.data.SiteAddress.State;
                    $scope.postalCode = _res.data.data.SiteAddress.PostalCode;
                    $scope.suburb = _res.data.data.SiteAddress.Suburb;

                    $scope.shiftNotes = _res.data.data.NotesToEmployee;
                    $scope.ShiftLatitude = _res.data.data.SiteCoordinates.Latitude;
                    $scope.ShiftLongitude = _res.data.data.SiteCoordinates.Logitude;
                    if (_res.data.data.ClockingStatus == "Working") {
                        $scope.clockOut = true;
                    }
                    $ionicLoading.hide();
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
                }
                else if (_res.data.code == 403) {
                    $scope.pageTitle = "Shift not available";
                    $ionicLoading.hide();
                    console.log(_res.data.data);
                    $rootScope.showToast(_res.data.data);

                }
                else {
                    $scope.pageTitle = "No upcoming shifts";
                    $ionicLoading.hide();
                    console.log(_res.data.data);
                    $rootScope.showToast(_res.data.data);

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
        if ($scope.ShiftLatitude != null && $scope.ShiftLongitude != null) {
            $state.go('app.viewmap', { Latitude: $scope.ShiftLatitude, Longitude: $scope.ShiftLongitude });
        }
        else {
            console.log('Could Not Find Address On Map. Please Contact Your Company');
            var alertPopup = $ionicPopup.alert({
                title: 'Can\'t display map',
                template: 'Could Not Find Address On Map. Please Contact Your Company'
            });
        }
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
                //$scope.errorMSG = _res.data.data;
                console.log('fail');
                $ionicLoading.hide();
                console.log(_res.data.data);
                $rootScope.showToast(_res.data.data);

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
                console.log(_res.data.data);
                $rootScope.showToast(_res.data.data);

            }
        }, function (error) {
            API.showTokenError(error);
        });
    }

    $scope.logout = function () {
        if ($rootScope.UserIsInShift == true) {
            // You can't log out as you still clocked in shift
            $rootScope.showToast("You can't logout as you still clocked in a shift");
        }
        else {
            var confirmPopup = $ionicPopup.confirm({
                cssClass: 'bluePopup',
                title: '<i class="ion-information-circled "></i> Confirm Log Out',
                template: 'Are you sure you want to Logout?'
            });

            confirmPopup.then(function (res) {
                if (res) {
                    console.log('You are sure In');
                    // logout
                    LocalStorage.clear('UserLocalObject');
                    $window.localStorage['IsTempLogin'] = false;
                    localStorage.clear();
                    $state.go('login');
                } else {
                    console.log('You are not sure In');
                }
            });


        }

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


        if ($rootScope.userSettings.TimeAttendanceSettings.AllowClockingWithoutGPS == false) { //Not allowed without GPS }
            console.log('$rootScope.userSettings.TimeAttendanceSettings.AllowClockingWithoutGPS == false');
            $rootScope.getCurrentLocation();
            $scope.$watch('$root.currentUserLongitude', function () {
                if ($rootScope.currentUserLongitude != 0) {
                    console.log($rootScope.currentUserLatitude);
                    console.log($rootScope.currentUserLongitude);
                    $scope.empPhoto = "";
                    console.log($rootScope.userSettings.TimeAttendanceSettings.AllowClockingWithoutCamera);
                    if ($rootScope.userSettings.TimeAttendanceSettings.AllowClockingWithoutCamera) { // camera not required
                        $scope.empPhoto = "";
                        $scope.doClockIn();
                    }
                    else { // open camera
                        if (navigator && navigator.camera) { // camera required
                            navigator.camera.getPicture(function (data) {// on succsess
                                if (data.indexOf('base64') < 0) {
                                    $scope.empPhoto = 'data:image/jpeg;base64,' + data;
                                    //$scope.empPhoto = data;
                                    if ($rootScope.userSettings.TimeAttendanceSettings.AllowClockingWithoutGPS == false || $rootScope.userSettings.TimeAttendanceSettings.EnableEmployeeNotes == true || $rootScope.userSettings.TimeAttendanceSettings.AllowClockingWithoutCamera == false) {
                                        $rootScope.empPhotoForClocking = 'data:image/jpeg;base64,' + data;
                                        $rootScope.shiftNotesForClocking = $scope.shiftNotes;
                                        $rootScope.shiftDateTimeForClocking = formatedTodayDateTime;
                                        $rootScope.shiftIdForClocking = $scope.ShiftId;
                                        $state.go('app.clockingwithmap', { Latitude: $scope.ShiftLatitude, Longitude: $scope.ShiftLongitude });
                                    }
                                    else {
                                    $scope.doClockIn();
                                    }
                                }
                                else {
                                    $scope.empPhoto = data;
                                    $scope.doClockIn();
                                }
                            }, null, {
                                sourceType: Camera.PictureSourceType.CAMERA,
                                quality: 50,
                                targetWidth: 140,
                                targetHeight: 140,
                                destinationType: Camera.DestinationType.DATA_URL,
                                cameraDirection: 1, // "1" is used for front-facing camera and "0" is used for back-facing camera.
                                correctOrientation: true
                            });
                        }
                        else {
                            console.log('take');
                            $ionicLoading.hide();
                        }

                    }
                }
            });
        }
        else {
            console.log('$rootScope.userSettings.TimeAttendanceSettings.AllowClockingWithoutGPS == true');
            $rootScope.currentUserLatitude = 0;
            $rootScope.currentUserLongitude = 0;
            $scope.empPhoto = "";
            console.log($rootScope.userSettings.TimeAttendanceSettings.AllowClockingWithoutCamera);
            if ($rootScope.userSettings.TimeAttendanceSettings.AllowClockingWithoutCamera) {
                $scope.empPhoto = "";
                $scope.doClockIn();
            }
            else { // open camera
                if (navigator && navigator.camera) {
                    navigator.camera.getPicture(function (data) {// on succsess
                        if (data.indexOf('base64') < 0) {
                            $scope.empPhoto = 'data:image/jpeg;base64,' + data;
                            //$scope.empPhoto = data;
                            $scope.doClockIn();
                        }
                        else {
                            $scope.empPhoto = data;
                            $scope.doClockIn();
                        }
                    }, function () {
                        console.log('cancelled');
                        $ionicLoading.hide();
                    }, {
                        sourceType: Camera.PictureSourceType.CAMERA,
                        quality: 50,
                        targetWidth: 140,
                        targetHeight: 140,
                        destinationType: Camera.DestinationType.DATA_URL,
                        cameraDirection: 1, // "1" is used for front-facing camera and "0" is used for back-facing camera.
                        correctOrientation: true
                    });
                }
                else {
                    console.log('take');
                    $ionicLoading.hide();
                }

            }
        }
    }

    $scope.doClockIn = function () {
        //api here
        var str = $scope.empPhoto;
        str = str.substring(str.indexOf(",") + 1);
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
                    "EmployeeNotes": $scope.shiftNotes,
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
                                "RosterShiftID": $scope.ShiftId,
                                "Notes": "",
                                "Clocking": {
                                    "ClockingTime": formatedTodayDateTime,
                                    "Latitude": $rootScope.currentUserLatitude,
                                    "Longitude": $rootScope.currentUserLongitude,
                                    "GPSTrackingMethod": "Network",
                                    "PunchedVia": "MOB",
                                    "EmployeeNotes": $scope.shiftNotes,
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

        if ($rootScope.userSettings.TimeAttendanceSettings.AllowClockingWithoutGPS == false) { //Not allowed without GPS }
            $rootScope.getCurrentLocation();
            $scope.$watch('$root.currentUserLongitude', function () {
                if ($rootScope.currentUserLongitude != 0) {
                    console.log($rootScope.currentUserLatitude);
                    console.log($rootScope.currentUserLongitude);
                    $scope.empPhoto = "";
                    console.log($rootScope.userSettings.TimeAttendanceSettings.AllowClockingWithoutCamera);
                    if ($rootScope.userSettings.TimeAttendanceSettings.AllowClockingWithoutCamera) {
                        $scope.empPhoto = "";
                        $scope.doClockOut();
                    }
                    else { // open camera
                        if (navigator && navigator.camera) {
                            navigator.camera.getPicture(function (data) {// on succsess
                                if (data.indexOf('base64') < 0) {
                                    $scope.empPhoto = 'data:image/jpeg;base64,' + data;
                                    //$scope.empPhoto = data;
                                    $scope.doClockOut();
                                }
                                else {
                                    $scope.empPhoto = data;
                                    $scope.doClockOut();
                                }
                            }, null, {
                                sourceType: Camera.PictureSourceType.CAMERA,
                                quality: 50,
                                targetWidth: 140,
                                targetHeight: 140,
                                destinationType: Camera.DestinationType.DATA_URL,
                                cameraDirection: 1, // "1" is used for front-facing camera and "0" is used for back-facing camera.
                                correctOrientation: true
                            });
                        }
                        else {
                            console.log('take');
                            $ionicLoading.hide();
                        }

                    }
                }
            });
        }
        else {
            $rootScope.currentUserLatitude = null;
            $rootScope.currentUserLongitude = null;
            $scope.empPhoto = "";
            console.log($rootScope.userSettings.TimeAttendanceSettings.AllowClockingWithoutCamera);
            if ($rootScope.userSettings.TimeAttendanceSettings.AllowClockingWithoutCamera) {
                $scope.empPhoto = "";
                $scope.doClockOut();
            }
            else { // open camera
                if (navigator && navigator.camera) {
                    navigator.camera.getPicture(function (data) {// on succsess
                        if (data.indexOf('base64') < 0) {
                            $scope.empPhoto = 'data:image/jpeg;base64,' + data;
                            //$scope.empPhoto = data;
                            $scope.doClockOut();
                        }
                        else {
                            $scope.empPhoto = data;
                            $scope.doClockOut();
                        }
                    }, function () {
                        console.log('cancelled');
                        $ionicLoading.hide();
                    }, {
                        sourceType: Camera.PictureSourceType.CAMERA,
                        quality: 50,
                        targetWidth: 140,
                        targetHeight: 140,
                        destinationType: Camera.DestinationType.DATA_URL,
                        cameraDirection: 1, // "1" is used for front-facing camera and "0" is used for back-facing camera.
                        correctOrientation: true
                    });
                }
                else {
                    console.log('take');
                    $ionicLoading.hide();
                }

            }
        }
    }

    $scope.doClockOut = function () {
        var str = $scope.empPhoto;
        str = str.substring(str.indexOf(",") + 1);
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
                    "EmployeeNotes": $scope.shiftNotes,
                    "Photo": str
                }
            }
        }
        console.log(JSON.stringify(req.data));
        // add true to use authentication token
        API.execute(req, true).then(function (_res) {
            console.log(JSON.stringify(_res.data));
            if (_res.data.code == 200) {
                $rootScope.UserIsInShift = false;
                console.log('pass');
                $scope.clockOut = false;
                $scope.breakOut = false;
                $ionicLoading.hide();
                if ($window.localStorage['IsTempLogin'] === 'true') {
                    
                } else {
                  $state.go('app.dashboard');
                }
            }
            else if (_res.data.code == 500) {
                $scope.clockOut = true;
                $scope.breakOut = false;
                $ionicLoading.hide();
                //$scope.errorMSG = 'you are already clocked in';
                console.log(_res.data.data);
                $rootScope.showToast(_res.data.data);
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
                        // Same Api Again
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
                                    "EmployeeNotes": $scope.shiftNotes,
                                    "Photo": str
                                },
                                "Confirmations": [{ "Code": 300 }]
                            }
                        }
                        console.log(JSON.stringify(req.data));
                        // add true to use authentication token
                        API.execute(req, true).then(function (_res) {
                            console.log(JSON.stringify(_res.data));
                            if (_res.data.code == 200) {
                                $rootScope.UserIsInShift = false;
                                console.log('pass');
                                $scope.clockOut = false;
                                $scope.breakOut = false;
                                $ionicLoading.hide();
                                $state.go('app.dashboard');
                            }
                            else if (_res.data.code == 500) {
                                $scope.clockOut = true;
                                $scope.breakOut = false;
                                $ionicLoading.hide();
                                //$scope.errorMSG = 'you are already clocked in';
                                console.log(_res.data.data);
                                $rootScope.showToast(_res.data.data);
                            }

                            else {
                                $scope.clockOut = true;
                                $scope.breakOut = false;
                                $ionicLoading.hide();
                                console.log('fail');
                                //$scope.errorMSG = _res.data.data;
                                console.log(_res.data.data);
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
            else {
                $scope.clockOut = true;
                $scope.breakOut = false;
                $ionicLoading.hide();
                console.log('fail');
                //$scope.errorMSG = _res.data.data;
                console.log(_res.data.data);
                $rootScope.showToast(_res.data.data);
            }
        },
          function (error) {
      API.showTokenError(error);
  });
    }
});




////new timer
////js
//var sec = 0;
//function pad(val) {
//    return val > 9 ? val : "0" + val;
//}
//var timer = setInterval(function () {
//    document.getElementById("seconds").innerHTML = pad(++sec % 60);
//    document.getElementById("minutes").innerHTML = pad(parseInt(sec / 60, 10));
//}, 1000);
//setTimeout(function () {
//    clearInterval(timer);
//}, 11000);

////html
//<span id="minutes">00</span>:<span id="seconds">00</span>