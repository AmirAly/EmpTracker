empTracker.controller("supervisornotificationsController", function ($scope, $state, $timeout) {
    $scope.openmyaccount = function () {
        $state.go('supervisoraccount');
    }
    $scope.notifications = function () {
        $state.go('supervisornotifications');
    }
    $scope.markAllAsRead = function () {
        $scope.markAll = 'oldNotification';
        $timeout(function () {
            window.history.back();
        }, 500)
    }
});
