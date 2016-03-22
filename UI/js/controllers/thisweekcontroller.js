empTracker.controller("thisweekController", function ($scope, $state) {
    $scope.openmyaccount = function () {
        $state.go('app.myaccount');
    }
    $scope.showSubMenu = function () {
        $state.go('app.submenu');
    }
    $scope.update = function () {
        $state.go('app.home');
    }
    $scope.shiftView = function () {
        $state.go('app.dailyview');
    }
});