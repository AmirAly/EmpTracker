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