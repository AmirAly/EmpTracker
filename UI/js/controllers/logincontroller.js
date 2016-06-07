empTracker.controller("LoginController", function ($scope, $state, API, $window) {
    $scope.submitForm = function (form) {
        //console.debug($scope.name);
        //console.debug($scope.password);
        //console.debug($scope.companycode);

        if (form.$valid) {
            if ($scope.name == 'supervisor@bluewaves.com.au')
            {
                $state.go('supervisingemployees');
            }
            else {

                var req = {
                    method: 'POST',
                    url: '/Token',
                    data: { UserName: $scope.name, Password: $scope.password, CompanyCode: 'DEV', grant_type: 'password' }
                }
                API.execute(req, false).then(function (_res) {
                    console.log(_res);
                    if (error_description) {
                        console.log(error_description);
                    }
                    //if (_res.data.code == 100) {
                    //    console.log(_res.data);
                    //    $window.localStorage['authenticationToken'] = _res.data.token;
                    //    $state.go('tempdevicelogin');
                    //}
                    //else {
                    //    console.log(_res.data.message);
                    //}
                });
                


            };
        }
    }
});
