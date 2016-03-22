empTracker.controller("homeController", function ($scope, $state) {
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
        $state.go('app.dailyview');
    }
});
