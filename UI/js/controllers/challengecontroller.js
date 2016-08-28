empTracker.controller("challengeController", function ($scope, $state, $timeout, $rootScope, $window, $http) {
    $scope.counter = 30;
    var stopped;
    $scope.countdown = function () {
        stopped = $timeout(function () {
            $scope.counter--;
            if ($scope.counter != 0)
                $scope.countdown();
            else {
                console.log('time ended');
                //call failed api back with ionic history
                //..
                return false
            };
        }, 1000);
    };

    $scope.$on('$ionicView.enter', function () {
        $rootScope.toggledrag = false;
        $scope.challengeQuestionsArray = {};
        if (ionic.Platform.isAndroid()) {
            // get json from external file & call choose randam question to show
            $http.get('/android_asset/www/json/challengequestion.json').then(function (data) {
                $scope.challengeQuestionsArray = data.data.questions;
                $scope.randamQuestion();
            });
        }
        else {
            // get json from external file & call choose randam question to show
            $http.get('/json/challengequestion.json').then(function (data) {
                $scope.challengeQuestionsArray = data.data.questions;
                $scope.randamQuestion();
            });
        }
    });

    // choose randam question to show
    $scope.randamQuestion = function () {
        console.log($scope.challengeQuestionsArray);
        $scope.question = $scope.challengeQuestionsArray[Math.floor(Math.random() * $scope.challengeQuestionsArray.length)];
        console.log($scope.question);
    }

});
