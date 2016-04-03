empTracker.controller("notificationsController", function ($scope, $state, $timeout) {
    $scope.openmyaccount = function () {
        $state.go('app.myaccount');
    }
    $scope.showSubMenu = function () {
        $state.go('app.submenu');
    }
    $scope.markAllAsRead = function () {
        $scope.markAll = 'oldNotification';
    }
});
