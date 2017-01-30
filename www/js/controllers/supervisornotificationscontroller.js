empTracker.controller("supervisornotificationsController", function ($scope, $rootScope, $state, $timeout, $ionicLoading, API, $window) {
    $scope.$on('$ionicView.enter', function () {
        $rootScope.toggledrag = true;
        $ionicLoading.show({
            content: 'Loading',
            animation: 'fade-in',
            showBackdrop: true,
            maxWidth: 200,
            showDelay: 0,
            template: '<i class="icon ion-loading-d"></i>'
        });
        $scope.fillData();
    });
    $scope.fillData = function () {
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
                $scope.$broadcast('scroll.refreshComplete');
                $scope.allAlertsArray = _res.data.data;
                for (var i = 0; i < _res.data.data.length; i++) {
                    // UTC time
                    console.log(_res.data.data[i].UtcDateCreated);
                    // Local time
                    var localTime = API.convertUTCToLocalTime(_res.data.data[i].UtcDateCreated);
                    _res.data.data[i].shownDate = localTime;
                    if (_res.data.data[i].IsRead == false) {
                        $rootScope.notifictionsCounter++;
                    }
                }
                $ionicLoading.hide();
            }
            else {
                console.log(_res.data.data);
                $rootScope.showToast(_res.data.data);
                $ionicLoading.hide();
            }
        }, function (error) {
            API.showTokenError(error);
        });
    }
    $scope.openmyaccount = function () {
        $state.go('supervisoraccount');
    }

    $scope.markAllAsRead = function () {
        $scope.markAll = 'oldNotification';
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
            if ($scope.allAlertsArray[i].IsRead == false) {
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
            else {
                console.log(_res.data.data);
                $rootScope.showToast(_res.data.data);
                $ionicLoading.hide();
            }
        }, function (error) {
            API.showTokenError(error);
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
            data: notificationIds
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
            else {
                console.log(_res.data.data);
                $rootScope.showToast(_res.data.data);
                $ionicLoading.hide();
            }
        }, function (error) {
            API.showTokenError(error);
        });

    }

    $scope.notifications = function () {
        //$state.go('supervisingemployees');
        window.history.back();
    }
});
