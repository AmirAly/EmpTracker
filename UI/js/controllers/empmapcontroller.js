empTracker.controller("empmapController", function ($scope, $state, $timeout, $rootScope, $window, $cordovaGeolocation) {

    $scope.$on('$ionicView.enter', function () {
        //$rootScope.toggledrag = true;
        ////Create a Map in Your Application
        var options = { timeout: 10000, enableHighAccuracy: true };

        $cordovaGeolocation.getCurrentPosition(options).then(function (position) {

            var latLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);

            var mapOptions = {
                center: latLng,
                zoom: 15,
                mapTypeId: google.maps.MapTypeId.ROADMAP
            };

            $scope.map = new google.maps.Map(document.getElementById("map"), mapOptions);
            ////Add a Marker and Info Window to Your Map
            //Wait until the map is loaded
            google.maps.event.addListenerOnce($scope.map, 'idle', function () {

                var marker = new google.maps.Marker({
                    map: $scope.map,
                    animation: google.maps.Animation.DROP,
                    position: latLng
                });

                var infoWindow = new google.maps.InfoWindow({
                    content: "Here I am!"
                });

                google.maps.event.addListener(marker, 'click', function () {
                    infoWindow.open($scope.map, marker);
                });

            });
        }, function (error) {
            console.log("Could not get location");
        });

        //$scope.load = function () {
        //    var map;
        //    var myLatLng = new google.maps.LatLng(-25.038580, 133.433440);
        //    google.maps.event.addDomListener(window, 'load', initialize());
        //    function initialize() {
        //        var mapOptions = {
        //            zoom: 7,
        //            center: myLatLng,
        //            disableDefaultUI: true
        //        };
        //        map = new google.maps.Map(document.getElementById('map'), mapOptions);
        //        google.maps.event.addListenerOnce(map, 'idle', function () {
        //            var marker = new google.maps.Marker({
        //                map: map,
        //                animation: google.maps.Animation.DROP,
        //                position: myLatLng
        //            });
        //        });
        //    }
        //}
        //$scope.load();

    });

    $scope.backToAllEmps = function () {
        $state.go('supervisormenu.supervisingemployees');
    }
    $scope.openmyaccount = function () {
        $state.go('supervisormenu.supervisoraccount');
    }
    $scope.notifications = function () {
        $state.go('supervisormenu.supervisornotifications');
    }
    $scope.nextEmp = function () {
        window.location.reload(true);
    }

});

