empTracker.controller("attendanceController", function ($scope, $state, $ionicPopup, $http) {
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

    $scope.attendane = true;

    var today = new Date();
    today = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
    $scope.today = today;

    $scope.adjustData = function (event) {
        $scope.todayAttendanceArray = [];
        var thedate = new Date(event.tdate);

        event.dayNumber = thedate.getDate();
        event.dayName = (thedate.toString()).substring(0, 3);
        event.formattedDate = thedate.getFullYear() + "-" + (thedate.getMonth() + 1) + "-" + thedate.getDate();

        for (var i = 0; i < $scope.allAttendanceArray.length; i++) {
            if ($scope.allAttendanceArray[i].tdate == today) {
                $scope.todayAttendanceArray.push($scope.allAttendanceArray[i]);
            }
        }
    }


    if (ionic.Platform.isAndroid()) {
        // get json from external file
        $http.get('/android_asset/www/json/attenance.json').then(function (data) {
            $scope.allAttendanceArray = data.data.attenance;
            $scope.weelyAttendanceArray = data.data.attenance;
            $scope.todayAttendanceArray = data.data.attenance;
        });
    }
    else {
        // get json from external file
        $http.get('/json/attenance.json').then(function (data) {
            $scope.allAttendanceArray = data.data.attenance;
            $scope.weelyAttendanceArray = data.data.attenance;
            $scope.todayAttendanceArray = data.data.attenance;
        });
    }


    

});