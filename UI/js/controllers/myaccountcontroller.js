empTracker.controller("myaccountController", function ($scope, $state) {
    $scope.text = 'myaccountController';
    $scope.cancel = function () {
        window.history.back();
    }
    $scope.updateAccount = function (form) {
        if (form.$valid) {
            $state.go('supervisingemployees');
        }
    }
    $scope.openmyaccount = function () {
        $state.go('app.myaccount');
    }

});

