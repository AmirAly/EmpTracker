empTracker.controller("homeController", function ($scope, $state, $timeout) {
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
        $state.go('app.shiftview');
    }

    var today = new Date();
    var dd = today.getDate();
    var mm = today.getMonth() + 1; //January is 0!
    var yyyy = today.getFullYear();

    //if (dd < 10) {
    //    dd = '0' + dd
    //}

    //if (mm < 10) {
    //    mm = '0' + mm
    //}

    today = yyyy + '-' + mm + '-' + dd;
    console.log(today);
    
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
            $timeout(function () {
                angular.element(document.querySelector('#badge' + today)).parent().triggerHandler('click');
            }, 200);
        },
        filteredEventsChange: function (filteredEvents) {
            $('#dvEvents').empty();
            console.log(filteredEvents);
            $scope.loadCalendarEvents();
        },
    };
    //$scope.onClick(new Date(),1,1);
    $scope.events = [
        { date: '2016-4-5', fromTo: '00:30 AM - 09:00 PM', address: 'Taren Point Road', area: 'Compound Z', duration: '8:00', color1: 'tentative', val1: '2', color2: 'training', val2: '3' },
        { date: '2016-4-3', fromTo: '00:30 AM - 09:00 PM', address: 'Taren Point Road', area: 'Compound Z', duration: '8:00', color1: 'tentative', val1: '2', color2: 'training', val2: '3' },
        { date: '2016-4-18', fromTo: '00:30 AM - 09:00 PM', address: 'Taren Point Road', area: 'Compound Z', duration: '8:00', color1: 'confirmed', val1: '2', color2: 'void', val2: '3' },
        { date: '2016-5-20', fromTo: '00:30 AM - 09:00 PM', address: 'Taren Point Road', area: 'Compound Z', duration: '8:00', color1: 'void', val1: '0', color2: 'training', val2: '3' },
        { date: '2016-4-20', fromTo: '00:30 AM - 09:00 PM', address: 'Lime Street, Sydney', area: 'Compound Z', duration: '8:00', color1: 'void', val1: '0', color2: 'training', val2: '3' },
        { date: '2016-4-20', fromTo: '00:30 AM - 09:00 PM', address: 'Lennox Bridge, Parramatta', area: 'Compound Z', duration: '8:00', color1: 'void', val1: '0', color2: 'training', val2: '3' },
        { date: '2016-4-30', fromTo: '00:30 AM - 09:00 PM', address: 'Taren Point Road', area: 'Compound Z', duration: '8:00', color1: 'tentative', val1: '1', color2: 'confirmed', val2: '2' }
    ];
    $timeout(function () {
        angular.element(document.querySelector('#badge' + today)).parent().triggerHandler('click');
    }, 2000);
    $scope.loadCalendarEvents = function () {
        // to keep today colored
        $timeout(function () {
            $('#badge' + today).parent().addClass('selected');
        });
        
        // to add colored circles to dayes with events
        $.each($scope.events, function (Index, res) {
            var eventDate = new Date(res.date);
            var dd = eventDate.getDate();
            var mm = eventDate.getMonth() + 1; //January is 0!
            var yyyy = eventDate.getFullYear();
            eventDate = yyyy + '-' + mm + '-' + dd;
            console.log(eventDate);
            $timeout(function () {
                $('#badge' + eventDate).append('<div class="badge postion3 ' + res.color1 + '">' + res.val1 + '</div>\
                      <div class="badge postion4 ' + res.color2 + '">' + res.val2 + '</div>');
            });
        });

    }
});