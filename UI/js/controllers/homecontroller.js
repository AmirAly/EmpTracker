empTracker.controller("homeController", function ($scope, $state, $timeout, $http, $ionicPopup, $rootScope) {

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

      

        var today = new Date(); // get current date


        ////////////////  get first & last day of week  ///////////////////////
        var first = today.getDate() - today.getDay(); // First day is the day of the month - the day of the week
        var last = first + 6; // last day is the first day + 6

        var firstdayUTC = new Date(today.setDate(first)).toUTCString();
        var lastdayUTC = new Date(today.setDate(last)).toUTCString();

        var firstday = new Date(Date.parse(firstdayUTC));
        var formatedFirstDay = firstday.getFullYear() + '-' + (firstday.getMonth() + 1) + '-' + firstday.getDate();

        var lastday = new Date(Date.parse(lastdayUTC));
        var formatedLastday = lastday.getFullYear() + '-' + (lastday.getMonth() + 1) + '-' + lastday.getDate();

        console.log("firstday  " + formatedFirstDay);
        console.log("lastday  " + formatedLastday);
        ///////////////////////////////////////

        today = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
        $scope.today = today;

        var d = new Date();
        var days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
        var todayname = days[d.getDay()];

        var months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
        var todaymonthname = months[d.getMonth()];

        $scope.todayDate = todayname + ', ' + todaymonthname + d.getDate() + ', ' + d.getFullYear();


        $scope.adjustData = function (event) {
            $scope.todayShiftsArray = [];
            var thedate = new Date(event.tdate);

            event.dayNumber = thedate.getDate();
            event.dayName = (thedate.toString()).substring(0, 3);
            event.formattedDate = thedate.getFullYear() + "-" + (thedate.getMonth() + 1) + "-" + thedate.getDate();

            for (var i = 0; i < $scope.events.length; i++) {
                if ($scope.events[i].tdate == today) {
                    $scope.todayShiftsArray.push($scope.events[i]);
                }
            }
        }

        $scope.calendarEvents = [];
        // Calendar
        // With "use strict", Dates can be passed ONLY as strings (ISO format: YYYY-MM-DD)
        "use strict";
        $scope.options = {
            defaultDate: today,
            minDate: "2000-01-01",
            maxDate: "2100-12-31",
            disabledDates: ["2016-04-1"],
            dayNamesLength: 1, // 1 for "M", 2 for "Mo", 3 for "Mon"; 9 will show full day names. Default is 1.
            mondayIsFirstDay: true, //set monday as first day of week. Default is false
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
                angular.element(document.querySelector('#badge' + today)).parent().triggerHandler('click');
            }, 2000);
        }
        $scope.load();
        $scope.loadCalendarEvents = function () {
            // to keep today colored
            $timeout(function () {
                angular.element(document.querySelector('#badge' + today)).parent().addClass('selected today');
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