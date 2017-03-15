empTracker.controller("tempdeviceloginController", function ($scope, $state, $ionicPopup, LocalStorage, API, $window, $rootScope, $ionicLoading) {
    $scope.logout = function () {
        $rootScope.UserIsInShift = false;
        $window.localStorage['IsTempLogin'] = false;
        localStorage.clear();
        $state.go('login');
    }
        //$rootScope.DeviceType = 'w';
        //$rootScope.DeviceName  = 'w';
        //$rootScope.MessagingRegistrationNo = 'w';
        //$rootScope.HasBuiltInCamera = true;
        //$scope.IsTemporaryDevice = false;


    $scope.newDeviceLogin = function () {
        $ionicLoading.show({
            content: 'Loading',
            animation: 'fade-in',
            showBackdrop: true,
            maxWidth: 200,
            showDelay: 0,
            template: '<i class="icon ion-loading-d"></i>'
        });


        // add new device
        var req = {
            method: 'POST',
            url: '/api/Device',
            data: {
                IMEI: $rootScope.IMEI,
                DeviceType: $rootScope.DeviceType,
                DeviceName: $rootScope.DeviceName ,
                MessagingRegistrationNo: $rootScope.MessagingRegistrationNo,
                HasBuiltInCamera: $rootScope.HasBuiltInCamera,
                IsTemporaryDevice: false
            }
        }
        // add true to use authentication token
        API.execute(req, true).then(function (_res) {
            console.log(_res);
            if (_res.data.code == 200 || _res.data.code == 20) {
                $ionicLoading.hide();
                // empolyee
                if ($rootScope.isSupervisor == false) {
                    $state.go('app.dashboard');
                }
                    // supevisor
                else {
                    $state.go('supervisormenu.supervisingemployees');
                }
            }
            else {
                $ionicLoading.hide();
                $rootScope.showToast(_res.data.data);
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

        // use temp device
        var req = {
            method: 'POST',
            url: '/api/Device',
            data: {
                IMEI: $rootScope.IMEI,
                DeviceType: $rootScope.DeviceType,
                DeviceName: $rootScope.DeviceName ,
                MessagingRegistrationNo: $rootScope.MessagingRegistrationNo,
                HasBuiltInCamera: $rootScope.HasBuiltInCamera,
                IsTemporaryDevice: true
            }
        }
        // add true to use authentication token
        API.execute(req, true).then(function (_res) {
            console.log(_res.data);
            if (_res.data.code == 200) {
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
            else {
                $ionicLoading.hide();
                $rootScope.showToast(_res.data.data);
            }
        }
        , function (error) {
            API.showTokenError(error);
        });
    }

});