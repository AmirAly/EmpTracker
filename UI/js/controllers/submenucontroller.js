empTracker.controller("submenuController", function ($scope, $state) {

    $scope.text = "submenu";
    $scope.openmyaccount = function () {
        $state.go('app.myaccount');
    }
    $scope.showDailyView = function () {
        $state.go('app.home');
    }
    $scope.showCalendar = function () {
        $state.go('app.calendar');
    }
    $scope.showWeeklyView = function () {
        $state.go('app.thisweek');
    }
});

// local storage update 
//var updatedUser = localstorage.getObject('currentUser');
//updatedUser.FirstName = "eeeeee";
//localstorage.resetObject('currentUser', updatedUser);