empTracker.controller("myaccountController", function ($scope, $state) {
    $scope.cancel = function () {
        window.history.back();
    }
    $scope.updateAccount = function (form) {
        if (form.$valid) {
            $state.go('app.home');
        }
    }
    $scope.openmyaccount = function () {
        $state.go('app.myaccount');
    }
});

