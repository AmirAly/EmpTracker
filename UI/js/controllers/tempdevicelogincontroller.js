empTracker.controller("tempdeviceloginController", function ($scope, $state, API, $window, $rootScope, $ionicLoading) {
    $scope.tempLogin = function () {
        $window.localStorage['IsTempLogin'] = true;
        $state.go('app.shiftview');
    }


    // Wait for device API libraries to load
    //
    document.addEventListener("deviceready", onDeviceReady, false);

    // device APIs are available
    //
    function onDeviceReady() {
        console.log( 'Device Name: ' + device.name + '<br />' +
                    'Device Cordova: ' + device.cordova + '<br />' +
                    'Device Platform: ' + device.platform + '<br />' +
                    'Device UUID: ' + device.uuid + '<br />' +
                    'Device Model: ' + device.model + '<br />' +
                    'Device Version: ' + device.version);
    }

    $scope.newDeviceLogin = function () {
        $scope.IMEI = '';
        $scope.DeviceType = '';
        $scope.DeviceName = '';

        $scope.MessagingRegistrationNo = '';
        $scope.HasBuiltInCamera = '';

        // add new device
        var req = {
            method: 'POST',
            url: '/api/Device',
            data: { IMEI: $scope.IMEI, DeviceType: $scope.DeviceType, DeviceName: $scope.DeviceName, MessagingRegistrationNo: $scope.MessagingRegistrationNo, HasBuiltInCamera: $scope.HasBuiltInCamera }
        }
        // add true to use authentication token
        API.execute(req, true).then(function (_res) {
            console.log(_res.data);
            if (_res.data.code === 200) {
                $state.go('app.dashboard');
            }

        });
    }
});