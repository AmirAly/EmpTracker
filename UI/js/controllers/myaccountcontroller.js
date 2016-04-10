empTracker.controller("myaccountController", function ($scope, $state) {
    $scope.cancel = function () {
        window.history.back();
    }
    $scope.updateAccount = function (form) {
        if (form.$valid) {
            $state.go('app.home');
        }
    }
    $scope.openmyaccount = function () {
        $state.go('app.myaccount');
    }

    /*
    * if given group is the selected group, deselect it
    * else, select the given group
    */
    $scope.toggleGroup = function (group) {
        if ($scope.isGroupShown(group)) {
            $scope.shownGroup = null;
        } else {
            $scope.shownGroup = group;
        }
    };
    $scope.shownGroup = 1;
    $scope.isGroupShown = function (group) {
        return $scope.shownGroup === group;
    };
});

