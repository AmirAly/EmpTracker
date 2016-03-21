empTracker.controller("MenuController", function ($scope, $state, $ionicSideMenuDelegate) {

    $scope.toggleLeftSideMenu = function () {
        $ionicSideMenuDelegate.toggleLeft();
    };

    ////to hide inside bar (small part of the menu) or change icon
    //$scope.$watch(function () {
    //    return $ionicSideMenuDelegate.getOpenRatio();
    //},
    //           function (ratio) {
    //               if (ratio == 1) {
    //                   $scope.showMenu = true;
    //               }
    //               else {
    //                   $scope.showMenu = false;
    //               }
    //           });

    $scope.menuItems = [
    //{ icon: 'ion-ios-home', text: 'Home', linkTo: 'home()', badge: false },
    { icon: 'ion-android-list', text: 'Schedule', linkTo: 'home()', badge: false },
    { icon: 'ion-clock', text: 'Attendance', linkTo: 'attendance()', badge: false },
    { icon: 'ion-pinpoint', text: 'Tracker', linkTo: 'tracker()', badge: false },
    { icon: 'ion-android-notifications-none', text: 'Notifications', linkTo: 'notifications()', badge: true },
    { icon: 'ion-eye', text: 'Challenge', linkTo: 'challenge()', badge: false },
    { icon: 'ion-person', text: 'My Account', linkTo: 'myaccount()', badge: false },
    { icon: 'ion-log-out', text: 'Logout', linkTo: 'logout()', badge: false }];

    $scope.layout = 'list';
    $scope.dailyview = function () {
        $state.go('app.dailyview');
    }
    $scope.home = function () {
        $state.go('app.home');
    }
    $scope.tracker = function () {
        $state.go('app.tracker');
    }
    $scope.attendance = function () {
        $state.go('app.attendance');
    }
    $scope.notifications = function () {
        $state.go('app.notifications');
    }
    $scope.logout = function () {
        $state.go('login');
    }
    $scope.challenge = function () {
        $state.go('app.challenge');
    }
    $scope.myaccount = function () {
        $state.go('app.myaccount');
    }


});