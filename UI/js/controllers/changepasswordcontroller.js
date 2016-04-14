empTracker.controller("changepasswordController", function ($scope, $state, $timeout) {
    $scope.notifications = function () {
        $state.go('app.notifications');
    }
    $scope.showSubMenu = function () {
        $state.go('app.submenu');
    }
    $scope.cancel = function () {
        window.history.back();
    }
    $scope.updateAccount = function (form) {
        if (form.$valid) {
            $state.go('app.myaccount');
        }
    }
    $scope.openmyaccount = function () {
        $state.go('app.myaccount');
    }

});
