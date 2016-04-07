empTracker.controller("supervisornotificationsController", function ($scope, $state, $timeout, $http) {
    $scope.openmyaccount = function () {
        $state.go('supervisoraccount');
    }
    $scope.notifications = function () {
        window.history.back();
    }
    $scope.markAllAsRead = function () {
        $scope.markAll = 'oldNotification';
    }

    // get json from external file
    $http.get('/json/notifications.json').then(function (data) {
        $scope.allNotificationsArray = data.data.notifications;
    });
});
