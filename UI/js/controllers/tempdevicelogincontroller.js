empTracker.controller("tempdeviceloginController", function ($scope, $state, API, $window, $rootScope) {
    $scope.$on('$ionicView.enter', function () {
        console.log($window.localStorage['authorizationToken']);
        $rootScope.globalUserName = '';
        // code to run each time view is entered
        var req = {
            method: 'GET',
            url: '/api/Account/Profile',
            data: {}
        }
        // add true to use authentication token
        API.execute(req, true).then(function (_res) {
            console.log(_res.data.code);
            if (_res.data.code = 200) {
                $rootScope.globalUserName = _res.data.data.FirstName + ' ' + _res.data.data.LastName;
                console.log($rootScope.globalUserName);
            }
        });
    });
});