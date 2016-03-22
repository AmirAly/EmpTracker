empTracker.controller("LoginController", function ($scope, $state) {
    $scope.submitForm = function (form) {
        if (form.$valid) {
            if ($scope.frmLogin.name == 'supervisor@bluewaves.com.au')
                $state.go('supervisingemployees');
            else ($state.go('tempdevicelogin'));
        }
    }
});
