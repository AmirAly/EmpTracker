empTracker.controller("LoginController", function ($scope, $state, API, $window) {
    $scope.submitForm = function (form) {
        console.debug($scope.name);
        console.debug($scope.password);
        console.debug($scope.companycode);

        if (form.$valid) {
            if ($scope.name == 'supervisor@bluewaves.com.au')
            {
                $state.go('supervisingemployees');
            }
            else {


                var req = {
                    method: 'POST',
                    url: '/api/user/login',
                    data: { email: $scope.name, password: $scope.password }
                }
                API.execute(req, false).then(function (_res) {
                    if (_res.data.code == 100) {
                        console.log(_res);
                        console.log(_res.data);
                        $window.localStorage['authenticationToken'] = _res.data.token;
                        $window.localStorage['userId'] = _res.data.data._id;
                        $state.go('tempdevicelogin');

                    }
                    else {
                        console.log(_res.data.message);
                    }
                });
                


            };
        }
    }
});
