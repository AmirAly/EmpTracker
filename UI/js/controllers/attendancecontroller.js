empTracker.controller("attendanceController", function ($scope, $state, $ionicPopup, $http, $rootScope) {

    $scope.$on('$ionicView.enter', function () {
        $rootScope.toggledrag = true;
    });

    $scope.openmyaccount = function () {
        $state.go('app.myaccount');
    }
    $scope.showSubMenu = function () {
        $state.go('app.submenu');
    }
    $scope.notifications = function () {
        $state.go('app.notifications');
    }
    // A confirm dialog
    $scope.showConfirm = function () {
        var confirmPopup = $ionicPopup.confirm({
            title: 'Confirmation',
            template: 'Are you sure you want to check in?'
        });
        confirmPopup.then(function (res) {
            if (res) {
                console.log('You are sure');
            } else {
                console.log('You are not sure');
            }
        });
    };


    // id is important !!
    $scope.thisWeek = [{ "id": 1, "month": 'May', "dayNumber": 20, "dayName": "Sun", "selected": true },
                       { "id": 2, "month": 'May', "dayNumber": 21, "dayName": "Mon", "selected": false },
                       { "id": 3, "month": 'May', "dayNumber": 22, "dayName": "Tue", "selected": false },
                       { "id": 4, "month": 'May', "dayNumber": 23, "dayName": "Wed", "selected": false },
                       { "id": 5, "month": 'May', "dayNumber": 24, "dayName": "Thu", "selected": false },
                       { "id": 6, "month": 'May', "dayNumber": 25, "dayName": "Fri", "selected": false },
                       { "id": 7, "month": 'May', "dayNumber": 26, "dayName": "Sat", "selected": false }];

	$scope.selectItem = function(selectedItem){
	    for (var i = 0; i < $scope.thisWeek.length; i++) {
	        var item = $scope.thisWeek[i];
            if(item.id == selectedItem.id){
                item.selected = !item.selected;
                console.log(item.id);
                getData(item.id);
            }else {
                item.selected = false;
            }
        }
	}
	function getData(id) {
	    $scope.showME = id;
	}
	$scope.showME = 1;

    //////////////////////////////////////////////////////
	//$scope.weekDate = 'May 9 - May 16, 2016';

	//$scope.preWeek = function () {
	//    $scope.weekDate = 'May 2 - May 9, 2016';
	//}

	//$scope.nextWeek = function () {
	//    $scope.weekDate = 'May 16 - May 22, 2016';
	//}

	var intialDate = new Date(); // get current date
	var todayDate = new Date();  // get current date
	var shortMonths = ["Jan", "Feb", "Mar", "Apr", "May", "June", "July", "Aug", "Sept", "Oct", "Novr", "Dec"];

    ////////////////  get first & last day of this week  ///////////////////////
	
	    var firstday = new Date(Date.parse(new Date(intialDate.setDate(intialDate.getDate() - intialDate.getDay())).toUTCString()));
	    var formatedFirstDay = firstday.getFullYear() + '-' + (firstday.getMonth() + 1) + '-' + firstday.getDate();

	    var lastday = new Date(Date.parse(new Date(intialDate.setDate((intialDate.getDate() - intialDate.getDay()) + 6)).toUTCString()));
	    var formatedLastday = lastday.getFullYear() + '-' + (lastday.getMonth() + 1) + '-' + lastday.getDate();

	    // send to function
	    console.log("firstday  " + formatedFirstDay);
	    console.log("lastday  " + formatedLastday);

	    // show in page
        var firstDayOfWeek = shortMonths[firstday.getMonth()] + " " + firstday.getDate();
	    var lastDayOfWeek = shortMonths[lastday.getMonth()] + " " + lastday.getDate() + ", " + lastday.getFullYear();
	    $scope.weekDate = firstDayOfWeek + ' - ' + lastDayOfWeek;
	    console.log($scope.weekDate);

    ///////////////////////////////////////

    ////////////////  get first & last day of next week  ///////////////////////
	$scope.nextWeek = function () {
	    console.log('next');
	    var nextWeekFirstDay = new Date(intialDate.getFullYear(), intialDate.getMonth(), intialDate.getDate() - intialDate.getDay() + 7);
	    var nextWeekLastDay = new Date(intialDate.getFullYear(), intialDate.getMonth(), intialDate.getDate() - intialDate.getDay() + 13);

	    // show in page
	    var firstDayOfWeek = shortMonths[nextWeekFirstDay.getMonth()] + " " + nextWeekFirstDay.getDate();
	    var lastDayOfWeek = shortMonths[nextWeekLastDay.getMonth()] + " " + nextWeekLastDay.getDate() + ", " + nextWeekLastDay.getFullYear();

	    $scope.weekDate = firstDayOfWeek + ' - ' + lastDayOfWeek;

	    // send to function
	    var formatedWeekFirstDay = nextWeekFirstDay.getFullYear() + '-' + (nextWeekFirstDay.getMonth() + 1) + '-' + nextWeekFirstDay.getDate();
	    var formatedWeekLastDay = nextWeekLastDay.getFullYear() + '-' + (nextWeekLastDay.getMonth() + 1) + '-' + nextWeekLastDay.getDate();

	    console.log("WeekFirstDay  " + formatedWeekFirstDay);
	    console.log("WeekLastDay  " + formatedWeekLastDay);

	    // update initial date for next time
	    intialDate = new Date(Date.parse(new Date(todayDate.setDate((intialDate.getDate() - intialDate.getDay()) + 7)).toUTCString()));
	}
    ///////////////////////////////////////

    ////////////////  get first & last day of pre week  ///////////////////////
	$scope.preWeek = function () {
	    console.log('pre');
	    var preWeekFirstDay = new Date(intialDate.getFullYear(), intialDate.getMonth(), intialDate.getDate() - intialDate.getDay() - 7);
	    var preWeekLastDay = new Date(intialDate.getFullYear(), intialDate.getMonth(), intialDate.getDate() - intialDate.getDay() - 1);

	    // show in page
	    var firstDayOfWeek = shortMonths[preWeekFirstDay.getMonth()] + " " + preWeekFirstDay.getDate();
	    var lastDayOfWeek = shortMonths[preWeekLastDay.getMonth()] + " " + preWeekLastDay.getDate() + ", " + preWeekLastDay.getFullYear();

	    $scope.weekDate = firstDayOfWeek + ' - ' + lastDayOfWeek;

	    // send to function
	    var formatedWeekFirstDay = preWeekFirstDay.getFullYear() + '-' + (preWeekFirstDay.getMonth() + 1) + '-' + preWeekFirstDay.getDate();
	    var formatedWeekLastDay = preWeekLastDay.getFullYear() + '-' + (preWeekLastDay.getMonth() + 1) + '-' + preWeekLastDay.getDate();

	    console.log("WeekFirstDay  " + formatedWeekFirstDay);
	    console.log("WeekLastDay  " + formatedWeekLastDay);

	    // update initial date for next time
	    intialDate = new Date(Date.parse(new Date(todayDate.setDate((intialDate.getDate() - intialDate.getDay()) - 7)).toUTCString()));
	}
    ///////////////////////////////////////



    var today = new Date();
    today = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
    $scope.today = today;

    //$scope.adjustData = function (event) {
    //    //$scope.todayAttendanceArray = [];
    //    //var thedate = new Date(event.tdate);

    //    //event.dayNumber = thedate.getDate();
    //    //event.dayName = (thedate.toString()).substring(0, 3);
    //    //event.formattedDate = thedate.getFullYear() + "-" + (thedate.getMonth() + 1) + "-" + thedate.getDate();

    //    //for (var i = 0; i < $scope.weeklyAttendanceArray.length; i++) {
    //    //    if ($scope.weeklyAttendanceArray[i].tdate == today) {
    //    //        $scope.todayAttendanceArray.push($scope.weeklyAttendanceArray[i]);
    //    //    }
    //    //}
    //}


    if (ionic.Platform.isAndroid()) {
        // get json from external file
        $http.get('/android_asset/www/json/attenance.json').then(function (data) {
            $scope.weeklyAttendanceArray = data.data.attenance;
            $scope.todayAttendanceArray = data.data.attenance;
        });
    }
    else {
        // get json from external file
        $http.get('/json/attenance.json').then(function (data) {
            $scope.weeklyAttendanceArray = data.data.attenance;
            $scope.todayAttendanceArray = data.data.attenance;
        });
    }


    

});