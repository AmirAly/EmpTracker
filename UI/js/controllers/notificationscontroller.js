empTracker.controller("notificationsController", function ($scope, $state,$timeout) {

    $scope.text = "notifications";
    $scope.openmyaccount = function () {
        $state.go('myaccount');
    }
    $scope.showSubMenu = function () {
        $state.go('app.submenu');
    }
    $scope.markAllAsRead = function () {
        $scope.markAll = 'oldNotification';
        $timeout(function () {
            $state.go('app.home');
        },500)
    }
});
