empTracker.controller("supervisoraccountController", function ($scope, $state,$ionicPopup, $rootScope, $ionicLoading, API, $window, LocalStorage) {
    $scope.userData = {};
    $scope.emailPattern = /^[a-z]+[a-z0-9._]+@[a-z]+\.[a-z.]{2,24}$/;

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
                $scope.userData.fullname = _res.data.data.FirstName + " " + _res.data.data.LastName;
                if (_res.data.data.Photo == null) {
                    $scope.userData.img = $rootScope.globalUserPhoto;
                }
                else {
                    $scope.userData.img = "data:image/png;base64," + _res.data.data.Photo;
                }

            }
            else {
                $ionicLoading.hide();
                console.log(_res.data.data);
                $rootScope.showToast(_res.data.data);
               
            }
        }, function (error) {
            API.showTokenError(error);
        });
    });

    $scope.cancel = function () {
        window.history.back();
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
            var str = $scope.userData.img;
            str = str.substring(str.indexOf(",") + 1);
            //console.log(str);
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
                    Photo: str
                }
            }
            // add true to use authentication token
            API.execute(req, true).then(function (_res) {
                console.log(_res);
                if (_res.data.code == 200) {
                    $ionicLoading.hide();
                    // update global photo
                    $rootScope.globalUserPhoto = $scope.userData.img;
                    $rootScope.globalUserName = $scope.userData.firstname + " " + $scope.userData.lastname;
                    $state.go('supervisormenu.supervisingemployees');
                }
                else {
                    $ionicLoading.hide();
                    console.log(_res.data.data);
                    $rootScope.showToast(_res.data.data);
                }
            }, function (error) {
                API.showTokenError(error);
            });
        }
    }
    $scope.openmyaccount = function () {
        $state.go('supervisoraccount');
    }

    $scope.notifications = function () {
        $state.go('supervisornotifications');
    }

    $scope.openImgDialog = function () {
        $ionicLoading.show({
            scope: $scope,
            templateUrl: 'templates/changeimgdialog.html',
            animation: 'slide-in-up'
        });
    }

    $scope.takePhoto = function () {
        if (navigator && navigator.camera) {
            navigator.camera.getPicture(function (data) {// on succsess
                if (data.indexOf('base64') < 0) {
                    $scope.userData.img = 'data:image/jpeg;base64,' + data;
                }
                else {
                    $scope.userData.img = data;
                }
                $ionicLoading.hide();
            }, null, {
                sourceType: Camera.PictureSourceType.CAMERA,
                quality: 50,
                targetWidth: 140,
                targetHeight: 140,
                destinationType: Camera.DestinationType.DATA_URL,
                cameraDirection: 1, // "1" is used for front-facing camera and "0" is used for back-facing camera.
                correctOrientation: true
            });
        }
        else {
            console.log('take');
            // change value of $scope.userData.img in base64
            $scope.userData.img = 'data:image/jpeg;base64,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';
            $ionicLoading.hide();
        }
    }
    $scope.selectPhoto = function () {
        if (navigator && navigator.camera) {
            navigator.camera.getPicture(function (data) { // on succsess
                if (data.indexOf('base64') < 0) {
                    $scope.userData.img = 'data:image/jpeg;base64,' + data;
                }
                else {
                    $scope.userData.img = data;
                }
                $ionicLoading.hide();
            }, null, {
                sourceType: Camera.PictureSourceType.PHOTOLIBRARY,
                quality: 50,
                targetWidth: 140,
                targetHeight: 140,
                destinationType: Camera.DestinationType.DATA_URL,
                cameraDirection: 1, // "1" is used for front-facing camera and "0" is used for back-facing camera.
                correctOrientation: true
            });
        }
        else {
            console.log('selectPhoto');
            // change value of $scope.userData.img in base64
            $scope.userData.img = 'data:image/jpeg;base64,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';
            $ionicLoading.hide();
        }
    }

    $scope.logout = function () {
        if ($rootScope.UserIsInShift == true) {
            // You can't log out as you still clocked in shift
            $rootScope.showToast("You can't logout as you still clocked in a shift");
        }
        else {
            var confirmPopup = $ionicPopup.confirm({
                cssClass: 'bluePopup',
                title: '<i class="ion-information-circled "></i> Confirm Log Out',
                template: 'Are you sure you want to Logout?'
            });

            confirmPopup.then(function (res) {
                if (res) {
                    console.log('You are sure In');
                    // logout
                    LocalStorage.clear('UserLocalObject');
                    $rootScope.UserIsInShift = false;
                    $window.localStorage['IsTempLogin'] = false;
                    localStorage.clear();
                    $state.go('login');
                } else {
                    console.log('You are not sure In');
                }
            });
            
        }
    }
});