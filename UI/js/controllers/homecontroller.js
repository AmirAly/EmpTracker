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
        //console.log(event);
        var thedate = new Date(event.tdate);
        //$timeout(function () {
        //console.log(event.date);
        event.dayNumber = thedate.getDate();
        event.dayName = (thedate.toString()).substring(0, 3);
        event.formattedDate = thedate.getFullYear() + "-" + (thedate.getMonth() + 1) + "-" + thedate.getDate();
        console.log(event.formattedDate);
        //},2000);

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
            $('#dvEvents').empty();
            var dayName = (date.date.toString()).substring(0, 3);
            var formattedDate = date.year + "-" + date._month + "-" + date.day;
            if (formattedDate == today) {
                $.each(date.event, function (Index, res) {
                    $('#dvEvents').append('<div class="item item-text-wrap text-center" ng-click="shiftView()">\
                                             <div class=" shiftCard todayShiftCard">\
                                                <div class="text-center">\
                                                    <p><span>Today</span></p>\
                                                    <div class="row row-top">\
                                                        <div class="col col-20 col-center firstCoulmn">\
                                                            <div class="row"><span class="col">' + date.day + '</span></div>\
                                                            <div class="row"><span class="col">' + dayName + '</span></div>\
                                                        </div>\
                                                        <div class="col text-left secondCoulmn">\
                                                            <div class="row">\
                                                                <span class="col date">' + res.fromTo + '</span>\
                                                            </div>\
                                                            <div class="row">\
                                                                <span class="col address">' + res.address + '</span>\
                                                            </div>\
                                                            <div class="row">\
                                                                <span class="col area">' + res.area + '</span>\
                                                            </div>\
                                                        </div>\
                                                        <div class="col col-25 text-right padding-right thirdCoulmn">\
                                                            <div class="totalHours">' + res.duration + '</div>\
                                                            <div class="hoursTxt">hours</div>\
                                                        </div>\
                                                    </div>\
                                                 </div>\
                                              </div>\
                                          </div>');
                });
            }
            else {
                $.each(date.event, function (Index, res) {
                    $('#dvEvents').append('<div class="item item-text-wrap text-center" ng-click="shiftView()">\
                                             <div class=" shiftCard">\
                                                <div class="text-center">\
                                                    <div class="row row-top">\
                                                        <div class="col col-20 col-center firstCoulmn">\
                                                            <div class="row"><span class="col">' + date.day + '</span></div>\
                                                            <div class="row"><span class="col">' + dayName + '</span></div>\
                                                        </div>\
                                                        <div class="col text-left secondCoulmn">\
                                                            <div class="row">\
                                                                <span class="col date">' + res.fromTo + '</span>\
                                                            </div>\
                                                            <div class="row">\
                                                                <span class="col address">' + res.address + '</span>\
                                                            </div>\
                                                            <div class="row">\
                                                                <span class="col area">' + res.area + '</span>\
                                                            </div>\
                                                        </div>\
                                                        <div class="col col-25 text-right padding-right thirdCoulmn">\
                                                            <div class="totalHours">' + res.duration + '</div>\
                                                            <div class="hoursTxt">hours</div>\
                                                        </div>\
                                                    </div>\
                                                 </div>\
                                              </div>\
                                          </div>');
                });
            }

            $scope.loadCalendarEvents();
        },
        dateClick: function (date) { // called every time a day is clicked
            console.log(date);
            $('#dvEvents').empty();
            $scope.loadCalendarEvents();
        },
        changeMonth: function (month, year) {
            console.log(month, year);
            $('#dvEvents').empty();
            $scope.loadCalendarEvents();
            $scope.load();
        },
        filteredEventsChange: function (filteredEvents) {
            $('#dvEvents').empty();
            console.log(filteredEvents);
            $scope.loadCalendarEvents();
        },
    };
   
    $scope.load = function () {
        $timeout(function () {
            angular.element(document.querySelector('#badge' + today)).parent().triggerHandler('click');
        }, 2000);
    }
    $scope.load();
    $scope.loadCalendarEvents = function () {
        // to keep today colored
        $timeout(function () {
            $('#badge' + today).parent().addClass('selected');
        });

        // to add colored circles to dayes with events
        $.each($scope.events, function (Index, res) {
            var eventDate = new Date(res.tdate);
            console.log(eventDate.tdate);
            eventDate = eventDate.getFullYear() + '-' + (eventDate.getMonth() + 1) + '-' + eventDate.getDate();
            //console.log(eventDate);
            $timeout(function () {
                $('#badge' + eventDate).append('<div class="badge postion3 ' + res.color1 + '">' + res.val1 + '</div>\
                      <div class="badge postion4 ' + res.color2 + '">' + res.val2 + '</div>');
            });
        });
    }


    // get json from external file
    $http.get('/json/events.json').then(function (data) {
        $scope.allEvents = data.data.events;
        //temp for now
        $scope.events = data.data.events;
        console.log($scope.events);
    });
});