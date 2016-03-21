empTracker.controller("notificationsController", function ($scope, $state) {

    $scope.text = "notifications";
    $scope.openmyaccount = function () {
        $state.go('myaccount');
    }
    $scope.showSubMenu = function () {
        $state.go('app.submenu');
    }
});
