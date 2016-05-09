empTracker.controller("empmapController", function ($scope, $state, $timeout, $rootScope) {

    $scope.$on('$ionicView.enter', function () {
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

    });

    $scope.backToAllEmps = function () {
        $state.go('supervisingemployees');
    }
    $scope.openmyaccount = function () {
        $state.go('supervisoraccount');
    }
    $scope.notifications = function () {
        $state.go('supervisornotifications');
    }
    $scope.nextEmp = function () {
        window.location.reload(true);
    }

});

