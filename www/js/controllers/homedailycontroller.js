empTracker.controller("homedailycontroller", function ($scope, $state, $filter, $ionicTabsDelegate, $timeout, $http, $ionicPopup, $rootScope, API, $ionicLoading, $window, $location) {
    // run controller code EVERY time the view is enterd
    $scope.$on('$ionicView.enter', function test() {
        $scope.toggleMenu = function () {
            angular.element(document.querySelector('#menuBtn')).triggerHandler('click');
        }
        $rootScope.toggledrag = false;
        var days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
        var months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
        var shortMonths = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

        var intialDate = new Date(); // get current date

        $scope.getTodayEvents = function () {
            $ionicLoading.show({
                content: 'Loading',
                animation: 'fade-in',
                showBackdrop: true,
                maxWidth: 200,
                showDelay: 0,
                template: '<i class="icon ion-loading-d"></i>'
            });
            var thisday = new Date();
            var formatedFirstDay = thisday.getFullYear() + '-' + (thisday.getMonth() + 1) + '-' + thisday.getDate();
            var req = {
                method: 'GET',
                url: '/api/Roster?startDate=' + formatedFirstDay + '&endDate=' + formatedFirstDay + '',
                data: {}
            }
            // add true to use authentication token
            API.execute(req, true).then(function (_res) {
                console.log(_res);
                if (_res.data.code == 200) {
                    $scope.todayEventsArray = _res.data.data;
                    $ionicLoading.hide();
                } else {
                    $ionicLoading.hide();
                    $scope.todayEventsArray = [];
                    console.log(_res.data.data);
                    $rootScope.showToast(_res.data.data);

                }
            }
            , function (error) {
                API.showTokenError(error);
            });
        }
        $scope.getTodayEvents();
    });
    $scope.openmyaccount = function () {
        $state.go('app.myaccount');
    }
    $scope.notifications = function () {
        $state.go('app.notifications');
    }
    $scope.showSubMenu = function () {
        $state.go('app.submenu');
    }
    $scope.shiftView = function (_shiftId) {
        $state.go('app.shiftview', { shiftid: _shiftId });
    }
    $scope.goToUnscheduledShift = function () {
        $state.go('app.unscheduledshift');
    }
});