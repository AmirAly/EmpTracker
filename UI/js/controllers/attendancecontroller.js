empTracker.controller("attendanceController", function ($scope, $state, $ionicPopup) {

    $scope.text = "attendanceController";
    $scope.openmyaccount = function () {
        $state.go('myaccount');
    }
    $scope.showSubMenu = function () {
        $state.go('app.submenu');
    }


    //$scope.goBack = function () {
    //    window.history.back();
    //};


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
});