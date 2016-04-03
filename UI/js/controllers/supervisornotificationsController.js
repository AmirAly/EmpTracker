empTracker.controller("supervisornotificationsController", function ($scope, $state, $timeout) {
    $scope.openmyaccount = function () {
        $state.go('supervisoraccount');
    }
    $scope.notifications = function () {
        window.history.back();
    }
    $scope.markAllAsRead = function () {
        $scope.markAll = 'oldNotification';
    }
});
