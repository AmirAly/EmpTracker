empTracker.controller("forgetController", function ($scope, $state) {
    $scope.submitForm = function (form) {
        console.debug($scope.email);
        if (form.$valid) {
            $state.go('tempdevicelogin');
        }
    }
});
