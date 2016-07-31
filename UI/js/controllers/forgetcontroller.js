empTracker.controller("forgetController", function ($scope, $state, API, $ionicLoading) {
    $scope.afterSendResponceTxt = '';
    $scope.submitForm = function (form) {
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
                url: '/api/Account/ForgotPassword?companyCode=' + $scope.companycode + '&email=' + $scope.emailAddress,
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
            //, function (error) {
            //    $scope.afterLoginError = true;
            //    console.log(error.data); /* catch 400  Error here */
            //    $scope.afterLoginErrorTxt = error.data.error_description;
            //    $ionicLoading.hide();
            //}
            );
            //$state.go('tempdevicelogin');
        }
    }
});
