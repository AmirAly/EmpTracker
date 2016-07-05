empTracker.controller("tempdeviceloginController", function ($scope, $state, API, $window, $rootScope, $ionicLoading) {
    $scope.tempLogin = function () {
        $window.localStorage['IsTempLogin'] = true;
        $state.go('app.shiftview');
    }

    $scope.logout = function () {
        $window.localStorage['IsTempLogin'] = false;
        localStorage.clear();
        $state.go('login');
    }

    $scope.newDeviceLogin = function () {
        $scope.IMEI = '';
        $scope.DeviceType = '';
        $scope.DeviceName = '';
        $scope.MessagingRegistrationNo = '';
        $scope.HasBuiltInCamera = '';

        $state.go('app.dashboard');
        //// add new device
        //var req = {
        //    method: 'POST',
        //    url: '/api/Device',
        //    data: { IMEI: $scope.IMEI, DeviceType: $scope.DeviceType, DeviceName: $scope.DeviceName, MessagingRegistrationNo: $scope.MessagingRegistrationNo, HasBuiltInCamera: $scope.HasBuiltInCamera }
        //}
        //// add true to use authentication token
        //API.execute(req, true).then(function (_res) {
        //    console.log(_res.data);
        //    if (_res.data.code === 200) {
        //        $state.go('app.dashboard');
        //    }
        //});
    }
});