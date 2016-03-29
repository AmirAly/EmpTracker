empTracker.controller("homeController", function ($scope, $state) {
    $scope.openmyaccount = function () {
        $state.go('app.myaccount');
    }
    $scope.showSubMenu = function () {
        $state.go('app.submenu');
    }
    $scope.update = function () {
        window.location.reload(true);
    }
    $scope.shiftView = function () {
        $state.go('app.dailyview');
    }

    // Calendar
    $scope.showDetails = false;
    $scope.showlistCards = false;
    // With "use strict", Dates can be passed ONLY as strings (ISO format: YYYY-MM-DD)
    "use strict";
    $scope.options = {
        defaultDate: "2016-08-06",
        minDate: "2016-01-01",
        maxDate: "2016-12-31",
        disabledDates: [
            "2016-06-22",
            "2016-07-27",
            "2016-08-13",
            "2016-08-15"
        ],
        dayNamesLength: 1, // 1 for "M", 2 for "Mo", 3 for "Mon"; 9 will show full day names. Default is 1.
        mondayIsFirstDay: true,//set monday as first day of week. Default is false

        eventClick: function (date) { // called before dateClick and only if clicked day has events
            console.log(date);
            var formattedDate = date.year + "-" + date._month + "-" + date.day;
            if (formattedDate.toString() == '2016-8-20') {
                $scope.showlistCards = true;
                $scope.showDetails = false;
            }

            else {
                $scope.showlistCards = false;
                $scope.showDetails = true;
            }
        },
        dateClick: function (date) { // called every time a day is clicked
            console.log(date);
            $scope.showDetails = false;
            $scope.showlistCards = false;
        },
        changeMonth: function (month, year) {
            console.log(month, year);

        },
        filteredEventsChange: function (filteredEvents) {
            console.log(filteredEvents);
        },
    };

    $scope.events = [
      { foo: 'bar', eventClass: 'expired', date: "2016-08-18" }, //value of eventClass will be added to CSS class of the day element
      { foo: 'bar', date: "2016-08-20" }
      , { foo: 'bar', eventClass: '333', date: "2016-08-18" }
    ];
});
