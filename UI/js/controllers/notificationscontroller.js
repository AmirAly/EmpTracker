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


    if (ionic.Platform.isAndroid()) {
        // get json from external file
        $http.get('/android_asset/www/json/alerts.json').then(function (data) {
            $scope.allAlertsArray = data.data.alerts;
        });
    }
    else {
        // get json from external file
        $http.get('/json/alerts.json').then(function (data) {
            $scope.allAlertsArray = data.data.alerts;
        });
    }
});
