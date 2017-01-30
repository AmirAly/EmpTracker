empTracker.controller("challengeController", function ($scope, $state, $timeout, $rootScope, $window, $http, $ionicHistory, $ionicLoading, API) {
    var stopped;


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
        $scope.counter = 30;
        $scope.stopCounter = false
        $scope.countdown = function () {
            if ($scope.stopCounter == false) {
                stopped = $timeout(function () {
                    if ($scope.counter != 0 && $scope.stopCounter == false)
                        $scope.countdown();
                    else {
                        if ($scope.counter == 0) {
                            //user didn't answerd & counter end
                            console.log('time ended with no answer');
                            //call failed api back with ionic history
                            $scope.failedChallenge();
                            return false
                        }
                        else {
                            //user answerd & counter stopped
                            $ionicHistory.goBack();
                            return false
                        }
                    };
                    $scope.counter--;
                }, 1000);
            }

        };
        $scope.countdown();
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
            $scope.failedChallenge();
        }
    }

    $scope.failedChallenge = function () {
        $rootScope.currentUserLatitude = 0;
        $rootScope.currentUserLongitude = 0;
        console.log('emp sleep');

        //$ionicLoading.show({
        //    content: 'Loading',
        //    animation: 'fade-in',
        //    showBackdrop: true,
        //    maxWidth: 200,
        //    showDelay: 0,
        //    template: '<i class="icon ion-loading-d"></i>'
        //});
        $rootScope.getCurrentLocation();
        $scope.$watch('$root.currentUserLongitude', function () {
            if ($rootScope.currentUserLongitude != 0) {
                console.log($rootScope.currentUserLatitude);
                console.log($rootScope.currentUserLongitude);

                $scope.today = new Date();
                $scope.currentTime = $scope.today.getFullYear() + '-' + ($scope.today.getMonth() + 1) + '-' + $scope.today.getDate() + ' ' + $scope.today.getHours() + ':' + $scope.today.getMinutes() + ':' + $scope.today.getSeconds();
                console.log($scope.currentTime);
                var req = {
                    method: 'POST',
                    url: '/api/Attendance/Log/FailedChallengeQuestion',
                    data: {
                        //CurrentTime: $scope.currentTime,
                        Longitude: $rootScope.currentUserLongitude,
                        Latitude: $rootScope.currentUserLatitude,
                        GPSTrackingMethod: 'Network',
                        PunchedVia: 'MOB',
                        BatteryLevel: '',
                        SoundLevel: '',
                        Vibration: ''
                    }
                }
                // add true to use authentication token
                API.execute(req, true).then(function (_res) {
                    console.log(_res);
                    if (_res.data.code == 200) {
                        //$ionicLoading.hide();
                        $ionicHistory.goBack();
                    }
                    else {
                        console.log(_res.data.data);
                        $rootScope.showToast(_res.data.data);
                        $ionicHistory.goBack();
                    }

                }, function (error) {
                    API.showTokenError(error);
                }).finally(function () {
                    $ionicHistory.goBack();
                });
            }
        });

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