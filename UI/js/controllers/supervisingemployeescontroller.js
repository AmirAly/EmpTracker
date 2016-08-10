empTracker.controller("supervisingemployeesController", function ($scope, $state, $ionicPopup, $timeout, $ionicLoading, API, $http, $window, $location) {

    $scope.$on('$ionicView.enter', function () {
        var req = {
            method: 'GET',
            url: '/api/Attendance/GetSites',
            data: {}
        }
        $ionicLoading.show({
            content: 'Loading',
            animation: 'fade-in',
            showBackdrop: true,
            maxWidth: 200,
            showDelay: 0,
            template: '<i class="icon ion-loading-d"></i>'
        });
        // add true to use authentication token
        API.execute(req, true).then(function (_res) {
            console.log(_res);
            if (_res.data.code == 200) {
                $scope.categories = _res.data.data;
                console.log($scope.categories);
                $ionicLoading.hide();
            }
        }, function (error) {
            console.log(error);
            console.log(error.data); /* catch 400  Error here */
            $ionicLoading.hide();
            $window.localStorage['IsTempLogin'] = false;
            localStorage.clear();
            $state.go('login');
        });
    });

    // Triggered on a button click
    $scope.showPopup = function () {
        $scope.time = {}
        $scope.time.hour = 8;
        $scope.time.minute = 30;
        // custom popup
        var myPopup = $ionicPopup.show({
            template: '<div class="row">\
                <div class="padding col"><input type="number" class="text-center" ng-model="time.hour"></div>\
                <div class="padding col"><input type="number" class="text-center" ng-model="time.minute"></div>\
            </div>',
            title: '<i class="ion-information-circled"></i> there is (3) employee(s) selected',
            scope: $scope,
            buttons: [
              {
                  text: 'Out',
                  type: 'button-dark',
                  onTap: function (e) {
                      if (!$scope.time.hour) {
                          //don't allow the user to close unless he enters 
                          e.preventDefault();
                      } else {
                          return $scope.time.hour;
                      }
                  }
              },
              {
                  text: '<b>In</b>',
                  type: 'button-dark',
                  onTap: function (e) {
                      if (!$scope.time.hour) {
                          //don't allow the user to close unless he enters 
                          e.preventDefault();
                      } else {
                          return $scope.time.hour;
                      }
                  }
              },
              {
                  text: '<b>X</b>',
                  type: 'button-assertive',
                  onTap: function (e) {
                      myPopup.close();
                  }
              }
            ]
        });
        myPopup.then(function (res) {
            console.log('Tapped!', res);
        });
    };

    $scope.openmyaccount = function () {
        $state.go('supervisoraccount');
    }

    $scope.notifications = function () {
        $state.go('supervisornotifications');
    }

    $scope.openmap = function () {
        $state.go('empmap');
    }


    $scope.selectedAll = false;
    $scope.checkAll = function () {
        if ($scope.selectedAll == false) {
            $scope.selectedAll = true;
        } else {
            $scope.selectedAll = false;
        }
    };

    //$scope.categories = [{ name: 'SNP001', value: 'SNP001' }, { name: 'SNP002', value: 'SNP002' }, { name: 'SNP003', value: 'SNP003' }];
    $scope.getByListEmpBySite = function (_site) {
        console.log(_site.SiteID);
        $ionicLoading.show({
            content: 'Loading',
            animation: 'fade-in',
            showBackdrop: true,
            maxWidth: 200,
            showDelay: 0,
            template: '<i class="icon ion-loading-d"></i>'
        });
        // use today date & use card to let user select location
        var req = {
            method: 'GET',
            url: '/api/Roster/' + _site.SiteID + '?startDate=2016-7-1&endDate=2016-7-1&getBy=site',
            data: {}
        }
        // add true to use authentication token
        API.execute(req, true).then(function (_res) {
            console.log(_res);
            if (_res.data.code == 200) {
                $scope.allemployeesArray = _res.data.data;
                console.log(_res.data.data);
                $ionicLoading.hide();
            }
        }, function (error) {
            console.log(error);
            console.log(error.data); /* catch 400  Error here */
            $ionicLoading.hide();
            $window.localStorage['IsTempLogin'] = false;
            localStorage.clear();
            $state.go('login');
        });
    }


    //if (ionic.Platform.isAndroid()) {
    //    // get json from external file
    //    $http.get('/android_asset/www/json/employees.json').then(function (data) {
    //        $scope.allemployeesArray = data.data.employees;
    //    });
    //}
    //else {
    //    // get json from external file
    //    $http.get('/json/employees.json').then(function (data) {
    //        $scope.allemployeesArray = data.data.employees;
    //    });
    //}
});