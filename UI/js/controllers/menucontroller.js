empTracker.controller("MenuController", function ($scope, $state, $ionicSideMenuDelegate, $window) {
    $scope.openmyaccount = function () {
        $state.go('app.myaccount');
    }
    $scope.toggleLeftSideMenu = function () {
        $ionicSideMenuDelegate.toggleLeft();
    };

    $scope.menuItems = [
    { icon: 'ion-ios-home', text: 'Dashboard', linkTo: 'dashboard()', badge: false },
    { icon: 'ion-android-list', text: 'Schedule', linkTo: 'home()', badge: false },
    { icon: 'ion-clock', text: 'Attendance', linkTo: 'attendance()', badge: false },
    { icon: 'ion-pinpoint', text: 'Time Clock', linkTo: 'shiftView()', badge: false },
    { icon: 'ion-android-notifications-none', text: 'Notifications', linkTo: 'notifications()', badge: true },
    { icon: 'ion-eye', text: 'Challenge', linkTo: 'challenge()', badge: false },
    { icon: 'ion-person', text: 'My Account', linkTo: 'myaccount()', badge: false },
    { icon: 'ion-log-out', text: 'Logout', linkTo: 'logout()', badge: false }];

    $scope.dashboard = function () {
        $state.go('app.dashboard');
    }
    $scope.home = function () {
        console.log('home');
        $state.go('app.home');
    }
    $scope.shiftView = function () {
        $state.go('app.shiftview');
    }
    $scope.attendance = function () {
        $state.go('app.attendance');
    }
    $scope.notifications = function () {
        $state.go('app.notifications');
    }
    $scope.logout = function () {
        $window.localStorage['IsTempLogin'] = false;
        localStorage.clear();
        $state.go('login');
    }
    $scope.challenge = function () {
        $state.go('app.challenge');
    }
    $scope.myaccount = function () {
        $state.go('app.myaccount');
    }

});