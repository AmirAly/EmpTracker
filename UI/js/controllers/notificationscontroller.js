empTracker.controller("notificationsController", function ($scope, $state, $timeout, $http) {
    $scope.openmyaccount = function () {
        $state.go('app.myaccount');
    }
    $scope.showSubMenu = function () {
        $state.go('app.submenu');
    }
    $scope.markAllAsRead = function () {
        $scope.markAll = 'oldNotification';
    }
    $scope.notifications = function () {
        $state.go('app.notifications');
    }
    // get json from external file
    //$http.get('/json/notifications.json').then(function (data) {
    //    $scope.allNotificationsArray = data.data.notifications;
    //});

    $http.get('/json/alerts.json').then(function (data) {
        $scope.allAlertsArray = data.data.alerts;
    });
});
