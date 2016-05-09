empTracker.controller("supervisorchangepasswordController", function ($scope, $state, $ionicLoading, $timeout) {
    $scope.cancel = function () {
        window.history.back();
    }
    $scope.updateAccount = function (form) {
        if (form.$valid) {
            showConfirmation();

            window.setTimeout(function () {
                $state.go('supervisingemployees');
            }, 5500);
        }
    }
    $scope.openmyaccount = function () {
        $state.go('app.myaccount');
    }
    $scope.notifications = function () {
        $state.go('supervisornotifications');
    }

    function showConfirmation() {
        $ionicLoading.show({
            scope: $scope,
            templateUrl: 'templates/passwordConfirmation.html',
            animation: 'slide-in-up'
        });

        $timeout(function () {
            $ionicLoading.hide();
        }, 5000);
    };
});

