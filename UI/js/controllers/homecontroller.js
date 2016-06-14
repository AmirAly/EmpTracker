empTracker.controller("homeController", function ($scope, $state, $timeout, $http, $ionicPopup, $rootScope, API) {

    // run controller code EVERY time the view is enterd
    $scope.$on('$ionicView.enter', function () {

        $rootScope.toggledrag = false;

        $scope.notifications = function () {
            $state.go('app.notifications');
        }
        $scope.openmyaccount = function () {
            $state.go('app.myaccount');
        }
        $scope.showSubMenu = function () {
            $state.go('app.submenu');
        }
        $scope.shiftView = function () {
            $state.go('app.shiftview');
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
        var shortMonths = ["Jan", "Feb", "Mar", "Apr", "May", "June", "July", "Aug", "Sept", "Oct", "Nov", "Dec"];

        var intialDate = new Date(); // get current date

        $scope.getTodayEvents = function () {
            var thisday = new Date();
            var formatedFirstDay = thisday.getFullYear() + '-' + (thisday.getMonth() + 1) + '-' + thisday.getDate();
            console.log(formatedFirstDay);
            var req = {
                method: 'GET',
                url: '/api/Roster?startDate=' + formatedFirstDay + '&endDate=' + formatedFirstDay + '',
                data: {}
            }
            // add true to use authentication token
            API.execute(req, true).then(function (_res) {
                console.log(_res.data);
            });
        }
        $scope.getTodayEvents();
        ////////////////  get first & last day of this week  ///////////////////////
        $scope.thisWeek = function () {
            var firstday = new Date(Date.parse(new Date(intialDate.setDate(intialDate.getDate() - intialDate.getDay())).toUTCString()));
            var formatedFirstDay = firstday.getFullYear() + '-' + (firstday.getMonth() + 1) + '-' + firstday.getDate();

            var lastday = new Date(Date.parse(new Date(intialDate.setDate((intialDate.getDate() - intialDate.getDay()) + 6)).toUTCString()));
            var formatedLastday = lastday.getFullYear() + '-' + (lastday.getMonth() + 1) + '-' + lastday.getDate();

            // send to function
            console.log("firstday  " + formatedFirstDay);
            console.log("lastday  " + formatedLastday);

            var req = {
                method: 'GET',
                url: '/api/Roster?startDate=' + formatedFirstDay + '&endDate=' + formatedLastday + '',
                data: {}
            }
            // add true to use authentication token
            API.execute(req, true).then(function (_res) {
                console.log(_res.data);
            });


            // show in page
            $scope.firstDayOfWeek = shortMonths[firstday.getMonth()] + "," + firstday.getDate();
            $scope.lastDayOfWeek = shortMonths[lastday.getMonth()] + "," + lastday.getDate();
        }
        $scope.thisWeek();
        ///////////////////////////////////////

        ////////////////  get first & last day of next week  ///////////////////////
        $scope.nextWeek = function () {
            console.log('next');
            var nextWeekFirstDay = new Date(intialDate.getFullYear(), intialDate.getMonth(), intialDate.getDate() - intialDate.getDay() + 7);
            var nextWeekLastDay = new Date(intialDate.getFullYear(), intialDate.getMonth(), intialDate.getDate() - intialDate.getDay() + 13);

            // show in page
            $scope.firstDayOfWeek = shortMonths[nextWeekFirstDay.getMonth()] + "," + nextWeekFirstDay.getDate();
            $scope.lastDayOfWeek = shortMonths[nextWeekLastDay.getMonth()] + "," + nextWeekLastDay.getDate();

            // send to function
            var formatedWeekFirstDay = nextWeekFirstDay.getFullYear() + '-' + (nextWeekFirstDay.getMonth() + 1) + '-' + nextWeekFirstDay.getDate();
            var formatedWeekLastDay = nextWeekLastDay.getFullYear() + '-' + (nextWeekLastDay.getMonth() + 1) + '-' + nextWeekLastDay.getDate();

            console.log("WeekFirstDay  " + formatedWeekFirstDay);
            console.log("WeekLastDay  " + formatedWeekLastDay);

            // update initial date for next time
            intialDate = new Date(Date.parse(new Date(intialDate.setDate((intialDate.getDate() - intialDate.getDay()) + 7)).toUTCString()));
        }
        ///////////////////////////////////////

        ////////////////  get first & last day of pre week  ///////////////////////
        $scope.preWeek = function () {
            console.log('pre');
            var preWeekFirstDay = new Date(intialDate.getFullYear(), intialDate.getMonth(), intialDate.getDate() - intialDate.getDay() - 7);
            var preWeekLastDay = new Date(intialDate.getFullYear(), intialDate.getMonth(), intialDate.getDate() - intialDate.getDay() - 1);

            // show in page
            $scope.firstDayOfWeek = shortMonths[preWeekFirstDay.getMonth()] + "," + preWeekFirstDay.getDate();
            $scope.lastDayOfWeek = shortMonths[preWeekLastDay.getMonth()] + "," + preWeekLastDay.getDate();

            // send to function
            var formatedWeekFirstDay = preWeekFirstDay.getFullYear() + '-' + (preWeekFirstDay.getMonth() + 1) + '-' + preWeekFirstDay.getDate();
            var formatedWeekLastDay = preWeekLastDay.getFullYear() + '-' + (preWeekLastDay.getMonth() + 1) + '-' + preWeekLastDay.getDate();

            console.log("WeekFirstDay  " + formatedWeekFirstDay);
            console.log("WeekLastDay  " + formatedWeekLastDay);

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
        $scope.adjustData = function (event) {
            $scope.todayShiftsArray = [];
            var thedate = new Date(event.tdate);
            event.dayNumber = thedate.getDate();
            event.dayName = (thedate.toString()).substring(0, 3);
            event.formattedDate = thedate.getFullYear() + "-" + (thedate.getMonth() + 1) + "-" + thedate.getDate();

            for (var i = 0; i < $scope.events.length; i++) {
                if ($scope.events[i].tdate == todayDate) {
                    $scope.todayShiftsArray.push($scope.events[i]);
                }
            }
        }

        $scope.calendarEvents = [];
        // Calendar
        // With "use strict", Dates can be passed ONLY as strings (ISO format: YYYY-MM-DD)
        "use strict";
        $scope.options = {
            defaultDate: todayDate,
            minDate: "2000-01-01",
            maxDate: "2100-12-31",
            disabledDates: ["2016-04-1"],
            dayNamesLength: 1, // 1 for "M", 2 for "Mo", 3 for "Mon"; 9 will show full day names. Default is 1.
            mondayIsFirstDay: false, //set monday as first day of week if :true , Default is false
            eventClick: function (date) { // called before dateClick and only if clicked day has events
                $scope.calendarEvents = [];
            },
            dateClick: function (date) { // called every time a day is clicked
                console.log(date);
                var formattedDate = date.year + "-" + date._month + "-" + date.day;
                $scope.calendarEvents = [];
                for (var i = 0; i < $scope.events.length; i++) {
                    if ($scope.events[i].tdate == formattedDate) {
                        $scope.calendarEvents.push($scope.events[i]);
                        console.log($scope.calendarEvents);
                    }
                }
                $scope.loadCalendarEvents();
            },
            changeMonth: function (month, year) {
                console.log(month, year);
                $scope.calendarEvents = [];
                $scope.loadCalendarEvents();
                $scope.load();
            },
            filteredEventsChange: function (filteredEvents) {
                $scope.calendarEvents = [];
                console.log(filteredEvents);
                $scope.loadCalendarEvents();
            },
        };

        $scope.load = function () {
            $scope.calendarEvents = [];
            console.log($scope.calendarEvents);
            $timeout(function () {
                angular.element(document.querySelector('#badge' + todayDate)).parent().triggerHandler('click');
                //console.log(angular.element(document.querySelector('#badge' + todayDate)).parent());
            }, 2000);
        }
        $scope.load();


        var testID = 1;
        $scope.loadCalendarEvents = function () {
            
            if (testID == 1) {
                $timeout(function () {
                    // to show today events by defalt
                    angular.element(document.querySelector('#badge' + todayDate)).parent().triggerHandler('click');
                });
                testID++;
            }
            $timeout(function () {
                // to keep todayDate colored
                angular.element(document.querySelector('#badge' + todayDate)).parent().addClass('selected today');
            });
            // to add colored circles to dayes with events
            var log = [];
            angular.forEach($scope.events, function (res, Index) {
                var eventDate = new Date(res.tdate);
                eventDate = eventDate.getFullYear() + '-' + (eventDate.getMonth() + 1) + '-' + eventDate.getDate();
                $timeout(function () {
                    angular.element(document.querySelector('#badge' + eventDate)).append('<div class="badge postion3 ' + res.color1 + '">' + res.val1 + '</div>\
                          <div class="badge postion4 ' + res.color2 + '">' + res.val2 + '</div>');
                });
            }, log);
            
        } 


        if (ionic.Platform.isAndroid()) {
            // get json from external file
            $http.get('/android_asset/www/json/events.json').then(function (data) {
                $scope.allEvents = data.data.events;
                $scope.events = data.data.events;
                $scope.todayShiftsArray = data.data.events;
            });
        }
        else {
            // get json from external file
            $http.get('/json/events.json').then(function (data) {
                $scope.allEvents = data.data.events;
                $scope.events = data.data.events;
                $scope.todayShiftsArray = data.data.events;
            });
        }
    });
});

////get first / last day of week steps
//var first = today.getDate() - today.getDay(); // First day is the day of the month - the day of the week
//var last = first + 6; // last day is the first day + 6

//var firstdayUTC = new Date(today.setDate(first)).toUTCString();
//var lastdayUTC = new Date(today.setDate(last)).toUTCString();

//var firstday = new Date(Date.parse(firstdayUTC));
//var formatedFirstDay = firstday.getFullYear() + '-' + (firstday.getMonth() + 1) + '-' + firstday.getDate();

//var lastday = new Date(Date.parse(lastdayUTC));
//var formatedLastday = lastday.getFullYear() + '-' + (lastday.getMonth() + 1) + '-' + lastday.getDate();
