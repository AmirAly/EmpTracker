empTracker.controller("homeController", function ($scope, $state, $timeout, $http) {

    $scope.openmyaccount = function () {
        $state.go('app.myaccount');
    }
    $scope.showSubMenu = function () {
        $state.go('app.submenu');
    }
    $scope.shiftView = function () {
        $state.go('app.shiftview');
    }

    var today = new Date();
    today = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
    $scope.today = today;

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


    // Calendar
    // With "use strict", Dates can be passed ONLY as strings (ISO format: YYYY-MM-DD)
    "use strict";
    $scope.options = {
        defaultDate: today,
        minDate: "2000-01-01",
        maxDate: "2100-12-31",
        disabledDates: [
            "2016-04-1",
            "2016-04-8",
            "2016-04-15",
            "2016-04-22"
        ],
        dayNamesLength: 1, // 1 for "M", 2 for "Mo", 3 for "Mon"; 9 will show full day names. Default is 1.
        mondayIsFirstDay: true,//set monday as first day of week. Default is false
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
            angular.element(document.querySelector('#badge' + today)).parent().addClass('selected');
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


    // get json from external file
    $http.get('/json/events.json').then(function (data) {
        $scope.allEvents = data.data.events;
        //temp for now
        $scope.events = data.data.events;
        $scope.todayShiftsArray = data.data.events;
        $scope.calendarEvents = data.data.events;
    });
});