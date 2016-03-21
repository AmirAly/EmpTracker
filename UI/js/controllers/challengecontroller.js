empTracker.controller("challengeController", function ($scope, $state, $timeout) {

    $scope.text = "challenge";
    $scope.openmyaccount = function () {
        $state.go('myaccount');
    }
    $scope.showSubMenu = function () {
        $state.go('app.submenu');
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
