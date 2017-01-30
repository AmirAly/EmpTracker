empTracker.controller("changepasswordController", function ($scope, $state, $timeout, $rootScope, $ionicLoading, API, $window) {

    $scope.$on('$ionicView.enter', function () {
        $rootScope.toggledrag = true;
        $scope.userData = {};
        $scope.frmUpdatePassword.$setPristine();
        $scope.frmUpdatePassword.$setUntouched();
    });
    $scope.afterSubmitError = false;
    $scope.userData = {};
    $scope.showSubMenu = function () {
        $state.go('app.submenu');
    }

    $scope.cancel = function () {
        window.history.back();
    }
    $scope.updatePassword = function (form) {
        $scope.afterSubmitError = false;
        if (form.$valid) {

            $ionicLoading.show({
                content: 'Loading',
                animation: 'fade-in',
                showBackdrop: true,
                maxWidth: 200,
                showDelay: 0,
                template: '<i class="icon ion-loading-d"></i>'
            });
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
                    $ionicLoading.hide();
                    showConfirmation();
                    window.setTimeout(function () {
                        $state.go('app.myaccount');
                    }, 3500);
                }
                else {
                    $ionicLoading.hide();
                    console.log(_res.data.data[""][0]);
                    $rootScope.showToast(_res.data.data[""][0]);


                    $scope.afterSubmitError = true;
                    $scope.afterSubmitErrorTxt = 'wrong old password';
                    console.log('wrong old password')
                }
            }
            , function (error) {
                API.showTokenError(error);
            });


        }
    }
    $scope.openmyaccount = function () {
        $state.go('app.myaccount');
    }
    $scope.notifications = function () {
        $state.go('app.notifications');
    }

    function showConfirmation() {
        $ionicLoading.show({
            scope: $scope,
            templateUrl: 'templates/passwordconfirmation.html',
            animation: 'slide-in-up'
        });

        $timeout(function () {
            $ionicLoading.hide();
        }, 3000);
    };

});
