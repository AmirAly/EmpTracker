empTracker.controller("supervisingemployeesController", function ($scope, $state, $ionicPopup, $timeout, $http) {
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
    $scope.openmap = function () {
        $state.go('empmap');
    }
    $scope.notifications = function () {
        $state.go('supervisornotifications');
    }
    $scope.selectedAll = false;
    $scope.checkAll = function () {
        if ($scope.selectedAll == false) {
            $scope.selectedAll = true;
        } else {
            $scope.selectedAll = false;
        }
    };

    if (ionic.Platform.isAndroid()) {
        // get json from external file
        $http.get('/android_asset/www/json/employees.json').then(function (data) {
            $scope.allemployeesArray = data.data.employees;
        });
    }
    else {
        // get json from external file
        $http.get('/json/employees.json').then(function (data) {
            $scope.allemployeesArray = data.data.employees;
        });
    }
});