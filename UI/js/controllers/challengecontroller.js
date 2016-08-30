empTracker.controller("challengeController", function ($scope, $state, $timeout, $rootScope, $window, $http, $ionicHistory) {
    $scope.counter = 30;
    $scope.stopCounter = false
    var stopped;
    $scope.countdown = function () {
        if ($scope.stopCounter == false) {
            stopped = $timeout(function () {
                if ($scope.counter != 0 && $scope.stopCounter == false)
                    $scope.countdown();
                else {
                    if ($scope.counter == 0) {
                        //user didn't answerd
                        console.log('time ended with no answer');
                        //call failed api back with ionic history
                        //..
                        return false
                    }
                    else {
                        //user answerd & counter stopped
                        return false
                    }
                };
                $scope.counter--;
            }, 1000);
        }

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

    // answer question
    $scope.answer = function (_answer) {
        $scope.stopCounter = true;
        if (_answer == $scope.question.rightanswer) {
            console.log('match');
            $ionicHistory.goBack();
        }
        else {
            console.log('wrong answer');
            //call failed api back with ionic history
            //..
        }
    }

});

empTracker.directive('animateOnChange', function ($animate, $timeout) {
    return function (scope, elem, attr) {
        scope.$watch(attr.animateOnChange, function (newValue, oldValue) {
            // apply effect from 5 to down only
            if (newValue <= 5) {
                // effect check if value changed
                if (newValue != oldValue) {
                    var c = newValue > oldValue ? 'change-up' : 'change';
                    $animate.addClass(elem, c).then(function () {
                        $timeout(function () { $animate.removeClass(elem, c) });
                    });
                }
            }
        })
    }
})