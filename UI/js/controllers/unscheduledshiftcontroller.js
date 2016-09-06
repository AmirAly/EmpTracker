empTracker.controller("unscheduledshiftController", function ($scope, $state) {
    $scope.openmyaccount = function () {
        $state.go('app.myaccount');
    }
    $scope.showSubMenu = function () {
        $state.go('app.submenu');
    }
    $scope.notifications = function () {
        $state.go('app.notifications');
    }
    $scope.$on('$ionicView.enter', function () {

    });
   
});