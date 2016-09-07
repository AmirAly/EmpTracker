empTracker.controller("supervisormenuController", function ($scope, $state, $ionicSideMenuDelegate, $location, $window) {
    $scope.openmyaccount = function () {
        $state.go('supervisormenu.supervisoraccount');
    }
    $scope.toggleLeftSideMenu = function () {
        $ionicSideMenuDelegate.toggleLeft();
    };

    $scope.menuItems = [
    { icon: 'ion-ios-people', text: 'Employees', linkTo: 'employees()', badge: false },
    { icon: 'ion-android-notifications-none', text: 'Notifications', linkTo: 'notifications()', badge: true },
    //{ icon: 'ion-eye', text: 'Challenge', linkTo: 'challenge()', badge: false },
    { icon: 'ion-person', text: 'My Account', linkTo: 'myaccount()', badge: false },
    { icon: 'ion-log-out', text: 'Logout', linkTo: 'logout()', badge: false }];

    $scope.employees = function () {
        $state.go('supervisormenu.supervisingemployees');
    }

    //$scope.challenge = function () {
    //    $state.go('supervisormenu.challenge');
    //}
    
    $scope.notifications = function () {
        $state.go('supervisormenu.supervisornotifications');
    }
    $scope.logout = function () {
        $window.localStorage['IsTempLogin'] = false;
        localStorage.clear();
        $state.go('login');
    }

    $scope.myaccount = function () {
        $state.go('supervisormenu.supervisoraccount');
    }



   // $scope.menuItems = [
   //{ icon: 'ion-ios-people', text: 'Employees', linkTo: 'employees()', badge: false },
   //{ icon: 'ion-android-notifications-none', text: 'Notifications', linkTo: 'notifications()', badge: true },
   //{ icon: 'ion-person', text: 'My Account', linkTo: 'myaccount()', badge: false },
   //{ icon: 'ion-log-out', text: 'Logout', linkTo: 'logout()', badge: false }];

   // $scope.employees = function () {
   //     $state.go('supervisormenu.supervisingemployees');
   // }

   // $scope.notifications = function () {
   //     $state.go('supervisormenu.supervisornotifications');
   // }

   // $scope.myaccount = function () {
   //     $state.go('supervisormenu.supervisoraccount');
   // }

   // $scope.logout = function () {
   //     $window.localStorage['IsTempLogin'] = false;
   //     localStorage.clear();
   //     $state.go('login');
   // }
});