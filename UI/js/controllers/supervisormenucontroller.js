empTracker.controller("supervisormenuController", function ($scope, $state, $ionicSideMenuDelegate, $location, $window) {
    $scope.openmyaccount = function () {
        $state.go('supervisormenu.supervisoraccount');
    }
    $scope.toggleLeftSideMenu = function () {
        $ionicSideMenuDelegate.toggleLeft();
    };

    $scope.menuItems = [
    { icon: 'ion-ios-people', text: 'Employees', linkTo: 'employees()', badge: false },
    { icon: 'ion-ios-home', text: 'Dashboard', linkTo: 'dashboard()', badge: false },
    { icon: 'ion-android-list', text: 'Schedule', linkTo: 'home()', badge: false },
    { icon: 'ion-clock', text: 'My Attendance', linkTo: 'attendance()', badge: false },
    { icon: 'ion-pinpoint', text: 'Time Clock', linkTo: 'shiftView()', badge: false },
    { icon: 'ion-android-notifications-none', text: 'Notifications', linkTo: 'notifications()', badge: true },
    //{ icon: 'ion-eye', text: 'Challenge', linkTo: 'challenge()', badge: false },
    { icon: 'ion-person', text: 'My Account', linkTo: 'myaccount()', badge: false },
    { icon: 'ion-log-out', text: 'Logout', linkTo: 'logout()', badge: false }];

    $scope.employees = function () {
        $state.go('supervisormenu.supervisingemployees');
    }

    //$scope.dashboard = function () {
    //    $state.go('app.dashboard');
    //}
    //$scope.home = function () {
    //    console.log('home');
    //    $state.go('app.home');
    //}
    //$scope.shiftView = function () {
    //    $state.go('app.shiftview', { shiftid: '' });

    //}
    //$scope.attendance = function () {
    //    $state.go('app.attendance');
    //}
    $scope.notifications = function () {
        $state.go('supervisormenu.supervisornotifications');
    }
    $scope.logout = function () {
        //$window.localStorage['IsTempLogin'] = false;
        localStorage.clear();
        $state.go('login');
    }

    $scope.myaccount = function () {
        $state.go('supervisormenu.supervisoraccount');
    }

});