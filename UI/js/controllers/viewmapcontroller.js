empTracker.controller("viewmapController", function ($scope, $state, $rootScope, $timeout, $window, $stateParams, $cordovaGeolocation) {

    $scope.$on('$ionicView.enter', function () {
             //$rootScope.toggledrag = true;
   var map;
        //Create a Map in Your Application
        var options = { timeout: 10000, enableHighAccuracy: true };

        $cordovaGeolocation.getCurrentPosition(options).then(function (position) {
            // shift coordinates
            var currentShiftLatitude = $stateParams.Latitude;
            var currentShiftLongitude = $stateParams.Longitude;
            console.log(currentShiftLatitude);
            console.log(currentShiftLongitude);
            // user coordinates ('ll be used in navigation)
            var currentUserLatitude = position.coords.latitude;
            var currentUserLongitude = position.coords.longitude;
            console.log(currentUserLatitude);
            console.log(currentUserLongitude);

            var latLng = new google.maps.LatLng(currentShiftLatitude, currentShiftLongitude);

            var mapOptions = {
                center: latLng,
                zoom: 18,
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

    });

    // failed :(
    $scope.Navigate = function () {
        //directionsService = new google.maps.DirectionsService();
        //navigator.geolocation.getCurrentPosition(function (position) {
        //    var geolocate = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
        //    lat1 = position.coords.latitude;
        //    lng1 = position.coords.longitude;
        //    console.log('lat1= ' + lat1 + ' lng1= ' + lng1);
        //    directionsDisplay = new google.maps.DirectionsRenderer();
        //    var mapOptions = {
        //        center: { lat: lat1, lng: lng1 },
        //        zoom: 7
        //    };
        //    map = new google.maps.Map(document.getElementById('map'),
        //        mapOptions);
        //    directionsDisplay.setMap(map);
        //    start = new google.maps.LatLng(lat1, lng1); // me
        //    end = new google.maps.LatLng(lat2, lng2);   // shift
        //    var request = {
        //        origin: start,
        //        destination: end,
        //        travelMode: google.maps.TravelMode.DRIVING
        //    };
        //    directionsService.route(request, function (response, status) {
        //        if (status == google.maps.DirectionsStatus.OK) {
        //            directionsDisplay.setDirections(response);
        //            var me = new google.maps.LatLng(lat1, lng1);
        //            map.panTo(me);
        //        }
        //        else {
        //            console.debug(response);
        //        }
        //    });
        //});
    }


    $scope.openmyaccount = function () {
        $state.go('app.myaccount');
    }
    $scope.showSubMenu = function () {
        $state.go('app.submenu');
    }
    $scope.notifications = function () {
        $state.go('app.notifications');
    }
    $scope.goBack = function () {
        window.history.back();
    }


});