empTracker.controller("supervisingemployeesController", function ($scope, $state, $ionicPopup, $timeout) {
    // Triggered on a button click
    $scope.showPopup = function () {
        $scope.time = {}
        $scope.time.hour = '08';
        $scope.time.minute = '30';
        // An elaborate, custom popup
        var myPopup = $ionicPopup.show({
            template: '<div class="row">\
                <div class="padding col"><input type="text" class="text-center" ng-model="time.hour"></div>\
                <div class="padding col"><input type="text" class="text-center" ng-model="time.minute"></div>\
            </div>',
            title: 'there is (5) employee(s) selected',
            //subTitle: 'Please use normal things',
            scope: $scope,
            buttons: [
              {
                  text: 'Out',
                  type: 'button-dark',
                  onTap: function (e) {
                      if (!$scope.time.hour) {
                          //don't allow the user to close unless he enters wifi password
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
                          //don't allow the user to close unless he enters wifi password
                          e.preventDefault();
                      } else {
                          return $scope.time.hour;
                      }
                  }
              },
            ]
        });
        myPopup.then(function (res) {
            console.log('Tapped!', res);
        });
        //$timeout(function () {
        //    myPopup.close(); //close the popup after 3 seconds for some reason
        //}, 3000);
    };
    $scope.openmyaccount = function () {
        $state.go('myaccount');
    }
    $scope.openmap = function () {
        $state.go('empmap');
    }
    $scope.logout = function () {
        $state.go('login');
    }
});

// local storage update 
//var updatedUser = localstorage.getObject('currentUser');
//updatedUser.FirstName = "eeeeee";
//localstorage.resetObject('currentUser', updatedUser);