empTracker.controller("LoginController", function ($scope, $state, API, $window, $ionicLoading, $rootScope) {
    $scope.name = '';
    $scope.password = '';
    $scope.companycode = '';


    console.log($window.localStorage['UserName']);
    console.log($window.localStorage['authorizationToken']);

    $scope.afterLoginError = false;
    $scope.submitForm = function (form) {
        $ionicLoading.show({
            content: 'Loading',
            animation: 'fade-in',
            showBackdrop: true,
            maxWidth: 200,
            showDelay: 0,
            template: '<i class="icon ion-loading-d"></i>'
        });
        $scope.afterLoginError = false;
        $rootScope.IMEI = 20;
        if (form.$valid) {
            var req = {
                method: 'POST',
                url: '/Token',
                data: {
                    UserName: $scope.name,
                    Password: $scope.password,
                    CompanyCode: $scope.companycode,
                    grant_type: 'password',
                    IMEI: $rootScope.IMEI
                }
            }
            console.log(req.data);
            API.execute(req, false).then(function (_res) {
                $window.localStorage['authorizationToken'] = _res.data.token_type + " " + _res.data.access_token;
                var loginCode = _res.data.code;
                console.log('loginCode ' + loginCode);
                // get user data after login if redirect to dashboard
                var req = {
                    method: 'GET',
                    url: '/api/Account/Profile',
                    data: {}
                }
                // add true to use authentication token
                API.execute(req, true).then(function (_res) {
                    console.log(_res.data);
                    if (_res.data.code = 200) {
                        $scope.userName = _res.data.data.FirstName + ' ' + _res.data.data.LastName;
                        console.log($scope.userName);
                        if (_res.data.data.Photo == null) {
                            $rootScope.globalUserPhoto = 'images/unknown.png';
                        }
                        else {
                            $rootScope.globalUserPhoto = _res.data.data.Photo;
                        }
                        $window.localStorage['UserName'] = $scope.userName;
                        $rootScope.globalUserName = _res.data.data.FirstName + ' ' + _res.data.data.LastName;

                        $rootScope.name = $scope.name;
                        $rootScope.password = $scope.password;
                        $rootScope.companycode = $scope.companycode;
                        //get Notifications Counter
                        var req = {
                            method: 'GET',
                            url: '/api/Notification',
                            data: {}
                        }
                        // add true to use authentication token
                        API.execute(req, true).then(function (_res) {
                            console.log(_res.data.code);
                            console.log(loginCode);
                            $rootScope.notifictionsCounter = 0;
                            if (_res.data.code = 200) {
                                $scope.allAlertsArray = _res.data.data;
                                for (var i = 0; i < _res.data.data.length; i++) {
                                    if (_res.data.data[i].IsRead == false) {
                                        $rootScope.notifictionsCounter++;
                                    }
                                }
                                $ionicLoading.hide();
                                // if user is Employee
                                if (_res.data.userType == 'Employee') {
                                    $rootScope.isSupervisor = false;
                                    if (loginCode == 100) { // his device
                                        $state.go('app.dashboard');
                                    }
                                    else if (loginCode == 101) { // inactive device
                                        $scope.afterLoginError = true;
                                        $scope.afterLoginErrorTxt = 'Inactive Device';
                                        $state.go('tempdevicelogin');
                                    }
                                    else if (loginCode == 102) { // new device
                                        $state.go('tempdevicelogin');
                                    }
                                }
                                    //if user is supervisor
                                else {
                                    $rootScope.isSupervisor = true;
                                    if (loginCode == 100) { // his device
                                        $state.go('supervisingemployees');
                                    }
                                    else if (loginCode == 101) { // inactive device
                                        $scope.afterLoginError = true;
                                        $scope.afterLoginErrorTxt = 'Inactive Device';
                                        $state.go('tempdevicelogin');
                                    }
                                    else if (loginCode == 102) { // new device
                                        $state.go('tempdevicelogin');
                                    }
                                }

                            }
                        });
                    }
                });

            }, function (error) {
                $scope.afterLoginError = true;
                console.log(error);
                console.log(error.data); /* catch 400  Error here */
                $scope.afterLoginErrorTxt = error.data.error_description;
                $ionicLoading.hide();
            });
        }
    }
});
