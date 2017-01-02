empTracker.controller("dashboardController", function ($scope, $state, $rootScope, $window, API, $ionicLoading) {
    var days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    var shortDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    var months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    var shortMonths = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

    $scope.totals = {
        'TotalShiftsScheduled': 0,
        'TotalShiftsWorked': 0,
        'NoShow': 0,
        'LateArrival': 0,
        'EarlyLeave': 0,
        'MissingClockOut': 0,
        'TotalHoursScheduled': 0,
        'TotalHoursWorked': 0
    };

    var formatedFirstDay, formatedLastday;
    $scope.$on('$ionicView.enter', function () {
        $rootScope.toggledrag = true;
        $scope.totals = {
            'TotalShiftsScheduled': 0,
            'TotalShiftsWorked': 0,
            'NoShow': 0,
            'LateArrival': 0,
            'EarlyLeave': 0,
            'MissingClockOut': 0,
            'TotalHoursScheduled': 0,
            'TotalHoursWorked': 0
        };
        // today
        var d = new Date();
        var todayname = days[d.getDay()];
        $scope.todayDateString = todayname + ', ' + months[d.getMonth()] + ' ' + d.getDate() + ', ' + d.getFullYear();

        var todayDate = d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate();
        $scope.todayDate = todayDate;

        $scope.currentTime = d.getHours() + ':' + d.getMinutes() + ':' + d.getSeconds();

        // this week first / end
        var intialDate = new Date(); // get current date

        var firstday = new Date(Date.parse(new Date(intialDate.setDate(intialDate.getDate() - intialDate.getDay())).toUTCString()));
        formatedFirstDay = API.convertLocalTimeToUTC(firstday);

        var lastday = new Date(Date.parse(new Date(intialDate.setDate((intialDate.getDate() - intialDate.getDay()) + 6)).toUTCString()));
        formatedLastday = API.convertLocalTimeToUTC(lastday);

        // show in page 
        $scope.firstDayOfWeek = shortDays[firstday.getDay()] + " " + firstday.getDate() + " " + shortMonths[firstday.getMonth()] + " ";
        $scope.lastDayOfWeek = " " + shortDays[lastday.getDay()] + " " + lastday.getDate() + " " + shortMonths[lastday.getMonth()] + " " + lastday.getFullYear();

        $scope.statistics = function () {
            $ionicLoading.show({
                content: 'Loading',
                animation: 'fade-in',
                showBackdrop: true,
                maxWidth: 200,
                showDelay: 0,
                template: '<i class="icon ion-loading-d"></i>'
            });
            console.log(API.convertLocalTimeToUTC(firstday));
            console.log(API.convertLocalTimeToUTC(lastday));
            var req = {
                method: 'GET',
                url: '/api/attendance/statistics?UtcStartDate=' + formatedFirstDay + '&UtcEndDate=' + formatedLastday,
                data: {}
            }
            // add true to use authentication token
            API.execute(req, true).then(function (_res) {
                console.log(_res);
                if (_res.data.code == 200) {
                    // fill data
                    console.log(_res.data.data);
                    $scope.totals = _res.data.data;
                    $ionicLoading.hide();
                }
                else {
                    $scope.totals = {
                        'TotalShiftsScheduled': 0,
                        'TotalShiftsWorked': 0,
                        'NoShow': 0,
                        'LateArrival': 0,
                        'EarlyLeave': 0,
                        'MissingClockOut': 0,
                        'TotalHoursScheduled': 0,
                        'TotalHoursWorked': 0
                    };
                    $ionicLoading.hide();
                }

            }, function (error) {
                API.showTokenError(error);
            });
        }
        $scope.thisWeekShifts = function () {
            $ionicLoading.show({
                content: 'Loading',
                animation: 'fade-in',
                showBackdrop: true,
                maxWidth: 200,
                showDelay: 0,
                template: '<i class="icon ion-loading-d"></i>'
            });

            var req = {
                method: 'GET',
                url: '/api/Roster?startDate=' + $scope.todayDate + '&endDate=' + $scope.todayDate,
                data: {}
            }
            // add true to use authentication token
            API.execute(req, true).then(function (_res) {
                console.log(_res);
                if (_res.data.code == 200) {
                    $scope.weeklyEventsArray = _res.data.data;
                    $scope.adjustData = function (event) {
                        $scope.todayShiftsArray = [];
                        var thedate = new Date(event.StartDate);
                        event.dayNumber = thedate.getDate();
                        event.dayName = (thedate.toString()).substring(0, 3);
                        event.formattedDate = thedate.getFullYear() + "-" + (thedate.getMonth() + 1) + "-" + thedate.getDate();
                    }
                    $ionicLoading.hide();
                }
                else {
                    $scope.weeklyEventsArray = '';
                    $ionicLoading.hide();
                }

            }, function (error) {
                API.showTokenError(error);
            });

        }
        $scope.statistics();
        $scope.thisWeekShifts();

        $scope.today = new Date();
        //var formatedTodayDate = $scope.today.getFullYear() + '-' + ($scope.today.getMonth() + 1) + '-' + $scope.today.getDate();

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
            console.log(_res);
            console.log(_res.data);
            console.log(_res.data.data.IsClockedIn);
            console.log(_res.data.data.IsClockedOut);
            if (_res.data.code == 200) {
                if (_res.data.data.IsClockedIn == true && _res.data.data.IsClockedOut == false) {
                    //if already clocked in 
                    $rootScope.UserIsInShift = true;
                }
                $ionicLoading.hide();
            }
            else if (_res.data.code == 404) {
                console.log(_res.data.data);
                $ionicLoading.hide();
            }
            else {
                console.log('error');
                $ionicLoading.hide();
            }
        }, function (error) {
            API.showTokenError(error);
        });

    });
    
    $scope.openmyaccount = function () {
        $state.go('app.myaccount');
    }
    $scope.showSubMenu = function () {
        $state.go('app.submenu');
    }
    $scope.notifications = function () {
        $state.go('app.notifications');
    }

});