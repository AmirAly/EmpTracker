empTracker.controller("trackerController", function ($scope, $state, $ionicPopup) {
    $scope.openmyaccount = function () {
        $state.go('app.myaccount');
    }
    $scope.showSubMenu = function () {
        $state.go('app.submenu');
    }
    google.maps.event.addDomListener(window, 'load', initialize);
    var map;

    function initialize() {
        var myLatLng = new google.maps.LatLng(-25.038580, 133.433440);
        var mapOptions = {
            zoom: 4,
            center: myLatLng,
        };
        map = new google.maps.Map(document.getElementById('map'),
            mapOptions);
    }

    $scope.goBack = function () {
        window.history.back();
    };


    // A confirm dialog
    $scope.showConfirm = function () {
        var confirmPopup = $ionicPopup.confirm({
            title: 'Confirmation',
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
});