empTracker.controller("MenuController", function ($scope, $state, $ionicSideMenuDelegate) {

    $scope.toggleLeftSideMenu = function () {
        $ionicSideMenuDelegate.toggleLeft();
    };

    $scope.menuItems = [
    { icon: 'ion-android-list', text: 'Schedule', linkTo: 'home()', badge: false },
    { icon: 'ion-clock', text: 'Attendance', linkTo: 'attendance()', badge: false },
    { icon: 'ion-pinpoint', text: 'Time Clock', linkTo: 'shiftView()', badge: false },
    { icon: 'ion-android-notifications-none', text: 'Notifications', linkTo: 'notifications()', badge: true },
    { icon: 'ion-eye', text: 'Challenge', linkTo: 'challenge()', badge: false },
    { icon: 'ion-person', text: 'My Account', linkTo: 'myaccount()', badge: false },
    //{ icon: 'ion-ios-time-outline', text: 'Daily View', linkTo: 'showDailyView()', badge: false },
    //{ icon: 'ion-android-calendar', text: 'Weekly View', linkTo: 'showWeeklyView()', badge: false },
    //{ icon: 'ion-calendar', text: 'My Calendar', linkTo: 'showCalendar()', badge: false },
    { icon: 'ion-log-out', text: 'Logout', linkTo: 'logout()', badge: false }];

    //$scope.layout = 'list';
    //$scope.dailyview = function () {
    //    $state.go('app.dailyview');
    //}
    $scope.home = function () {
        $state.go('app.home');
    }
    $scope.shiftView = function () {
        $state.go('app.shiftView');
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


    //$scope.showDailyView = function () {
    //    $state.go('app.home');
    //}
    //$scope.showCalendar = function () {
    //    $state.go('app.calendar');
    //}
    //$scope.showWeeklyView = function () {
    //    $state.go('app.thisweek');
    //}
});