empTracker.controller("supervisingemployeesController", function ($scope,$rootScope, $state, $ionicPopup, $timeout, $ionicLoading, API, $http, $window, $location) {
    $scope.defaultEmpPhoto = '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';

    $scope.$on('$ionicView.enter', function () {
        $rootScope.toggledrag = true;
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

    $scope.openmap = function (emp) {
        $state.go('supervisormenu.empmap', { Latitude: emp.LocationCoordinates.Latitude, Longitude: emp.LocationCoordinates.Logitude });
    }


    $scope.selectedAll = false;
    $scope.checkAll = function () {
        if ($scope.selectedAll == false) {
            $scope.selectedAll = true;
        } else {
            $scope.selectedAll = false;
        }
    };

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
                $rootScope.allemployeesArray = _res.data.data;
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