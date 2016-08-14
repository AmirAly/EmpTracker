﻿empTracker.controller("supervisorchangepasswordController", function ($scope,$rootScope, $state, $timeout, $ionicLoading, API, $window) {
    $scope.afterSubmitError = false;
    $scope.userData = {};
    $scope.$on('$ionicView.enter', function () {
        $rootScope.toggledrag = true;
        $scope.userData = {};
        $scope.frmUpdatePassword.$setPristine();
        $scope.frmUpdatePassword.$setUntouched();
    });
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
                        $state.go('supervisormenu.supervisingemployees');
                    }, 3500);
                }
                else {
                    $ionicLoading.hide();
                    $scope.afterSubmitError = true;
                    $scope.afterSubmitErrorTxt = 'wrong old password';
                    console.log('wrong old password')
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
    }
    $scope.openmyaccount = function () {
        $state.go('app.myaccount');
    }
    $scope.notifications = function () {
        $state.go('supervisornotifications');
    }

    function showConfirmation() {
        $ionicLoading.show({
            scope: $scope,
            templateUrl: 'templates/passwordConfirmation.html',
            animation: 'slide-in-up'
        });

        $timeout(function () {
            $ionicLoading.hide();
        }, 3000);
    };
});