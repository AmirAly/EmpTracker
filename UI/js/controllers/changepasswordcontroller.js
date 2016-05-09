empTracker.controller("changepasswordController", function ($scope, $state, $timeout, $rootScope, $ionicLoading) {

    $scope.$on('$ionicView.enter', function () {
        $rootScope.toggledrag = true;
    });

    $scope.notifications = function () {
        $state.go('app.notifications');
    }
    $scope.showSubMenu = function () {
        $state.go('app.submenu');
    }
    $scope.cancel = function () {
        window.history.back();
    }
    $scope.updateAccount = function (form) {
        if (form.$valid) {
            showConfirmation();

            window.setTimeout(function () {
                $state.go('app.myaccount');
            }, 5500);
            
        }
    }
    $scope.openmyaccount = function () {
        $state.go('app.myaccount');
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
