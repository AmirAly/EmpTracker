empTracker.controller("unscheduledshiftController", function ($scope, $state, CallPerodicalUpdate, $rootScope, $ionicLoading, API, $ionicPopup, CurrentLocation) {

    $scope.openmyaccount = function () {
        $state.go('app.myaccount');
    }
    $scope.showSubMenu = function () {
        $state.go('app.submenu');
    }
    $scope.notifications = function () {
        $state.go('app.notifications');
    }
    $scope.$on('$ionicView.enter', function () {
        $scope.errorMSG = "";
        $scope.showClockInBtn = false;
        console.log($rootScope.EmpNo);
        $rootScope.toggledrag = true;
        var req = {
            method: 'GET',
            url: '/api/Attendance/GetSites?empNo=' + $rootScope.EmpNo,
            data: {}
        }
        $ionicLoading.show({
            content: 'Loading',
            animation: 'fade-in',
            showBackdrop: true,
            maxWidth: 200,
            showDelay: 0,
            template: '<i class="icon ion-loading-d"></i>'
        });
        // add true to use authentication token
        API.execute(req, true).then(function (_res) {
            console.log(_res);
            if (_res.data.code == 200) {
                $scope.sites = _res.data.data;
                console.log($scope.sites);
                $ionicLoading.hide();
            }
            else {
                console.log(_res.data.data);
                $ionicLoading.hide();
                $rootScope.showToast(_res.data.data);
            }
        }, function (error) {
            API.showTokenError(error);
        });
    });
   
    $scope.chooseSite = function (_site) {
        console.log(_site.SiteID);
        $scope.showClockInBtn = false;
        $scope.SiteID = _site.SiteID;
        var req = {
            method: 'GET',
            url: '/api/Attendance/GetTasks?siteID=' + _site.SiteID,
            data: {}
        }
        $ionicLoading.show({
            content: 'Loading',
            animation: 'fade-in',
            showBackdrop: true,
            maxWidth: 200,
            showDelay: 0,
            template: '<i class="icon ion-loading-d"></i>'
        });
        // add true to use authentication token
        API.execute(req, true).then(function (_res) {
            console.log(_res);
            if (_res.data.code == 200) {
                $scope.tasks = _res.data.data;
                console.log($scope.tasks);
                $ionicLoading.hide();
            }
            else {
                console.log(_res.data.data);
                $ionicLoading.hide();
                $rootScope.showToast(_res.data.data);
            }
        }, function (error) {
            API.showTokenError(error);
        });
    }

    $scope.chooseTask = function (_task) {
        console.log(_task.TaskCode);
        $scope.TaskCode = _task.TaskCode;
        $scope.showClockInBtn = true;
    }

    $scope.showClockInConfirmation = function () {
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

        $scope.today = new Date();
        var formatedTodayDateTime = $scope.today.getFullYear() + '-' + ($scope.today.getMonth() + 1) + '-' + $scope.today.getDate() + ' ' + $scope.today.getHours() + ':' + $scope.today.getMinutes() + ':' + $scope.today.getSeconds();
        console.log(formatedTodayDateTime);


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
                    "SiteID": $scope.SiteID,
                    "TaskCode": $scope.TaskCode,
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
                console.log(_res);
                if (_res.data.code == 200) {
                    $rootScope.UserIsInShift = true;
                    console.log('pass');
                    $ionicLoading.hide();
                    $state.go('app.shiftview');
                }
                else if (_res.data.code == 500) {
                    //$scope.errorMSG = 'you are already clocked in this shift.';
                    $ionicLoading.hide();
                }
                else if (_res.data.code == 400) {
                    //$scope.errorMSG = 'You are already clocked in a shift.';
                    $ionicLoading.hide();
                    console.log('fail');

                }
                else {
                    $scope.errorMSG = _res.data.data;
                    $ionicLoading.hide();
                    console.log('fail');
                    $rootScope.showToast(_res.data.data);
                }
            }, function (error) {
                API.showTokenError(error);
            });
          }
        });

        
    }
});