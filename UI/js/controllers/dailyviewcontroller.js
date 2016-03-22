empTracker.controller("dailyviewController", function ($scope, $state, $ionicPopup, $timeout) {
    $scope.openmyaccount = function () {
        $state.go('app.myaccount');
    }
    $scope.showSubMenu = function () {
        $state.go('app.submenu');
    }

    $scope.load = function () {
        var map;
        var myLatLng = new google.maps.LatLng(-25.038580, 133.433440);
        google.maps.event.addDomListener(window, 'load', initialize());
        function initialize() {
            var mapOptions = {
                zoom: 7,
                center: myLatLng,
                disableDefaultUI: true
            };
            map = new google.maps.Map(document.getElementById('map'),
                mapOptions);
            google.maps.event.addListenerOnce(map, 'idle', function () {
                var marker = new google.maps.Marker({
                    map: map,
                    animation: google.maps.Animation.DROP,
                    position: myLatLng
                });
            });
        }
    }
    $scope.load();



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