empTracker.controller("myaccountController", function ($scope, $state, $rootScope) {

    $scope.$on('$ionicView.enter', function () {
        $rootScope.toggledrag = true;
    });

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
    $scope.notifications = function () {
        $state.go('app.notifications');
    }
    
});

