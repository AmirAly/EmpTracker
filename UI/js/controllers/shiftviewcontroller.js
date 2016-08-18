empTracker.controller("shiftviewController", function ($scope, $state, $ionicPopup, $timeout, $rootScope, $stateParams, API, $ionicLoading, $window) {
    //$scope.shiftNotes = 'teext1\nteext2\nteext3\nteext4\nteext5\nteext6';
    $scope.$on('$ionicView.enter', function () {
        $scope.errorMSG = "";
        console.log($window.localStorage['IsTempLogin']);
        console.log($stateParams.shiftid);

        $scope.today = new Date();
        console.log($scope.today.toISOString());
        var formatedTodayDate = $scope.today.getFullYear() + '-' + ($scope.today.getMonth() + 1) + '-' + $scope.today.getDate();
        // use var today date with current time instead of $scope.today.toISOString()
        //..

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
                url: '/api/Roster/Next?currentTime=' + formatedTodayDate,
                data: {}
            }
            // add true to use authentication token
            API.execute(req, true).then(function (_res) {
                console.log(_res.data);
                if (_res.data.code == 200) {
                    $scope.ShiftId = _res.data.data.ShiftId;
                    $scope.pageTitle = _res.data.data.TaskName;
                    var StartingDay = new Date(new Date(_res.data.data.StartDate).getFullYear(), new Date(_res.data.data.StartDate).getMonth(), new Date(_res.data.data.StartDate).getDate());
                    $scope.shiftDate = shortMonths[StartingDay.getMonth()] + " " + StartingDay.getDate() + " , " + StartingDay.getFullYear();
                    $scope.startDate = _res.data.data.StartDate;
                    $scope.endDate = _res.data.data.EndDate;
                    $scope.shiftBreak = _res.data.data.BreakDuration;
                    $scope.shiftSite = _res.data.data.ShortLocationName;
                    $scope.shiftaddress = _res.data.data.LocationName;
                    $scope.shiftNotes = _res.data.data.NotesToEmployee;
                    $ionicLoading.hide();
                }
                else {
                    $scope.pageTitle = "No upcoming shifts";
                    $ionicLoading.hide();
                }
            }, function (error) {
                console.log(error);
                if (error.status == 401 && error.statusText == "Unauthorized") { /* catch 401  Error here */
                    console.log(error.data.Message);
                    // should use refresh token here
                    //..
                    $ionicLoading.show({
                        scope: $scope,
                        templateUrl: 'templates/tokenexpired.html',
                        animation: 'slide-in-up'
                    });

                    $timeout(function () {
                        $ionicLoading.hide();
                        // logout
                        $window.localStorage['IsTempLogin'] = false;
                        localStorage.clear();
                        $state.go('login');
                    }, 5000);
                }
                else {
                    $ionicLoading.hide();
                }

            });
        }
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
                url: '/api/Roster/Next?currentTime=' + formatedTodayDate,
                data: {}
            }
            // add true to use authentication token
            API.execute(req, true).then(function (_res) {
                console.log(_res.data);
                if (_res.data.code == 200) {
                    $scope.ShiftId = _res.data.data.ShiftId;
                    $scope.pageTitle = _res.data.data.TaskName;
                    var StartingDay = new Date(new Date(_res.data.data.StartDate).getFullYear(), new Date(_res.data.data.StartDate).getMonth(), new Date(_res.data.data.StartDate).getDate());
                    $scope.shiftDate = shortMonths[StartingDay.getMonth()] + " " + StartingDay.getDate() + " , " + StartingDay.getFullYear();
                    $scope.startDate = _res.data.data.StartDate;
                    $scope.endDate = _res.data.data.EndDate;
                    $scope.shiftBreak = _res.data.data.BreakDuration;
                    $scope.shiftSite = _res.data.data.ShortLocationName;
                    $scope.shiftaddress = _res.data.data.LocationName;
                    $scope.shiftNotes = _res.data.data.NotesToEmployee;
                    $ionicLoading.hide();
                }
                else {
                    console.log('else');
                    $scope.pageTitle = "No upcoming shifts";
                    $ionicLoading.hide();
                }
            }, function (error) {
                console.log(error);
                console.log(error.data); /* catch 400  Error here */
                $ionicLoading.hide();
                $window.localStorage['IsTempLogin'] = false;
                localStorage.clear();
                $state.go('login');
            });
        }
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
                    $scope.ShiftId = _res.data.data.ShiftId;
                    $scope.pageTitle = _res.data.data.TaskName;
                    var StartingDay = new Date(new Date(_res.data.data.StartDate).getFullYear(), new Date(_res.data.data.StartDate).getMonth(), new Date(_res.data.data.StartDate).getDate());
                    $scope.shiftDate = shortMonths[StartingDay.getMonth()] + " " + StartingDay.getDate() + " , " + StartingDay.getFullYear();
                    $scope.startDate = _res.data.data.StartDate;
                    $scope.endDate = _res.data.data.EndDate;
                    $scope.shiftBreak = _res.data.data.BreakDuration;
                    $scope.shiftSite = _res.data.data.ShortLocationName;
                    $scope.shiftaddress = _res.data.data.LocationName;
                    $scope.shiftNotes = _res.data.data.NotesToEmployee;
                    $ionicLoading.hide();
                }
                else {
                    $scope.pageTitle = "No upcoming shifts";
                    $ionicLoading.hide();
                }
            }, function (error) {
                console.log(error);
                console.log(error.data); /* catch 400  Error here */
                $ionicLoading.hide();
                $window.localStorage['IsTempLogin'] = false;
                localStorage.clear();
                $state.go('login');
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
        $state.go('app.viewmap');
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
                $scope.clockOut = false;
                $scope.breakOut = false;

            } else {
                console.log('You are not sure Out');
            }
        });
    };
    $scope.breakDurationEnd = false;
    var count = true;
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
                "ShiftID": 'ffa68d03-0fa8-4344-aca6-febb0b33dae9',
                "Notes": "",
                "Clocking": {
                    "ClockingTime": $scope.today.toISOString(),
                    "PunchedVia": "MOB"
                }
            }
        }
        console.log(req.data);
        // add true to use authentication token
        API.execute(req, true).then(function (_res) {
            console.log(_res.data);
            if (_res.data.code == 200) {
                $scope.breakDurationEnd = false;
                $scope.breakOut = true;
                count = true;
                $scope.timecounter = 0;
                $scope.countdown = function () {
                    stopped = $timeout(function () {
                        $scope.timecounter++;
                        if ($scope.timecounter != 0 && $scope.minutes <= 44 && count == true && $scope.timecounter <= 90) {
                            console.log($scope.timecounter);
                            $scope.minutes = parseInt(($scope.timecounter / 60));
                            $scope.seconds = ($scope.timecounter % 60);
                            console.log($scope.minutes);
                            console.log($scope.seconds);
                            $scope.countdown();
                        }
                        else {
                            console.log('else');
                            $scope.breakDurationEnd = true;
                            return false
                        };
                    }, 1000);
                };
                $scope.countdown();
                console.log('pass');
                $ionicLoading.hide();
            }
            else {
                console.log('fail');
                $ionicLoading.hide();
            }
        }, function (error) {
            console.log(error);
            if (error.status == 401 && error.statusText == "Unauthorized") { /* catch 401  Error here */
                console.log(error.data.Message);
                // should use refresh token here
                //..
                $ionicLoading.show({
                    scope: $scope,
                    templateUrl: 'templates/tokenexpired.html',
                    animation: 'slide-in-up'
                });

                $timeout(function () {
                    $ionicLoading.hide();
                    // logout
                    $window.localStorage['IsTempLogin'] = false;
                    localStorage.clear();
                    $state.go('login');
                }, 5000);
            }
            else {
                $ionicLoading.hide();
            }

        });




    }
    $scope.finishBreak = function () {
        count = false;
        $scope.timecounter = -1;
        $scope.minutes = 0;
        $scope.seconds = 0;
        $scope.breakOut = false;
    }

    $scope.logout = function () {
        $window.localStorage['IsTempLogin'] = false;
        localStorage.clear();
        $state.go('login');
    }

    $scope.clockInShift = function () {
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
            url: '/api/Attendance?action=in',
            data: {
                "RosterShiftID": $scope.ShiftId,
                "Notes": "",
                "Clocking": {
                    "ClockingTime": $scope.today.toISOString(),
                    "Latitude": -33.869962,
                    "Longitude": 151.202169,
                    "GPSTrackingMethod": "Network",
                    "PunchedVia": "MOB",
                    "EmployeeNotes": "",
                    "Photo": ""
                }
            }
        }
        console.log(req.data);
        // add true to use authentication token
        API.execute(req, true).then(function (_res) {
            console.log(_res.data);
            if (_res.data.code == 200) {
                console.log('pass');
                $scope.clockOut = true;
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
        }, function (error) {
            console.log(error);
            if (error.status == 401 && error.statusText == "Unauthorized") { /* catch 401  Error here */
                console.log(error.data.Message);
                // should use refresh token here
                //..
                $ionicLoading.show({
                    scope: $scope,
                    templateUrl: 'templates/tokenexpired.html',
                    animation: 'slide-in-up'
                });

                $timeout(function () {
                    $ionicLoading.hide();
                    // logout
                    $window.localStorage['IsTempLogin'] = false;
                    localStorage.clear();
                    $state.go('login');
                }, 5000);
            }
            else {
                $ionicLoading.hide();
            }

        });
    }
});