empTracker.controller("changepasswordController", function ($scope, $state, $timeout, $rootScope, $ionicLoading, API, $window) {

    $scope.$on('$ionicView.enter', function () {
        $rootScope.toggledrag = true;
    });
    $scope.userData = {};
    $scope.notifications = function () {
        $state.go('app.notifications');
    }
    $scope.showSubMenu = function () {
        $state.go('app.submenu');
    }
    $scope.cancel = function () {
        window.history.back();
    }
    $scope.updateAccount = function (form) {
        if (form.$valid) {

            console.log($scope.userData.CurrentPassword);
            console.log($scope.userData.password);
            console.log($scope.userData.confirm);
            var req = {
                method: 'POST',
                url: '/api/Account/ChangePassword',
                data: { OldPassword: $scope.userData.CurrentPassword, NewPassword: $scope.userData.password, ConfirmPassword: $scope.userData.confirm }
            }
            // add true to use authentication token
            API.execute(req, true).then(function (_res) {
                console.log(_res);
                if (_res.data.code == 200) {
                    showConfirmation();
                    window.setTimeout(function () {
                        $state.go('app.myaccount');
                    }, 5500);
                }
                else {
                    console.log('wrong old password')
                }
            });


        }
    }
    $scope.openmyaccount = function () {
        $state.go('app.myaccount');
    }

    function showConfirmation() {
        $ionicLoading.show({
            scope: $scope,
            templateUrl: 'templates/passwordconfirmation.html',
            animation: 'slide-in-up'
        });

        $timeout(function () {
            $ionicLoading.hide();
        }, 5000);
    };

});
