empTracker.controller("supervisormenuController", function ($scope, $state,$ionicPopup, $ionicSideMenuDelegate, $location, $window, $rootScope, LocalStorage) {
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