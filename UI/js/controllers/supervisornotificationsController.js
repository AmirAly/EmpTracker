empTracker.controller("supervisornotificationsController", function ($scope, $state, $timeout, $http) {
    $scope.openmyaccount = function () {
        $state.go('supervisoraccount');
    }

    $scope.markAllAsRead = function () {
        $scope.markAll = 'oldNotification';
    }

    // get json from external file
    //$http.get('/json/notifications.json').then(function (data) {
    //    $scope.allNotificationsArray = data.data.notifications;
    //});
    $http.get('/json/alerts.json').then(function (data) {
        $scope.allAlertsArray = data.data.alerts;
    });
});
