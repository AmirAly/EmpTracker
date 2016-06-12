empTracker.controller("LoginController", function ($scope, $state, API, $window) {
    $scope.name = 'sales@roster.com.au';
    $scope.password = 'Gotodaw2';
    $scope.companycode = 'DEV';
    $scope.submitForm = function (form) {
        if (form.$valid) {
            var req = {
                method: 'POST',
                url: '/Token',
                data: { UserName: $scope.name, Password: $scope.password, CompanyCode: $scope.companycode, grant_type: 'password' }
            }
            API.execute(req, false).then(function (_res) {
                console.log(_res);
                if (_res.error_description) {
                    console.log(error_description);
                }
                if (_res.data.userType == 'Employee') {
                    $window.localStorage['authorizationToken'] = _res.data.token_type + " " + _res.data.access_token;
                    console.log($window.localStorage['authorizationToken']);
                    $state.go('tempdevicelogin');
                }
                else {
                    $state.go('supervisingemployees');
                }
            });
        }
    }
});
