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
        }, function (error) {
            console.log(error);
            console.log(error.data); /* catch 400  Error here */
            $ionicLoading.hide();
            $window.localStorage['IsTempLogin'] = false;
            localStorage.clear();
            $state.go('login');
        });
    });

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
            if (_res.data.code == 400) {
                $ionicLoading.hide();
            }
        }, function (error) {
            console.log(error);
            console.log(error.data); /* catch 400  Error here */
            $ionicLoading.hide();
            $window.localStorage['IsTempLogin'] = false;
            localStorage.clear();
            $state.go('login');
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
            if (_res.data.code == 400) {
                $ionicLoading.hide();
            }
        }, function (error) {
            console.log(error);
            console.log(error.data); /* catch 400  Error here */
            $ionicLoading.hide();
            $window.localStorage['IsTempLogin'] = false;
            localStorage.clear();
            $state.go('login');
        });

    }

    $scope.notifications = function () {
        //$state.go('supervisingemployees');
        window.history.back();
    }
});
