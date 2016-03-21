empTracker.controller("supervisoraccountController", function ($scope, $state) {
    $scope.text = 'supervisoraccountController';

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

    $scope.notifications = function () {
        $state.go('app.notifications');
    }
});

