empTracker.controller("homeController", function ($scope, $state, $ionicTabsDelegate, $timeout, $http, $ionicPopup, $rootScope, API, $ionicLoading, $window, $location) {
    // run controller code EVERY time the view is enterd
    $scope.$on('$ionicView.enter', function test() {
        $scope.toggleMenu = function () {
            angular.element(document.querySelector('#menuBtn')).triggerHandler('click');
        }
        //console.log('enter'); 
        $rootScope.toggledrag = false;

        $scope.openmyaccount = function () {
            $state.go('app.myaccount');
        }

        $scope.notifications = function () {
            $state.go('app.notifications');
        }
        $scope.showSubMenu = function () {
            $state.go('app.submenu');
        }
        $scope.shiftView = function (_shiftId) {
            $state.go('app.shiftview', { shiftid: _shiftId });
        }

        $scope.goToUnscheduledShift = function () {
            $state.go('app.unscheduledshift');
        }

        var days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
        var months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
        var shortMonths = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

        var intialDate = new Date(); // get current date

        $scope.getTodayEvents = function () {
            $ionicLoading.show({
                content: 'Loading',
                animation: 'fade-in',
                showBackdrop: true,
                maxWidth: 200,
                showDelay: 0,
                template: '<i class="icon ion-loading-d"></i>'
            });
            var thisday = new Date();
            var formatedFirstDay = thisday.getFullYear() + '-' + (thisday.getMonth() + 1) + '-' + thisday.getDate();
            var req = {
                method: 'GET',
                url: '/api/Roster?startDate=' + formatedFirstDay + '&endDate=' + formatedFirstDay + '',
                data: {}
            }
            // add true to use authentication token
            API.execute(req, true).then(function (_res) {
                console.log(_res);
                if (_res.data.code == 200) {
                    $scope.todayEventsArray = _res.data.data;
                    $ionicLoading.hide();
                } else {
                    $ionicLoading.hide();
                    $scope.todayEventsArray = [];
                    console.log(_res.data.data);
                    $rootScope.showToast(_res.data.data);

                }
            }
            , function (error) {
                API.showTokenError(error);
            });
        }
        $scope.getTodayEvents();
        ////////////////  get first & last day of this week  ///////////////////////
        $scope.thisWeek = function () {
            $ionicLoading.show({
                content: 'Loading',
                animation: 'fade-in',
                showBackdrop: true,
                maxWidth: 200,
                showDelay: 0,
                template: '<i class="icon ion-loading-d"></i>'
            });
            var firstday, lastday, intialDate;
            if ($rootScope.userSettings.GeneralSettings.WeekStart == "MON") {
                intialDate = $rootScope.mondayWeekStart._d;
                firstday = $rootScope.mondayWeekStart._d;
                lastday = $rootScope.mondayWeekEnd._d;
            }
            else {
                intialDate = $rootScope.sundayWeekStart._d;
                firstday = $rootScope.sundayWeekStart._d;
                lastday = $rootScope.sundayWeekEnd._d;
            }

            //var firstday = new Date(Date.parse(new Date(intialDate.setDate(intialDate.getDate() - intialDate.getDay())).toUTCString()));
            //var formatedFirstDay = firstday.getFullYear() + '-' + (firstday.getMonth() + 1) + '-' + firstday.getDate();

            //var lastday = new Date(Date.parse(new Date(intialDate.setDate((intialDate.getDate() - intialDate.getDay()) + 6)).toUTCString()));
            //var formatedLastday = lastday.getFullYear() + '-' + (lastday.getMonth() + 1) + '-' + lastday.getDate();
            var formatedFirstDay = firstday.getFullYear() + '-' + (firstday.getMonth() + 1) + '-' + firstday.getDate();
            var formatedLastday = lastday.getFullYear() + '-' + (lastday.getMonth() + 1) + '-' + lastday.getDate();

            // show in page
            $scope.firstDayOfWeek = shortMonths[firstday.getMonth()] + " " + firstday.getDate();
            $scope.lastDayOfWeek = shortMonths[lastday.getMonth()] + " " + lastday.getDate() + "," + lastday.getFullYear();


            var req = {
                method: 'GET',
                url: '/api/Roster?startDate=' + formatedFirstDay + '&endDate=' + formatedLastday + '',
                data: {}
            }
            // add true to use authentication token
            API.execute(req, true).then(function (_res) {
                if (_res.data.code == 200) {
                    $scope.$broadcast('scroll.refreshComplete');
                    $scope.weeklyEventsArray = _res.data.data;
                    $scope.weeklyTotalHours = 0;
                    for (var i = 0; i < $scope.weeklyEventsArray.length; i++) {
                        //console.log($scope.weeklyEventsArray[i].TotalHours);
                        $scope.weeklyTotalHours = $scope.weeklyTotalHours + $scope.weeklyEventsArray[i].TotalHours;
                    }
                    $scope.weekDate = $scope.firstDayOfWeek + ' - ' + $scope.lastDayOfWeek;
                    $ionicLoading.hide();
                }
                else {
                    $ionicLoading.hide();
                    $scope.weeklyEventsArray = '';
                    $scope.weeklyTotalHours = 0;
                    console.log(_res.data.data);
                    $rootScope.showToast(_res.data.data);
                }

            }, function (error) {
                API.showTokenError(error);
            });


        }
        $scope.thisWeek();
        ///////////////////////////////////////

        ////////////////  get first & last day of next week  ///////////////////////
        $scope.nextWeek = function () {
            $ionicLoading.show({
                content: 'Loading',
                animation: 'fade-in',
                showBackdrop: true,
                maxWidth: 200,
                showDelay: 0,
                template: '<i class="icon ion-loading-d"></i>'
            });

            var nextWeekFirstDay, nextWeekLastDay;
            if ($rootScope.userSettings.GeneralSettings.WeekStart == "MON") {
                nextWeekFirstDay = moment(intialDate).isoWeekday(1).startOf('isoweek').add(7, 'days');
                nextWeekLastDay = moment(intialDate).isoWeekday(1).startOf('isoweek').add(13, 'days');
            }
            else {
                nextWeekFirstDay = moment(intialDate).isoWeekday(1).startOf('isoweek').subtract(1, 'days').add(7, 'days');
                nextWeekLastDay = moment(intialDate).isoWeekday(1).startOf('isoweek').subtract(1, 'days').add(13, 'days');
            }
            console.log(nextWeekFirstDay);
            // show in page
            var firstDayOfWeek = shortMonths[nextWeekFirstDay._d.getMonth()] + " " + nextWeekFirstDay._d.getDate();
            var lastDayOfWeek = shortMonths[nextWeekLastDay._d.getMonth()] + " " + nextWeekLastDay._d.getDate() + ", " + nextWeekLastDay._d.getFullYear();
            console.log(firstDayOfWeek);


            // send to function
            var formatedWeekFirstDay = nextWeekFirstDay._d.getFullYear() + '-' + (nextWeekFirstDay._d.getMonth() + 1) + '-' + nextWeekFirstDay._d.getDate();
            var formatedWeekLastDay = nextWeekLastDay._d.getFullYear() + '-' + (nextWeekLastDay._d.getMonth() + 1) + '-' + nextWeekLastDay._d.getDate();

            //var nextWeekFirstDay = new Date(intialDate.getFullYear(), intialDate.getMonth(), intialDate.getDate() - intialDate.getDay() + 7);
            //var nextWeekLastDay = new Date(intialDate.getFullYear(), intialDate.getMonth(), intialDate.getDate() - intialDate.getDay() + 13);

            //// show in page
            //$scope.firstDayOfWeek = shortMonths[nextWeekFirstDay.getMonth()] + " " + nextWeekFirstDay.getDate();
            //$scope.lastDayOfWeek = shortMonths[nextWeekLastDay.getMonth()] + " " + nextWeekLastDay.getDate() + "," + nextWeekLastDay.getFullYear();

            //// send to function
            //var formatedWeekFirstDay = nextWeekFirstDay.getFullYear() + '-' + (nextWeekFirstDay.getMonth() + 1) + '-' + nextWeekFirstDay.getDate();
            //var formatedWeekLastDay = nextWeekLastDay.getFullYear() + '-' + (nextWeekLastDay.getMonth() + 1) + '-' + nextWeekLastDay.getDate();

            var req = {
                method: 'GET',
                url: '/api/Roster?startDate=' + formatedWeekFirstDay + '&endDate=' + formatedWeekLastDay + '',
                data: {}
            }
            // add true to use authentication token
            API.execute(req, true).then(function (_res) {
                if (_res.data.code == 200) {
                    $scope.weeklyEventsArray = _res.data.data;
                    $scope.weeklyTotalHours = 0;
                    for (var i = 0; i < $scope.weeklyEventsArray.length; i++) {
                        //console.log($scope.weeklyEventsArray[i].TotalHours);
                        $scope.weeklyTotalHours = $scope.weeklyTotalHours + $scope.weeklyEventsArray[i].TotalHours;
                    }
                    $scope.weekDate = firstDayOfWeek + ' - ' + lastDayOfWeek;
                    $ionicLoading.hide();
                }
                else {
                    $ionicLoading.hide();
                    $scope.weeklyEventsArray = '';
                    $scope.weeklyTotalHours = 0;
                    console.log(_res.data.data);
                    $rootScope.showToast(_res.data.data);
                }
            }, function (error) {
                API.showTokenError(error);
            });

            // update initial date for next time
            intialDate = new Date(Date.parse(new Date(intialDate.setDate((intialDate.getDate() - intialDate.getDay()) + 7)).toUTCString()));
        }
        ///////////////////////////////////////

        ////////////////  get first & last day of pre week  ///////////////////////
        $scope.preWeek = function () {
            $ionicLoading.show({
                content: 'Loading',
                animation: 'fade-in',
                showBackdrop: true,
                maxWidth: 200,
                showDelay: 0,
                template: '<i class="icon ion-loading-d"></i>'
            });

            var preWeekFirstDay, preWeekLastDay;
            if ($rootScope.userSettings.GeneralSettings.WeekStart == "MON") {
                preWeekFirstDay = moment(intialDate).isoWeekday(1).startOf('isoweek').subtract(7, 'days');
                preWeekLastDay = moment(intialDate).isoWeekday(1).startOf('isoweek').subtract(1, 'days');
            }
            else {
                preWeekFirstDay = moment(intialDate).isoWeekday(1).startOf('isoweek').subtract(1, 'days').subtract(7, 'days');
                preWeekLastDay = moment(intialDate).isoWeekday(1).startOf('isoweek').subtract(1, 'days').subtract(1, 'days');
            }
            console.log(preWeekFirstDay);

            // show in page
            var firstDayOfWeek = shortMonths[preWeekFirstDay._d.getMonth()] + " " + preWeekFirstDay._d.getDate();
            var lastDayOfWeek = shortMonths[preWeekLastDay._d.getMonth()] + " " + preWeekLastDay._d.getDate() + ", " + preWeekLastDay._d.getFullYear();



            // send to function
            var formatedWeekFirstDay = preWeekFirstDay._d.getFullYear() + '-' + (preWeekFirstDay._d.getMonth() + 1) + '-' + preWeekFirstDay._d.getDate();
            var formatedWeekLastDay = preWeekLastDay._d.getFullYear() + '-' + (preWeekLastDay._d.getMonth() + 1) + '-' + preWeekLastDay._d.getDate();

            //var preWeekFirstDay = new Date(intialDate.getFullYear(), intialDate.getMonth(), intialDate.getDate() - intialDate.getDay() - 7);
            //var preWeekLastDay = new Date(intialDate.getFullYear(), intialDate.getMonth(), intialDate.getDate() - intialDate.getDay() - 1);

            //// show in page
            //$scope.firstDayOfWeek = shortMonths[preWeekFirstDay.getMonth()] + " " + preWeekFirstDay.getDate();
            //$scope.lastDayOfWeek = shortMonths[preWeekLastDay.getMonth()] + " " + preWeekLastDay.getDate() + "," + preWeekLastDay.getFullYear();

            //// send to function
            //var formatedWeekFirstDay = preWeekFirstDay.getFullYear() + '-' + (preWeekFirstDay.getMonth() + 1) + '-' + preWeekFirstDay.getDate();
            //var formatedWeekLastDay = preWeekLastDay.getFullYear() + '-' + (preWeekLastDay.getMonth() + 1) + '-' + preWeekLastDay.getDate();

            var req = {
                method: 'GET',
                url: '/api/Roster?startDate=' + formatedWeekFirstDay + '&endDate=' + formatedWeekLastDay + '',
                data: {}
            }
            // add true to use authentication token
            API.execute(req, true).then(function (_res) {
                if (_res.data.code == 200) {
                    $scope.weeklyEventsArray = _res.data.data;
                    $scope.weeklyTotalHours = 0;
                    for (var i = 0; i < $scope.weeklyEventsArray.length; i++) {
                        //console.log($scope.weeklyEventsArray[i].TotalHours);
                        $scope.weeklyTotalHours = $scope.weeklyTotalHours + $scope.weeklyEventsArray[i].TotalHours;
                    }
                    $scope.weekDate = firstDayOfWeek + ' - ' + lastDayOfWeek;
                    $ionicLoading.hide();
                }
                else {
                    $ionicLoading.hide();
                    $scope.weeklyEventsArray = '';
                    $scope.weeklyTotalHours = 0;
                    console.log(_res.data.data);
                    $rootScope.showToast(_res.data.data);
                }
            }, function (error) {
                API.showTokenError(error);
            });

            // update initial date for next time
            intialDate = new Date(Date.parse(new Date(intialDate.setDate((intialDate.getDate() - intialDate.getDay()) - 7)).toUTCString()));
        }
        ///////////////////////////////////////


        var today = new Date();
        var todayDate = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
        $scope.todayDate = todayDate;
        var d = new Date();
        var todayname = days[d.getDay()];
        var todaymonthname = months[d.getMonth()];
        $scope.todayDateString = todayname + ', ' + todaymonthname + d.getDate() + ', ' + d.getFullYear();

        var thisdate = new Date(), y = thisdate.getFullYear(), m = thisdate.getMonth();
        var firstDayMonth = new Date(y, m, 1);
        var lastDayMonth = new Date(y, m + 1, 0);

        var firstDayMonthFormated = firstDayMonth.getFullYear() + '-' + (firstDayMonth.getMonth() + 1) + '-' + firstDayMonth.getDate();
        var lastDayMonthFormated = lastDayMonth.getFullYear() + '-' + (lastDayMonth.getMonth() + 1) + '-' + lastDayMonth.getDate();

        //get calendar dates
        $scope.getCalendarEvents = function (firstDayMonth, lastDayMonth) {

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
                url: '/api/Roster/Monthly?startDate=' + firstDayMonth + '&endDate=' + lastDayMonth + '',
                data: {}
            }
            console.log(req);
            // add true to use authentication token
            API.execute(req, true).then(function (_res) {
                if (_res.data.code == 200) {

                    $scope.events = _res.data.data;

                    //console.log($scope.events);
                    if ($scope.events != 'You are not authorized to view your schedule in this time range') {
                        // prepare data for shift template
                        $scope.adjustData = function (event) {
                            $scope.todayShiftsArray = [];
                            var thedate = new Date(event.StartDate);
                            event.dayNumber = thedate.getDate();
                            event.dayName = (thedate.toString()).substring(0, 3);
                            event.formattedDate = thedate.getFullYear() + "-" + (thedate.getMonth() + 1) + "-" + thedate.getDate();

                            for (var i = 0; i < $scope.events.length; i++) {
                                if ($scope.events[i].StartDate == todayDate) {
                                    $scope.todayShiftsArray.push($scope.events[i]);
                                    //console.log($scope.todayShiftsArray);
                                }
                            }
                            $ionicLoading.hide();
                        }
                    }
                    else {
                        $ionicLoading.hide();
                        $scope.events = [];
                        console.log('no data found');
                        console.log(_res.data.data);
                        $rootScope.showToast(_res.data.data);
                    }
                } else {
                    $scope.events = [];
                }

            }, function (error) {
                API.showTokenError(error);
            });
        }
        $scope.getCalendarEvents(firstDayMonthFormated, lastDayMonthFormated);
        //////////////////////////////////////////////////////////////////////////////
        if ($rootScope.userSettings.GeneralSettings.WeekStart == "MON")
            $scope.startIsMonday = true;
        else $scope.startIsMonday = false;
        $scope.calendarEvents = [];
        // Calendar
        // With "use strict", Dates can be passed ONLY as strings (ISO format: YYYY-MM-DD)
        "use strict";
        $scope.options = {
            defaultDate: todayDate,
            minDate: "2000-01-01",
            maxDate: "2100-12-31",
            disabledDates: [],
            dayNamesLength: 1, // 1 for "M", 2 for "Mo", 3 for "Mon"; 9 will show full day names. Default is 1.
            mondayIsFirstDay: $scope.startIsMonday, //set monday as first day of week if :true , Default is false
            eventClick: function (date) { // called before dateClick and only if clicked day has events
                $scope.calendarEvents = [];
            },
            dateClick: function (date) { // called every time a day is clicked
                $ionicLoading.show({
                    content: 'Loading',
                    animation: 'fade-in',
                    showBackdrop: true,
                    maxWidth: 200,
                    showDelay: 0,
                    template: '<i class="icon ion-loading-d"></i>'
                });
                //console.log(date);
                var formattedToday = date.year + "-" + date._month + "-" + date.day;
                $scope.calendarEvents = [];
                //console.log(formattedToday);
                if ($scope.events) {
                    for (var i = 0; i < $scope.events.length; i++) {
                        var eventDate = new Date($scope.events[i].StartDate);
                        var formatedEventDateUTC = new Date(Date.parse(new Date(eventDate).toUTCString()));
                        var formatedEventDay = formatedEventDateUTC.getFullYear() + '-' + (formatedEventDateUTC.getMonth() + 1) + '-' + formatedEventDateUTC.getDate();
                        if (formattedToday == formatedEventDay) {
                            $scope.calendarEvents.push($scope.events[i]);
                            //console.log($scope.calendarEvents);
                        }

                    }
                    $scope.loadCalendarEvents();
                    $ionicLoading.hide();
                }
                else {
                    $scope.loadCalendarEvents();
                    $ionicLoading.hide();
                }

            },
            changeMonth: function (month, year) {
                $ionicLoading.show({
                    content: 'Loading',
                    animation: 'fade-in',
                    showBackdrop: true,
                    maxWidth: 200,
                    showDelay: 0,
                    template: '<i class="icon ion-loading-d"></i>'
                });

                var preMonthFirstDay = new Date(year, month.index, 1);
                var preMonthLastDay = new Date(year, month.index + 1, 0);

                // send to function
                var formatedMonthFirstDay = preMonthFirstDay.getFullYear() + '-' + (preMonthFirstDay.getMonth() + 1) + '-' + preMonthFirstDay.getDate();
                var formatedMonthLastDay = preMonthLastDay.getFullYear() + '-' + (preMonthLastDay.getMonth() + 1) + '-' + preMonthLastDay.getDate();

                $scope.getCalendarEvents(formatedMonthFirstDay, formatedMonthLastDay);

                $scope.loadCalendarEvents();

                $timeout(function () {
                    angular.element(document.querySelector('#badge' + formatedMonthFirstDay)).parent().triggerHandler('click');
                    angular.element(document.querySelector('#badge' + todayDate)).parent().triggerHandler('click');
                    $ionicLoading.hide();
                }, 2000);
            },
            filteredEventsChange: function (filteredEvents) {
                $scope.calendarEvents = [];
                //console.log(filteredEvents);
                $scope.loadCalendarEvents();
            },
        };

        $scope.load = function () {
            $scope.calendarEvents = [];
            //console.log($scope.calendarEvents);
            $ionicLoading.show({
                content: 'Loading',
                animation: 'fade-in',
                showBackdrop: true,
                maxWidth: 200,
                showDelay: 0,
                template: '<i class="icon ion-loading-d"></i>'
            });
            $timeout(function () {
                angular.element(document.querySelector('#badge' + todayDate)).parent().triggerHandler('click');
                $ionicLoading.hide();
            }, 2000);
        }
        $scope.load();
        var checkId = 1;
        $scope.loadCalendarEvents = function () {

            if (checkId == 1) {
                $timeout(function () {
                    // to show today events by defalt
                    angular.element(document.querySelector('#badge' + todayDate)).parent().triggerHandler('click');
                });
                checkId++;
            }
            $timeout(function () {
                // to keep todayDate colored
                angular.element(document.querySelector('#badge' + todayDate)).parent().addClass('selected today');
            });
            // to add colored circles to dayes with events
            var log = [];


            angular.forEach($scope.events, function (res, Index) {
                var eventDate = new Date(res.StartDate);
                eventDate = eventDate.getFullYear() + '-' + (eventDate.getMonth() + 1) + '-' + eventDate.getDate();
                $timeout(function () {
                    angular.element(document.querySelector('#badge' + eventDate)).append('<div id="badgeCCC' + eventDate + '" class="badge"></div>');
                }, 100);

            }, log);

        }

    });
});