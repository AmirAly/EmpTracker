empTracker.controller("LoginController", function ($scope, $state) {

    $scope.submitForm = function (form) {
        if (form.$valid) {
            if ($scope.frmLogin.name == 'supervisor@bluewaves.com.au')
                $state.go('supervisingemployees');
            else ($state.go('app.tempdevicelogin'));
        }
    }


});

// local storage update 
//var updatedUser = localstorage.getObject('currentUser');
//updatedUser.FirstName = "eeeeee";
//localstorage.resetObject('currentUser', updatedUser);