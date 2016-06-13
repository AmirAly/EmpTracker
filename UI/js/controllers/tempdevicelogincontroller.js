empTracker.controller("tempdeviceloginController", function ($scope, $state, API, $window) {
    $scope.$on('$ionicView.enter', function () {
        console.log($window.localStorage['authorizationToken']);
        $scope.userName = 'Amir Aly';
        // code to run each time view is entered
        var req = {
            method: 'GET',
            url: '/api/Account/Profile',
            data: {}
        }
        // add true to use authentication token
        API.execute(req, true).then(function (_res) {
            console.log(_res);            
        });
    });
});