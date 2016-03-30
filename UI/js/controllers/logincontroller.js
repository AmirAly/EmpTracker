empTracker.controller("LoginController", function ($scope, $state) {
    $scope.submitForm = function (form) {
        console.debug($scope.name);
        if (form.$valid) {
            if ($scope.name == 'supervisor@bluewaves.com.au')
            { $state.go('supervisingemployees'); }
            else { ($state.go('tempdevicelogin')) };
        }

    }
});
