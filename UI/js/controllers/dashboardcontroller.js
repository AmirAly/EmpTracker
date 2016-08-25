empTracker.controller("dashboardController", function ($scope, $state, $rootScope, $window, API, $ionicLoading) {
    var days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    var shortDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    var months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    var shortMonths = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

    $scope.totals = {
        'TotalShiftsScheduled': 0,
        'TotalShiftsWorked': 0,
        'NoShow': 0,
        'LateArrival': 1,
        'EarlyLeave': 0,
        'MissingClockOut': 0,
        'TotalHoursScheduled': 0,
        'TotalHoursWorked': 0
    };
    

    $scope.$on('$ionicView.enter', function () {
        $rootScope.toggledrag = true;
        // today
        var d = new Date();
        var todayname = days[d.getDay()];
        var todaymonthname = months[d.getMonth()];
        $scope.todayDateString = todayname + ', ' + todaymonthname + d.getDate() + ', ' + d.getFullYear();

        var todayDate = d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate();
        $scope.todayDate = todayDate;

        // this week first / end
        var intialDate = new Date(); // get current date

        var firstday = new Date(Date.parse(new Date(intialDate.setDate(intialDate.getDate() - intialDate.getDay())).toUTCString()));
        var formatedFirstDay = firstday.getFullYear() + '-' + (firstday.getMonth() + 1) + '-' + firstday.getDate();

        var lastday = new Date(Date.parse(new Date(intialDate.setDate((intialDate.getDate() - intialDate.getDay()) + 6)).toUTCString()));
        var formatedLastday = lastday.getFullYear() + '-' + (lastday.getMonth() + 1) + '-' + lastday.getDate();

        // show in page 
        $scope.firstDayOfWeek = shortDays[firstday.getDay()] + " " + firstday.getDate() + " " + shortMonths[firstday.getMonth()] + " ";
        $scope.lastDayOfWeek = " " + shortDays[lastday.getDay()] + " " + lastday.getDate() + " " + shortMonths[lastday.getMonth()] + " " + lastday.getFullYear();

        // this week shifts
        $scope.thisWeek = function () {
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
                url: '/api/Roster?startDate=' + formatedFirstDay + '&endDate=' + formatedLastday + '',
                data: {}
            }
            // add true to use authentication token
            API.execute(req, true).then(function (_res) {
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
                console.log(error);
                console.log(error.data); /* catch 400  Error here */
                $ionicLoading.hide();
                $window.localStorage['IsTempLogin'] = false;
                localStorage.clear();
                $state.go('login');
            });

        }
        $scope.thisWeek();

        $scope.statistiics = function () {
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
                url: '/api/Roster?startDate=' + formatedFirstDay + '&endDate=' + formatedLastday + '',
                data: {}
            }
            // add true to use authentication token
            API.execute(req, true).then(function (_res) {
                if (_res.data.code == 200) {
                    // fill data
                    $scope.totals = {
                        'TotalShiftsScheduled': 0,
                        'TotalShiftsWorked': 0,
                        'NoShow': 0,
                        'LateArrival': 1,
                        'EarlyLeave': 0,
                        'MissingClockOut': 0,
                        'TotalHoursScheduled': 0,
                        'TotalHoursWorked': 0
                    };
                    $ionicLoading.hide();
                }
                else {
                    $scope.totals = {
                        'TotalShiftsScheduled': 0,
                        'TotalShiftsWorked': 0,
                        'NoShow': 0,
                        'LateArrival': 1,
                        'EarlyLeave': 0,
                        'MissingClockOut': 0,
                        'TotalHoursScheduled': 0,
                        'TotalHoursWorked': 0
                    };
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