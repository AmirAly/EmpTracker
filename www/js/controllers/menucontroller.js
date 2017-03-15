empTracker.controller("MenuController", function ($scope, $state,$ionicPopup,$ionicHistory, $ionicSideMenuDelegate, $location, $window, $rootScope, LocalStorage) {
    $scope.$on('$ionicView.enter', function () {
        if ($ionicHistory.currentStateName() === 'app.daily' || $ionicHistory.currentStateName() === 'app.weekly' || $ionicHistory.currentStateName() === 'app.calendar') {
            $scope.homeTabs = true;
        }
        else {
            $scope.homeTabs = false;
        }
    });


    $scope.openmyaccount = function () {
        $state.go('app.myaccount');
    }
    $scope.toggleLeftSideMenu = function () {
        $ionicSideMenuDelegate.toggleLeft();
    };
    $scope.back = function () {
        window.history.back();
    }
    $scope.menuItems = [
    { icon: 'ion-ios-home', text: 'Dashboard', linkTo: 'dashboard()', badge: false },
    { icon: 'ion-android-list', text: 'Schedule', linkTo: 'home()', badge: false },
    { icon: 'ion-pinpoint', text: 'Clock-In / Clock-Out', linkTo: 'shiftView()', badge: false },
    { icon: 'ion-clock', text: 'Attendance History', linkTo: 'attendance()', badge: false },
    { icon: 'ion-android-notifications-none', text: 'Notifications', linkTo: 'notifications()', badge: true },
    { icon: 'ion-person', text: 'My Account', linkTo: 'myaccount()', badge: false },
    { icon: 'ion-log-out', text: 'Logout', linkTo: 'logout()', badge: false }];

    $scope.dashboard = function () {
        $state.go('app.dashboard');
    }
    $scope.home = function () {
        console.log('home');
        $state.go('app.daily');
    }
    $scope.shiftView = function () {
        //$state.go('app.shiftview');
        $state.go('app.shiftview', { shiftid: '' });

    }
    $scope.attendance = function () {
        $state.go('app.attendance');
    }
    $scope.notifications = function () {
        $state.go('app.notifications');
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
    //$scope.challenge = function () {
    //    $state.go('app.challenge');
    //}
    $scope.myaccount = function () {
        $state.go('app.myaccount');
    }

});