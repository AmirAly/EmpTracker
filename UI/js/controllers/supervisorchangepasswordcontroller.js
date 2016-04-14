empTracker.controller("supervisorchangepasswordController", function ($scope, $state) {
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
    $scope.notifications = function () {
        $state.go('supervisornotifications');
    }
});

