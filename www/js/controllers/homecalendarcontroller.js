empTracker.controller("homecalendarcontroller", function ($scope, $state, $filter, $ionicTabsDelegate, $timeout, $http, $ionicPopup, $rootScope, API, $ionicLoading, $window, $location) {

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

    // run controller code EVERY time the view is enterd
    $scope.$on('$ionicView.enter', function test() {
        $scope.toggleMenu = function () {
            angular.element(document.querySelector('#menuBtn')).triggerHandler('click');
        }
        //console.log('enter'); 
        $rootScope.toggledrag = false;


    });



    var days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    var months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    var shortMonths = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

    var intialDate = new Date(); // get current date

    var today = new Date();
    //var todayDate = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
    var todayDate = $filter('date')(new Date(), 'yyyy-MM-dd');
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

                console.log($scope.events);
                if ($scope.events != 'You are not authorized to view your schedule in this time range') {
                    // prepare data for shift template
                    $scope.adjustData = function (event) {
                        $scope.todayShiftsArray = [];
                        var thedate = new Date(event.StartDate);
                        event.dayNumber = thedate.getDate();
                        event.dayName = (thedate.toString()).substring(0, 3);
                        //event.formattedDate = thedate.getFullYear() + "-" + (thedate.getMonth() + 1) + "-" + thedate.getDate();
                        event.formattedDate = $filter('date')(event.StartDate, 'yyyy-MM-dd');
                        for (var i = 0; i < $scope.events.length; i++) {
                            //console.log($scope.events[i].StartDate);
                            var x = $filter('date')($scope.events[i].StartDate, 'yyyy-MM-dd');
                            //console.log(x);
                            if (x == todayDate) {
                                $scope.todayShiftsArray.push($scope.events[i]);
                                //console.log($scope.todayShiftsArray);
                            }
                        }
                    }
                    $ionicLoading.hide();
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
        disabledDates: ["2000-01-01"],
        dayNamesLength: 1, // 1 for "M", 2 for "Mo", 3 for "Mon"; 9 will show full day names. Default is 1.
        mondayIsFirstDay: $scope.startIsMonday, //set monday as first day of week if :true , Default is false
        eventClick: function (date) { // called before dateClick and only if clicked day has events
            console.log('eventClick');
            $scope.calendarEvents = [];
        },
        dateClick: function (date) { // called every time a day is clicked
            console.log('dateClick');
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
            checkId = 0
            $scope.load();
            $scope.loadCalendarEvents();

            $timeout(function () {
                $ionicLoading.show({
                    content: 'Loading',
                    animation: 'fade-in',
                    showBackdrop: true,
                    maxWidth: 200,
                    showDelay: 0,
                    template: '<i class="icon ion-loading-d"></i>'
                });
                angular.element(document.querySelector('#badge' + formatedMonthFirstDay)).parent().triggerHandler('click');
                angular.element(document.querySelector('#badge' + todayDate)).parent().triggerHandler('click');
                $ionicLoading.hide();
            }, 3000);
        },
        filteredEventsChange: function (filteredEvents) {
            $scope.calendarEvents = [];
            //console.log(filteredEvents);
            $scope.loadCalendarEvents();
        },
    };

    $scope.load = function () {
        $ionicLoading.show({
            content: 'Loading',
            animation: 'fade-in',
            showBackdrop: true,
            maxWidth: 200,
            showDelay: 0,
            template: '<i class="icon ion-loading-d"></i>'
        });
        $timeout(function () {
            $scope.calendarEvents = [];
            //console.log($scope.calendarEvents);

            console.log('here');
            console.log(todayDate);
            //angular.element(document.querySelector('#badge' + formatedMonthFirstDay)).parent().triggerHandler('click');
            //angular.element(document.querySelector('#badge' + todayDate)).parent().triggerHandler('click');

            var ttodayDate = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
            console.log(ttodayDate);
            angular.element(document.querySelector('#badge' + ttodayDate)).parent().triggerHandler('click');
            $ionicLoading.hide();
        }, 7000);
    }
    $scope.load();
    var checkId = 0;
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
            var ttodayDate = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
            angular.element(document.querySelector('#badge' + ttodayDate)).parent().addClass('selected today');
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
    $scope.loadCalendarEvents();

});
