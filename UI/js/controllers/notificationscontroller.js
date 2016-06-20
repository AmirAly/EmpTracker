empTracker.controller("notificationsController", function ($scope, $state, $timeout, $http, $rootScope, API, $ionicLoading) {

    $scope.$on('$ionicView.enter', function () {
        $ionicLoading.show({
            content: 'Loading',
            animation: 'fade-in',
            showBackdrop: true,
            maxWidth: 200,
            showDelay: 0,
            template: '<i class="icon ion-loading-d"></i>'
        });
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
                $ionicLoading.hide();
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
        $ionicLoading.show({
            content: 'Loading',
            animation: 'fade-in',
            showBackdrop: true,
            maxWidth: 200,
            showDelay: 0,
            template: '<i class="icon ion-loading-d"></i>'
        });
        notificationIds = [];
        var counter = 0;
        for (var i = 0; i < $scope.allAlertsArray.length; i++) {
            if ($scope.allAlertsArray[i].IsRead==false) {
                notificationIds[counter] = $scope.allAlertsArray[i].ID;
                counter++;
            }
        }
        console.log(notificationIds);

        var req = {
            method: 'PUT',
            url: '/api/Notification',
            data: notificationIds
        }
        // add true to use authentication token
        API.execute(req, true).then(function (_res) {
            console.log(_res);
            if (_res.data.code == 200) {
                $ionicLoading.hide();
                $scope.markAll = 'oldNotification';
                $rootScope.notifictionsCounter = 0;
            }
            if (_res.data.code == 400) {
                $ionicLoading.hide();
            }
        });
    }

    // API here
    $scope.markOneAsRead = function (index, ID) {
        $ionicLoading.show({
            content: 'Loading',
            animation: 'fade-in',
            showBackdrop: true,
            maxWidth: 200,
            showDelay: 0,
            template: '<i class="icon ion-loading-d"></i>'
        });
        notificationIds = [];
        notificationIds[0] = ID;

        console.log(notificationIds);
        var req = {
            method: 'PUT',
            url: '/api/Notification',
            data:  notificationIds
        }
        // add true to use authentication token
        API.execute(req, true).then(function (_res) {
            //$rootScope.notifictionsCounter = 0;
            console.log(_res.data);
            if (_res.data.code == 200) {
                $ionicLoading.hide();
                var element = document.getElementById('notification' + index);
                element.classList.add("oldNotification");
                if ($rootScope.notifictionsCounter != 0) {
                    $rootScope.notifictionsCounter--;
                }
            }
            if (_res.data.code == 400) {
                $ionicLoading.hide();
            }
        });

    }

    $scope.notifications = function () {
        $state.go('app.notifications');
    }

});
