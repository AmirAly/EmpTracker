empTracker.controller("submenuController", function ($scope, $state) {

    $scope.text = "submenu";
    $scope.openmyaccount = function () {
        $state.go('myaccount');
    }
    $scope.showDailyView = function () {
        $state.go('app.dailyview');
    }
    $scope.showCalendar = function () {
        $state.go('app.calendar');
    }
});

// local storage update 
//var updatedUser = localstorage.getObject('currentUser');
//updatedUser.FirstName = "eeeeee";
//localstorage.resetObject('currentUser', updatedUser);