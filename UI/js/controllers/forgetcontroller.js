empTracker.controller("forgetController", function ($scope, $state, API, $ionicLoading, $window) {
    $scope.afterSendResponceTxt = '';
    $scope.frmmForget = {};
    $scope.frmmForget.emailAddress = '';
    $scope.frmmForget.companycode = '';

    $scope.submitForm = function (form) {
        console.log($scope.frmmForget.emailAddress);
        console.log($scope.frmmForget.companycode);
        $scope.afterSendResponceTxt = '';
        console.debug($scope.emailAddress);
        if (form.$valid) {
            $ionicLoading.show({
                content: 'Loading',
                animation: 'fade-in',
                showBackdrop: true,
                maxWidth: 200,
                showDelay: 0,
                template: '<i class="icon ion-loading-d"></i>'
            });
            var req = {
                method: 'POST',
                url: '/api/Account/ForgotPassword?companyCode=' + $scope.frmmForget.companycode + '&email=' + $scope.frmmForget.emailAddress,
                data: {}
            }
            API.execute(req, false).then(function (_res) {
                console.log(_res.data);
                if (_res.data.code == 200) {
                    console.log(_res.data.data);
                    $scope.afterSendResponceTxt = _res.data.data;
                }
                $ionicLoading.hide();
            }
            , function (error) {
                console.log(error);
                console.log(error.data); /* catch 400  Error here */
                $ionicLoading.hide();
                $window.localStorage['IsTempLogin'] = false;
                localStorage.clear();
                $state.go('login');
            }
            );
            //$state.go('tempdevicelogin');
        }
    }
});
