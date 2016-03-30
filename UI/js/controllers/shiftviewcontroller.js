empTracker.controller("shiftviewController", function ($scope, $state, $ionicPopup) {
    $scope.openmyaccount = function () {
        $state.go('app.myaccount');
    }
    $scope.showSubMenu = function () {
        $state.go('app.submenu');
    }


    $scope.goBack = function () {
        window.history.back();
    };


    // A confirm dialog
    $scope.showConfirm = function () {
        var confirmPopup = $ionicPopup.confirm({
            title: '<i class="ion-information-circled"></i> Confirmation',
            template: 'Are you sure you want to check in?'
        });

        confirmPopup.then(function (res) {
            if (res) {
                console.log('You are sure');
            } else {
                console.log('You are not sure');
            }
        });
    };

   
    //if ($stateParams.title=="") {
    //    $scope.pageTitle = "Available shift";
    //}
    //else {
    //   $scope.pageTitle = $stateParams.title;
    //}
    //console.log($stateParams.title);
});