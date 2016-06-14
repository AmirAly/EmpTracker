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

                    // get user data after login if redirect to dashboard
                    var req = {
                        method: 'GET',
                        url: '/api/Account/Profile',
                        data: {}
                    }
                    // add true to use authentication token
                    API.execute(req, true).then(function (_res) {
                        console.log(_res.data.code);
                        if (_res.data.code = 200) {
                            $scope.userName = _res.data.data.FirstName + ' ' + _res.data.data.LastName;
                            console.log($scope.userName);
                            $window.localStorage['UserName'] = $scope.userName;
                            $state.go('tempdevicelogin');
                        }
                    });
                }
                //else {
                //    $window.localStorage['authorizationToken'] = _res.data.token_type + " " + _res.data.access_token;
                //    console.log($window.localStorage['authorizationToken']);
                //    $state.go('supervisingemployees');
                //}
            });
        }
    }
});
