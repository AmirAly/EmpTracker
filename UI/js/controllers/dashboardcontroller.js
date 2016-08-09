empTracker.controller("dashboardController", function ($scope, $state, $rootScope, $window) {

    $scope.$on('$ionicView.enter', function () {
        $rootScope.toggledrag = true;
    });
    $scope.openmyaccount = function () {
        $state.go('app.myaccount');
    }
    $scope.showSubMenu = function () {
        $state.go('app.submenu');
    }
    $scope.notifications = function () {
        $state.go('app.notifications');
    }
});