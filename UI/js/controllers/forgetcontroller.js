empTracker.controller("forgetController", function ($scope, $state) {
    $scope.submitForm = function (form) {
        console.debug($scope.name);
        if (form.$valid) {
            $state.go('tempdevicelogin');
        }
    }
});
