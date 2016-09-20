empTracker.controller("tempdeviceloginController", function ($scope, $state, API, $window, $rootScope, $ionicLoading) {
    $scope.logout = function () {
        $rootScope.UserIsInShift = false;
        $window.localStorage['IsTempLogin'] = false;
        localStorage.clear();
        $state.go('login');
    }

    $scope.newDeviceLogin = function () {
        $ionicLoading.show({
            content: 'Loading',
            animation: 'fade-in',
            showBackdrop: true,
            maxWidth: 200,
            showDelay: 0,
            template: '<i class="icon ion-loading-d"></i>'
        });
        $scope.DeviceType = 'w';
        $scope.DeviceName = 'w';
        $scope.MessagingRegistrationNo = 'w';
        $scope.HasBuiltInCamera = true;
        $scope.IsTemporaryDevice = false;

        // add new device
        var req = {
            method: 'POST',
            url: '/api/Device',
            data: {
                IMEI: $rootScope.IMEI,
                DeviceType: $scope.DeviceType,
                DeviceName: $scope.DeviceName,
                MessagingRegistrationNo: $scope.MessagingRegistrationNo,
                HasBuiltInCamera: $scope.HasBuiltInCamera,
                IsTemporaryDevice: $scope.IsTemporaryDevice
            }
        }
        // add true to use authentication token
        API.execute(req, true).then(function (_res) {
            console.log(_res.data);
            if (_res.data.code === 200) {
                $ionicLoading.hide();
                // empolyee
                if ($rootScope.isSupervisor == false) {
                    $state.go('app.dashboard');
                }
                    // supevisor
                else {
                    $state.go('supervisingemployees');
                }
            }
        }, function (error) {
            API.showTokenError(error);
        });
    }

    $scope.tempDeviceLogin = function () {
        $ionicLoading.show({
            content: 'Loading',
            animation: 'fade-in',
            showBackdrop: true,
            maxWidth: 200,
            showDelay: 0,
            template: '<i class="icon ion-loading-d"></i>'
        });
        $scope.DeviceType = 'w';
        $scope.DeviceName = 'w';
        $scope.MessagingRegistrationNo = 'w';
        $scope.HasBuiltInCamera = true;
        $scope.IsTemporaryDevice = true;

        // use temp device
        var req = {
            method: 'POST',
            url: '/api/Device',
            data: {
                IMEI: $rootScope.IMEI,
                DeviceType: $scope.DeviceType,
                DeviceName: $scope.DeviceName,
                MessagingRegistrationNo: $scope.MessagingRegistrationNo,
                HasBuiltInCamera: $scope.HasBuiltInCamera,
                IsTemporaryDevice: $scope.IsTemporaryDevice
            }
        }
        // add true to use authentication token
        API.execute(req, true).then(function (_res) {
            console.log(_res.data);
            if (_res.data.code === 200) {
                var loginCode = _res.data.code;
                console.log('loginCode ' + loginCode);
                $window.localStorage['IsTempLogin'] = true;
                $ionicLoading.hide();

                // empolyee
                if ($rootScope.isSupervisor == false) {
                    $state.go('app.shiftview');
                }
                    // supevisor
                else {
                    $state.go('supervisingemployees');
                }
            }
        }
        , function (error) {
            API.showTokenError(error);
        });
    }

});