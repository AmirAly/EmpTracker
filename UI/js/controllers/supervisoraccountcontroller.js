empTracker.controller("supervisoraccountController", function ($scope, $state, $ionicLoading) {
    $scope.cancel = function () {
        $state.go('supervisingemployees');
    }

    $scope.updateAccount = function (form) {
        if (form.$valid) {
            $state.go('supervisingemployees');
        }
    }
    $scope.openmyaccount = function () {
        $state.go('supervisoraccount');
    }

    $scope.notifications = function () {
        $state.go('supervisornotifications');
    }

    $scope.employeeNO = '150SB7';
    $scope.name = 'Amir Aly';

    $scope.openImgDialog = function () {
        $ionicLoading.show({
            scope: $scope,
            templateUrl: 'templates/changeimgdialog.html',
            animation: 'slide-in-up'
        });
    }
    $scope.takePhoto = function () {
        $ionicLoading.hide();
    }
    $scope.selectPhoto = function () {
        $ionicLoading.hide();
    }
});