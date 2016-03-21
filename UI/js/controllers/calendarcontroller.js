empTracker.controller("calendarController" ,function ($scope, $state) {

    $scope.text = "calendar";
    $scope.openmyaccount = function () {
        $state.go('myaccount');
    }
    $scope.showSubMenu = function () {
        $state.go('app.submenu');
    }

    $scope.showDetails = false;
    "use strict";
    // With "use strict", Dates can be passed ONLY as strings (ISO format: YYYY-MM-DD)
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
            console.log(date.date);
            var isoDate = new Date(date.date).toISOString();
            console.log(isoDate);
            //console.log(moment(isoDate, "YYYY-MM-DD"));
            //var input = date.date;
            //var year = input.slice(-4),
            //    month = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun','Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'].indexOf(input.substr(4, 3)) + 1,
            //    day = input.substr(8, 2);
            //var output = year + '-' + (month < 10 ? '0' : '') + month + '-' + day;
            //console.log(output);

            //if (moment(date, "YYYY-MM-DD") == "2016-08-20") {
            //    alert('if');
            //}
            $scope.showDetails = true;
        },
        dateClick: function (date) { // called every time a day is clicked
            console.log(date);
            $scope.showDetails = false;
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
    ];

});
