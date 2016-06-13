empTracker.controller("myaccountController", function ($scope, $state, $rootScope, $ionicLoading, API, $window) {

    $scope.$on('$ionicView.enter', function () {
        $rootScope.toggledrag = true;
        // get profile Data
        var req = {
            method: 'GET',
            url: '/api/Account/Profile',
            data: {}
        }
        // add true to use authentication token
        API.execute(req, true).then(function (_res) {
            console.log(_res);
       });
    });

    $scope.cancel = function () {
        window.history.back();
    }
    $scope.userData = {};
    $scope.userData.employeeNO = '150SB7';
    $scope.userData.firstname = 'Amir';
    $scope.userData.lastname = 'Aly';

    $scope.updateAccount = function (form) {
        if (form.$valid) {
            console.log($scope.userData.employeeNO);
            console.log($scope.userData.firstname); 
            console.log($scope.userData.lastname);
            console.log($scope.userData.mobile);
            console.log($scope.userData.email);

            var mobileNumber = ($scope.userData.mobile).replace(/[^0-9\.]+/g, "");
            console.log(mobileNumber);

            //$state.go('app.home');
            var req = {
                method: 'PUT',
                url: '/api/Account/Profile',
                data: { Email: $scope.userData.email, FirstName: $scope.userData.firstname, LastName: $scope.userData.lastname, Mobile: mobileNumber }
            }
            // add true to use authentication token
            API.execute(req, true).then(function (_res) {
                console.log(_res);
            });
        }
    }
    $scope.openmyaccount = function () {
        $state.go('app.myaccount');
    }
    $scope.notifications = function () {
        $state.go('app.notifications');
    }

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

