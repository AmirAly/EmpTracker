empTracker.controller("homeController", function ($scope, $state, $ionicTabsDelegate, $timeout, $http, $ionicPopup, $rootScope, API, $ionicLoading, $window, $location) {
    // run controller code EVERY time the view is enterd
    $scope.$on('$ionicView.enter', function test() {

        //console.log('enter'); 
        $rootScope.toggledrag = false;

        $scope.openmyaccount = function () {
            $location.path('/app/myaccount');
        }
        $scope.notifications = function () {
            $location.path('/app/notifications');
        }

        $scope.showSubMenu = function () {
            $state.go('app.submenu');
        }
        $scope.shiftView = function (_shiftId) {
            $state.go('app.shiftview', { shiftid: _shiftId });
        }
        $scope.started = false;
        $scope.mapView = false;

        $scope.showMap = function () {

            var confirmPopup = $ionicPopup.confirm({
                cssClass: 'bluePopup',
                title: '<i class="ion-information-circled "></i> Location services disabled',
                template: '<p>Location services must be enabled to start/end shifts.</p><p>Please tab below to enable location service in setting.</p>',
                cancelText: 'Cancel',
                cancelType: 'button-default',
                okText: 'Enable',
                okType: 'button-positive'
            });

            confirmPopup.then(function (res) {

                if (res) {
                    console.log('You are sure In');
                    $timeout(function () {
                        var map;
                        var myLatLng = new google.maps.LatLng(-25.038580, 133.433440);
                        google.maps.event.addDomListener(window, 'load', initialize());
                        function initialize() {
                            var mapOptions = {
                                zoom: 7,
                                center: myLatLng,
                                disableDefaultUI: true
                            };
                            map = new google.maps.Map(document.getElementById('map'),
                                mapOptions);
                            google.maps.event.addListenerOnce(map, 'idle', function () {
                                var marker = new google.maps.Marker({
                                    map: map,
                                    animation: google.maps.Animation.DROP,
                                    position: myLatLng
                                });
                            });
                        }
                        $scope.mapView = true;
                    }, 200);
                } else {
                    console.log('You are not sure In');
                    $scope.mapView = false;
                }
            });

        }

        $scope.showClockInConfirmation = function () {
            var confirmPopup = $ionicPopup.confirm({
                cssClass: 'bluePopup',
                title: '<i class="ion-information-circled "></i> Confirm Clock-In',
                template: '<p>Are you sure you want to check in?</p>Location: <p>Taren Point Road , Compound Z</p>',
                cancelText: 'Cancel',
                cancelType: 'button-default',
                okText: 'Clock-In',
                okType: 'button-positive'
            });

            confirmPopup.then(function (res) {
                if (res) {
                    console.log('You are sure In');

                } else {
                    console.log('You are not sure In');
                }
            });
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
                //console.log(_res);
                $scope.todayEventsArray = _res.data.data;
                $ionicLoading.hide();
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
            var firstday = new Date(Date.parse(new Date(intialDate.setDate(intialDate.getDate() - intialDate.getDay())).toUTCString()));
            var formatedFirstDay = firstday.getFullYear() + '-' + (firstday.getMonth() + 1) + '-' + firstday.getDate();

            var lastday = new Date(Date.parse(new Date(intialDate.setDate((intialDate.getDate() - intialDate.getDay()) + 6)).toUTCString()));
            var formatedLastday = lastday.getFullYear() + '-' + (lastday.getMonth() + 1) + '-' + lastday.getDate();

            var req = {
                method: 'GET',
                url: '/api/Roster?startDate=' + formatedFirstDay + '&endDate=' + formatedLastday + '',
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
                    $ionicLoading.hide();
                }
                else {
                    $scope.weeklyEventsArray = '';
                    $scope.weeklyTotalHours = 0;
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

            // show in page
            $scope.firstDayOfWeek = shortMonths[firstday.getMonth()] + " " + firstday.getDate();
            $scope.lastDayOfWeek = shortMonths[lastday.getMonth()] + " " + lastday.getDate() + "," + lastday.getFullYear();
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
            var nextWeekFirstDay = new Date(intialDate.getFullYear(), intialDate.getMonth(), intialDate.getDate() - intialDate.getDay() + 7);
            var nextWeekLastDay = new Date(intialDate.getFullYear(), intialDate.getMonth(), intialDate.getDate() - intialDate.getDay() + 13);

            // show in page
            $scope.firstDayOfWeek = shortMonths[nextWeekFirstDay.getMonth()] + " " + nextWeekFirstDay.getDate();
            $scope.lastDayOfWeek = shortMonths[nextWeekLastDay.getMonth()] + " " + nextWeekLastDay.getDate() + "," + nextWeekLastDay.getFullYear();

            // send to function
            var formatedWeekFirstDay = nextWeekFirstDay.getFullYear() + '-' + (nextWeekFirstDay.getMonth() + 1) + '-' + nextWeekFirstDay.getDate();
            var formatedWeekLastDay = nextWeekLastDay.getFullYear() + '-' + (nextWeekLastDay.getMonth() + 1) + '-' + nextWeekLastDay.getDate();

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
                    $ionicLoading.hide();
                }
                else {
                    $scope.weeklyEventsArray = '';
                    $scope.weeklyTotalHours = 0;
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
            var preWeekFirstDay = new Date(intialDate.getFullYear(), intialDate.getMonth(), intialDate.getDate() - intialDate.getDay() - 7);
            var preWeekLastDay = new Date(intialDate.getFullYear(), intialDate.getMonth(), intialDate.getDate() - intialDate.getDay() - 1);

            // show in page
            $scope.firstDayOfWeek = shortMonths[preWeekFirstDay.getMonth()] + " " + preWeekFirstDay.getDate();
            $scope.lastDayOfWeek = shortMonths[preWeekLastDay.getMonth()] + " " + preWeekLastDay.getDate() + "," + preWeekLastDay.getFullYear();

            // send to function
            var formatedWeekFirstDay = preWeekFirstDay.getFullYear() + '-' + (preWeekFirstDay.getMonth() + 1) + '-' + preWeekFirstDay.getDate();
            var formatedWeekLastDay = preWeekLastDay.getFullYear() + '-' + (preWeekLastDay.getMonth() + 1) + '-' + preWeekLastDay.getDate();

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
                    $ionicLoading.hide();
                }
                else {
                    $scope.weeklyEventsArray = '';
                    $scope.weeklyTotalHours = 0;
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
                url: '/api/Roster?startDate=' + firstDayMonth + '&endDate=' + lastDayMonth + '',
                data: {}
            }
            // add true to use authentication token
            API.execute(req, true).then(function (_res) {
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
                    $scope.events = [];
                    console.log('no data found');
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
        $scope.getCalendarEvents(firstDayMonthFormated, lastDayMonthFormated);
        //////////////////////////////////////////////////////////////////////////////

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
            mondayIsFirstDay: false, //set monday as first day of week if :true , Default is false
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