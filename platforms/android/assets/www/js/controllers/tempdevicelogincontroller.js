empTracker.controller("tempdeviceloginController", function ($scope, $state,$ionicPopup,LocalStorage, API, $window, $rootScope, $ionicLoading) {
    $scope.logout = function () {
        if ($rootScope.UserIsInShift == true) {
            // You can't log out as you still clocked in shift
            $rootScope.showToast("You can't logout as you still clocked in a shift");
        }
        else {
            var confirmPopup = $ionicPopup.confirm({
                cssClass: 'bluePopup',
                title: '<i class="ion-information-circled "></i> Confirm Log Out',
                template: 'Are you sure you want to Logout?'
            });

            confirmPopup.then(function (res) {
                if (res) {
                    console.log('You are sure In');
                    // logout
                    LocalStorage.clear('UserLocalObject');
                    $rootScope.UserIsInShift = false;
                    $window.localStorage['IsTempLogin'] = false;
                    localStorage.clear();
                    $state.go('login');
                } else {
                    console.log('You are not sure In');
                }
            });
            
        }
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
        
       
       
        $scope.HasBuiltInCamera = true;
        $scope.IsTemporaryDevice = false;

        // add new device
        var req = {
            method: 'POST',
            url: '/api/Device',
            data: {
                IMEI: $rootScope.IMEI,
                DeviceType: $rootScope.DeviceType,
                DeviceName: $rootScope.DeviceName,
                MessagingRegistrationNo: $rootScope.MessagingRegistrationNo,
                HasBuiltInCamera: $scope.HasBuiltInCamera,
                IsTemporaryDevice: $scope.IsTemporaryDevice
            }
        }
        console.log(JSON.stringify(req.data));
        // add true to use authentication token
        API.execute(req, true).then(function (_res) {
            console.log(JSON.stringify(_res.data));
            if (_res.data.code == 200) {
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
       
        
        $scope.HasBuiltInCamera = true;
        $scope.IsTemporaryDevice = true;

        // use temp device
        var req = {
            method: 'POST',
            url: '/api/Device',
            data: {
                IMEI: $rootScope.IMEI,
                DeviceType: $rootScope.DeviceType,
                DeviceName: $rootScope.DeviceName,
                MessagingRegistrationNo: $rootScope.MessagingRegistrationNo,
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