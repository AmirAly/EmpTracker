empTracker.controller("shiftviewController", function ($scope, $state, $ionicPopup, $timeout,$rootScope) {

    $scope.$on('$ionicView.enter', function () {
        $rootScope.toggledrag = true;
    });
    $scope.shiftNotes = 'This IS Shift Notes About Condell Park';
    $scope.openmyaccount = function () {
        $state.go('app.myaccount');
    }
    $scope.showSubMenu = function () {
        $state.go('app.submenu');
    }
    $scope.notifications = function () {
        $state.go('app.notifications');
    }
    $scope.goBack = function () {
        window.history.back();
    }
    $scope.updateNotes = function (text) {
        console.log(text);
    }
    $scope.viewMap = function () {
        $state.go('app.viewmap');
    }
    $scope.load = function () {
        $scope.clockOut = false;
        $scope.minutes = 0;
        $scope.seconds = 0;
        $scope.timecounter = 0;
    }
    $scope.load();
    var stopped;
    // A confirm dialog
    $scope.showConfirmIn = function () {
        var confirmPopup = $ionicPopup.confirm({
            cssClass: 'bluePopup',
            title: '<i class="ion-information-circled "></i> Confirm Clock-In',
            template: 'Are you sure you want to check in?'
        });

        confirmPopup.then(function (res) {
            if (res) {
                console.log('You are sure In');
                $scope.clockOut = true;
                $scope.breakOut = false;
            } else {
                console.log('You are not sure In');
            }
        });
    };

    $scope.showConfirmOut = function () {
        var confirmPopup = $ionicPopup.confirm({
            cssClass: 'redPopup',
            title: '<i class="ion-information-circled "></i> Confirm Clock-Out',
            template: 'Are you sure you want to check out?'
        });

        confirmPopup.then(function (res) {
            if (res) {
                console.log('You are sure Out');
                $scope.clockOut = false;
                $scope.breakOut = false;
            } else {
                console.log('You are not sure Out');
            }
        });
    };
    var count = true;
    $scope.takeBreak = function () {
        $scope.breakOut = true;
        
        count = true;
        $scope.timecounter = 0;
        $scope.countdown = function () {
            stopped = $timeout(function () {
                $scope.timecounter++;
                if ($scope.timecounter != 0 && count == true && $scope.timecounter <= 90) {
                    console.log($scope.timecounter);
                    $scope.minutes = parseInt(($scope.timecounter / 60));
                    $scope.seconds = ($scope.timecounter % 60);
                    console.log($scope.minutes);
                    console.log($scope.seconds);
                    $scope.countdown();
                }
                else return false;
            }, 1000);
        };
        $scope.countdown();
    }
    $scope.finishBreak = function () {
        count = false;
        $scope.timecounter = -1;
        $scope.minutes = 0;
        $scope.seconds = 0;
        $scope.breakOut = false;
    }
});