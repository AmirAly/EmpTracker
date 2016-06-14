empTracker.controller("notificationsController", function ($scope, $state, $timeout, $http, $rootScope, API, $filter) {

    $scope.$on('$ionicView.enter', function () {
        $rootScope.toggledrag = true;
        var req = {
            method: 'GET',
            url: '/api/Notification',
            data: {}
        }
        // add true to use authentication token
        API.execute(req, true).then(function (_res) {
            $rootScope.notifictionsCounter = 0;
            console.log(_res.data);
            if (_res.data.code = 200) {
                $scope.allAlertsArray = _res.data.data;
                for (var i = 0; i < _res.data.data.length; i++) {
                    if (_res.data.data[i].IsRead == false) {
                        $rootScope.notifictionsCounter++;
                    }
                }
            }
        });
    });

    $scope.openmyaccount = function () {
        $state.go('app.myaccount');
    }
    $scope.showSubMenu = function () {
        $state.go('app.submenu');
    }

    // API here
    $scope.markAllAsRead = function () {
        $scope.markAll = 'oldNotification';
        $rootScope.notifictionsCounter = 0;
    }

    // API here
    $scope.markOneAsRead = function (index, ID) {
        notificationIds = [];
        notificationIds[0] = ID;

        var req = {
            method: 'PUT',
            url: '/api/Notification',
            data: { notificationIds: notificationIds }
        }
        // add true to use authentication token
        API.execute(req, true).then(function (_res) {
            $rootScope.notifictionsCounter = 0;
            console.log(_res.data);
            if (_res.data.code === 200) {
                var element = document.getElementById('notification' + index);
                element.classList.add("oldNotification");
                if ($rootScope.notifictionsCounter != 0) {
                    $rootScope.notifictionsCounter--;
                }
            }
        });

    }

    $scope.notifications = function () {
        $state.go('app.notifications');
    }



    //if (ionic.Platform.isAndroid()) {
    //    // get json from external file
    //    $http.get('/android_asset/www/json/alerts.json').then(function (data) {
    //        $scope.allAlertsArray = data.data.alerts;
    //    });
    //}
    //else {
    //    // get json from external file
    //    $http.get('/json/alerts.json').then(function (data) {
    //        $scope.allAlertsArray = data.data.alerts;
    //    });
    //}
});
