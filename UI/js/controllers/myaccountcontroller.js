empTracker.controller("myaccountController", function ($scope, $state, $rootScope, $ionicLoading, API, $window) {
    $scope.userData = {};
    
    $scope.$on('$ionicView.enter', function () {
        $rootScope.toggledrag = true;
        $ionicLoading.show({
            content: 'Loading',
            animation: 'fade-in',
            showBackdrop: true,
            maxWidth: 200,
            showDelay: 0,
            template: '<i class="icon ion-loading-d"></i>'
        });
        // get profile Data
        var req = {
            method: 'GET',
            url: '/api/Account/Profile',
            data: {}
        }
        // add true to use authentication token
        API.execute(req, true).then(function (_res) {
            console.log(_res.data);
            if (_res.data.code = 200) {
                $ionicLoading.hide();
                $scope.userData.employeeNO = _res.data.data.EmpNo;
                $scope.userData.firstname = _res.data.data.FirstName;
                $scope.userData.lastname = _res.data.data.LastName;
                $scope.userData.mobile = _res.data.data.Mobile;
                $scope.userData.email = _res.data.data.Email;
                if (_res.data.data.Photo == null) {
                    $scope.userData.img = $rootScope.globalUserPhoto;
                }
                else {
                $scope.userData.img = _res.data.data.Photo;
                }

            }
       });
    });

    $scope.cancel = function () {
        window.history.back();
    }
    
    $scope.showSubMenu = function () {
        $state.go('app.submenu');
    }

    $scope.updateAccount = function (form) {
        if (form.$valid) {
            $ionicLoading.show({
                content: 'Loading',
                animation: 'fade-in',
                showBackdrop: true,
                maxWidth: 200,
                showDelay: 0,
                template: '<i class="icon ion-loading-d"></i>'
            });
           
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
                if (_res.data.code == 200) {
                    $ionicLoading.hide();
                    $state.go('app.dashboard');
                }
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
        // change value of $scope.userData.img in base64
        $ionicLoading.hide();
    }
    $scope.selectPhoto = function () {
        // change value of $scope.userData.img in base64
        $ionicLoading.hide();
    }
});

