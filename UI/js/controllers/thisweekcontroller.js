empTracker.controller("thisweekController", function ($scope, $state) {

    $scope.text = "home";
    $scope.openmyaccount = function () {
        $state.go('myaccount');
    }
    $scope.showSubMenu = function () {
        $state.go('app.submenu');
    }
    $scope.update = function () {
        $state.go('app.home');
    }
    $scope.shiftView = function () {
        $state.go('app.dailyview');
    }
});

// local storage update 
//var updatedUser = localstorage.getObject('currentUser');
//updatedUser.FirstName = "eeeeee";
//localstorage.resetObject('currentUser', updatedUser);