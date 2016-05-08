empTracker.controller("challengeController", function ($scope, $state, $timeout, $rootScope) {

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
    $scope.counter = 60;
    var stopped;

    $scope.countdown = function () {
        stopped = $timeout(function () {
            $scope.counter--;
            if ($scope.counter != 0)
                $scope.countdown();
            else return false;
        }, 1000);
    };
    $scope.rightAnswer = function () {
        $state.go('app.home');
    }

});
