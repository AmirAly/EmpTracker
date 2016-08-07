empTracker.controller("shiftviewController", function ($scope, $state, $ionicPopup, $timeout, $rootScope, $stateParams, API, $ionicLoading, $window) {
    $scope.shiftNotes = 'teext1\nteext2\nteext3\nteext4\nteext5\nteext6';
    $scope.$on('$ionicView.enter', function () {

        console.log($window.localStorage['IsTempLogin']);
        console.log($stateParams.shiftid);
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
                url: '/api/Roster/Next?currentTime=' + 'Mon, 15 Aug 2016 06:53:56 GMT',
                data: {}
            }
            // add true to use authentication token
            API.execute(req, true).then(function (_res) {
                console.log(_res.data);
                if (_res.data.code = 200) {
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
                url: '/api/Roster/Next?currentTime=' + 'Mon, 15 Aug 2016 06:53:56 GMT',
                data: {}
            }
            // add true to use authentication token
            API.execute(req, true).then(function (_res) {
                console.log(_res.data);
                if (_res.data.code = 200) {
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
            }, function (error) {
                console.log(error);
                if (error.status == 401 && error.statusText == "Unauthorized") { /* catch 401  Error here */
                    console.log(error.data.Message);
                    // should use refresh token here
                    //..

                }
                $ionicLoading.hide();
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
                if (_res.data.code = 200) {
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
                $scope.clockOut = true;
                $scope.breakOut = false;
            } else {
                console.log('You are not sure In');
            }
        });
    };

    $scope.showConfirmOut = function () {
        var confirmPopup = $ionicPopup.confirm({
            cssClass: 'redPopup',
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
    var count = true;
    $scope.takeBreak = function () {
        $scope.breakOut = true;

        count = true;
        $scope.timecounter = 0;
        $scope.countdown = function () {
            stopped = $timeout(function () {
                $scope.timecounter++;
                if ($scope.timecounter != 0 && count == true && $scope.timecounter <= 90) {
                    console.log($scope.timecounter);
                    $scope.minutes = parseInt(($scope.timecounter / 60));
                    $scope.seconds = ($scope.timecounter % 60);
                    console.log($scope.minutes);
                    console.log($scope.seconds);
                    $scope.countdown();
                }
                else return false;
            }, 1000);
        };
        $scope.countdown();
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
});