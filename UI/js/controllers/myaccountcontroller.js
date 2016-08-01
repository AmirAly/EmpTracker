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
            console.log($scope.userData.img);

            var mobileNumber = ($scope.userData.mobile).replace(/[^0-9\.]+/g, "");
            console.log(mobileNumber);

            //$state.go('app.home');
            var req = {
                method: 'PUT',
                url: '/api/Account/Profile',
                data: {
                    Email: $scope.userData.email,
                    FirstName: $scope.userData.firstname,
                    LastName: $scope.userData.lastname,
                    Mobile: mobileNumber,
                    Photo: $scope.userData.img
                }
            }
            // add true to use authentication token
            API.execute(req, true).then(function (_res) {
                console.log(_res);
                if (_res.data.code == 200) {
                    $ionicLoading.hide();
                    // update global photo
                    $rootScope.globalUserPhoto = $scope.userData.img;
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
        $scope.userData.img = 'data:image/png;base64,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';
        $ionicLoading.hide();
    }
    $scope.selectPhoto = function () {
        // change value of $scope.userData.img in base64
        $scope.userData.img = 'data:image/png;base64,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';
        $ionicLoading.hide();
    }
});

