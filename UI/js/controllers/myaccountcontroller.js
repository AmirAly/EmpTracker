empTracker.controller("myaccountController", function ($scope, $state) {
    $scope.text = 'myaccountController';
    $scope.cancel = function () {
        $state.go('supervisingemployees');
    }
    $scope.updateAccount = function (form) {
        if (form.$valid) {
            $state.go('supervisingemployees');
        }
    }
    $scope.openmyaccount = function () {
        $state.go('myaccount');
    }
    $scope.logout = function () {
        $state.go('login');
    }
});

