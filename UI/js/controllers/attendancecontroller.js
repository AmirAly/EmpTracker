empTracker.controller("attendanceController", function ($scope, $state, $ionicPopup, $http, $rootScope, $ionicLoading, API, $window) {


    $scope.openmyaccount = function () {
        $state.go('app.myaccount');
    }
    $scope.showSubMenu = function () {
        $state.go('app.submenu');
    }
    $scope.notifications = function () {
        $state.go('app.notifications');
    }
    // A confirm dialog
    $scope.showConfirm = function () {
        var confirmPopup = $ionicPopup.confirm({
            title: 'Confirmation',
            template: 'Are you sure you want to check in?'
        });
        confirmPopup.then(function (res) {
            if (res) {
                console.log('You are sure');
            } else {
                console.log('You are not sure');
            }
        });
    };

    $scope.$on('$ionicView.enter', function () {
        $rootScope.toggledrag = true;
    });

    //////////////////////////////////////////////////////

    var intialDate = new Date(); // get current date
    var todayDate = new Date();  // get current date
    var shortMonths = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    var shortDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

    ////////////////  get first & last day of this week  ///////////////////////

    var firstday = new Date(Date.parse(new Date(intialDate.setDate(intialDate.getDate() - intialDate.getDay())).toUTCString()));
    var formatedFirstDay = firstday.getFullYear() + '-' + (firstday.getMonth() + 1) + '-' + firstday.getDate();

    var lastday = new Date(Date.parse(new Date(intialDate.setDate((intialDate.getDate() - intialDate.getDay()) + 6)).toUTCString()));
    var formatedLastday = lastday.getFullYear() + '-' + (lastday.getMonth() + 1) + '-' + lastday.getDate();

    // get week 7 days
    var todayUTC = new Date(Date.parse(new Date().toUTCString()));

    $scope.thisWeekDays = [];
    for (var i = 0; i < 7; i++) {
        var testDay = new Date(Date.parse(new Date(intialDate.setDate((intialDate.getDate() - intialDate.getDay()) + i)).toUTCString()));
        if (testDay.getDay() === todayUTC.getDay())
            $scope.thisWeekDays.push({ "id": i + 1, "month": shortMonths[testDay.getMonth()], "dayNumber": testDay.getDate(), "dayName": shortDays[testDay.getDay()], "fullDate": testDay, "selected": true });
        else
            $scope.thisWeekDays.push({ "id": i + 1, "month": shortMonths[testDay.getMonth()], "dayNumber": testDay.getDate(), "dayName": shortDays[testDay.getDay()], "fullDate": testDay, "selected": false });
    }
    console.log($scope.thisWeekDays);

    // select day
    $scope.selectDay = function (selectedDay) {
        for (var i = 0; i < $scope.thisWeekDays.length; i++) {
            var item = $scope.thisWeekDays[i];
            if (item.id == selectedDay.id) {
                item.selected = true;
                $scope.getDayAttendance(selectedDay.fullDate);
            } else {
                item.selected = false;
            }
        }
    }
    // send to function
    console.log("firstday  " + formatedFirstDay);
    console.log("lastday  " + formatedLastday);

    // fill first tab
    $scope.getDayAttendance = function (selectedDay) {
        var attendanceDay = selectedDay;
        var formatedAttendanceDay = attendanceDay.getFullYear() + '-' + (attendanceDay.getMonth() + 1) + '-' + attendanceDay.getDate();
        console.log(formatedAttendanceDay);
        var req = {
            method: 'GET',
            url: '/api/Attendance/ByEmployee?startDate=' + formatedAttendanceDay + '&endDate=' + formatedAttendanceDay,
            data: {}
        }
        $ionicLoading.show();
        // add true to use authentication token
        API.execute(req, true).then(function (_res) {
            if (_res.data.code == 200) {
                $scope.weeklyAttendanceArray = _res.data.data;
                $ionicLoading.hide();
            }
        }
        , function (error) {
            console.log(error);
            console.log(error.data); /* catch 400  Error here */
            $ionicLoading.hide();
            $window.localStorage['IsTempLogin'] = false;
            localStorage.clear();
            $state.go('login');
        });

    }
    $scope.getDayAttendance(todayUTC);


    $scope.fillWeeklyReportData = function (startDate, EndDate) {
        var req = {
            method: 'GET',
            url: '/api/Attendance/ByEmployee?startDate=' + startDate + '&endDate=' + EndDate,
            data: {}
        }
        $ionicLoading.show();
        var totalHRS = 0;
        var totalBreak = 0;
        $scope.totalHRSHours = 0;
        $scope.totalHRSMintes = 0;
        $scope.totalBreakHours = 0;
        $scope.totalBreakMintes = 0;
        // add true to use authentication token
        API.execute(req, true).then(function (_res) {
            if (_res.data.code == 200) {
                $scope.weeklyReportDataArray = [];
                console.log(_res.data.data);
                for (var i = 0; i < _res.data.data.length; i++) {
                    var attendanceDate = new Date(_res.data.data[i].ClockIn.ClockingTime);
                    var dayInMonth = attendanceDate.getDate() + '/' + (attendanceDate.getMonth() + 1);
                    var reportObj = { "dayName": shortDays[attendanceDate.getDay()], "dayInMonth": dayInMonth, "SiteName": _res.data.data[i].SiteName, "ClockIn": _res.data.data[i].ClockIn.ClockingTime, "ClockOut": _res.data.data[i].ClockOut.ClockingTime, "HRS": _res.data.data[i].TotalHours };
                    $scope.weeklyReportDataArray.push(reportObj);
                    // sum weekly hours
                    totalHRS = totalHRS + _res.data.data[i].DecimalTotalHours;
                    console.log(totalHRS);
                    $scope.totalHRSHours = parseInt(totalHRS);
                    $scope.totalHRSMintes = (((totalHRS % 1) * 60 / 100).toFixed(2)).slice(2);

                    // sum break hours
                    totalBreak = totalBreak + _res.data.data[i].DisplayBreakTime;
                    console.log(totalBreak);
                    $scope.totalBreakHours = parseInt(totalBreak);
                    $scope.totalBreakMintes = (((totalBreak % 1) * 60 / 100).toFixed(2)).slice(2);
                }
               
                $ionicLoading.hide();
            }
        }
        , function (error) {
            console.log(error);
            console.log(error.data); /* catch 400  Error here */
            $ionicLoading.hide();
            $window.localStorage['IsTempLogin'] = false;
            localStorage.clear();
            $state.go('login');
        });
    }
    // show in page
    var firstDayOfWeek = shortMonths[firstday.getMonth()] + " " + firstday.getDate();
    var lastDayOfWeek = shortMonths[lastday.getMonth()] + " " + lastday.getDate() + ", " + lastday.getFullYear();
    $scope.weekDate = firstDayOfWeek + ' - ' + lastDayOfWeek;
    console.log($scope.weekDate);

    ///////////////////////////////////////

    ////////////////  get first & last day of next week  ///////////////////////
    $scope.nextWeek = function () {
        console.log('next');
        var nextWeekFirstDay = new Date(intialDate.getFullYear(), intialDate.getMonth(), intialDate.getDate() - intialDate.getDay() + 7);
        var nextWeekLastDay = new Date(intialDate.getFullYear(), intialDate.getMonth(), intialDate.getDate() - intialDate.getDay() + 13);

        // show in page
        var firstDayOfWeek = shortMonths[nextWeekFirstDay.getMonth()] + " " + nextWeekFirstDay.getDate();
        var lastDayOfWeek = shortMonths[nextWeekLastDay.getMonth()] + " " + nextWeekLastDay.getDate() + ", " + nextWeekLastDay.getFullYear();

        $scope.weekDate = firstDayOfWeek + ' - ' + lastDayOfWeek;

        // send to function
        var formatedWeekFirstDay = nextWeekFirstDay.getFullYear() + '-' + (nextWeekFirstDay.getMonth() + 1) + '-' + nextWeekFirstDay.getDate();
        var formatedWeekLastDay = nextWeekLastDay.getFullYear() + '-' + (nextWeekLastDay.getMonth() + 1) + '-' + nextWeekLastDay.getDate();

        console.log("WeekFirstDay  " + formatedWeekFirstDay);
        console.log("WeekLastDay  " + formatedWeekLastDay);

        //fill data
        $scope.fillWeeklyReportData(formatedWeekFirstDay, formatedWeekLastDay);

        // update initial date for next time
        intialDate = new Date(Date.parse(new Date(todayDate.setDate((intialDate.getDate() - intialDate.getDay()) + 7)).toUTCString()));
    }
    ///////////////////////////////////////

    ////////////////  get first & last day of pre week  ///////////////////////
    $scope.preWeek = function () {
        console.log('pre');
        var preWeekFirstDay = new Date(intialDate.getFullYear(), intialDate.getMonth(), intialDate.getDate() - intialDate.getDay() - 7);
        var preWeekLastDay = new Date(intialDate.getFullYear(), intialDate.getMonth(), intialDate.getDate() - intialDate.getDay() - 1);

        // show in page
        var firstDayOfWeek = shortMonths[preWeekFirstDay.getMonth()] + " " + preWeekFirstDay.getDate();
        var lastDayOfWeek = shortMonths[preWeekLastDay.getMonth()] + " " + preWeekLastDay.getDate() + ", " + preWeekLastDay.getFullYear();

        $scope.weekDate = firstDayOfWeek + ' - ' + lastDayOfWeek;

        // send to function
        var formatedWeekFirstDay = preWeekFirstDay.getFullYear() + '-' + (preWeekFirstDay.getMonth() + 1) + '-' + preWeekFirstDay.getDate();
        var formatedWeekLastDay = preWeekLastDay.getFullYear() + '-' + (preWeekLastDay.getMonth() + 1) + '-' + preWeekLastDay.getDate();

        console.log("WeekFirstDay  " + formatedWeekFirstDay);
        console.log("WeekLastDay  " + formatedWeekLastDay);

        //fill data
        $scope.fillWeeklyReportData(formatedWeekFirstDay, formatedWeekLastDay);

        // update initial date for next time
        intialDate = new Date(Date.parse(new Date(todayDate.setDate((intialDate.getDate() - intialDate.getDay()) - 7)).toUTCString()));
    }
    ///////////////////////////////////////

    $scope.loadReportData = function () {
        // fill second tab
        $scope.fillWeeklyReportData(formatedFirstDay, formatedLastday);
    }

    var today = new Date();
    today = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
    $scope.today = today;

    //if (ionic.Platform.isAndroid()) {
    //    // get json from external file
    //    $http.get('/android_asset/www/json/attenance.json').then(function (data) {
    //        $scope.weeklyAttendanceArray = data.data.attenance;
    //        $scope.todayAttendanceArray = data.data.attenance;
    //    });
    //}
    //else {
    //    // get json from external file
    //    $http.get('/json/attenance.json').then(function (data) {
    //        $scope.weeklyAttendanceArray = data.data.attenance;
    //        $scope.todayAttendanceArray = data.data.attenance;
    //    });
    //}




});