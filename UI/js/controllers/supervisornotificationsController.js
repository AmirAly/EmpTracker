empTracker.controller("supervisornotificationsController", function ($scope, $state, $timeout, $http) {
    $scope.openmyaccount = function () {
        $state.go('supervisoraccount');
    }

    $scope.markAllAsRead = function () {
        $scope.markAll = 'oldNotification';
    }


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
