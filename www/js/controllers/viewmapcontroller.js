empTracker.controller("viewmapController", function ($scope, $state, $rootScope, $timeout, $window, $stateParams, $cordovaGeolocation, $ionicPopup, $ionicLoading) {
    var currentShiftLatitude; var currentShiftLongitude; var currentUserLatitude; var currentUserLongitude;
    var options = { timeout: 10000, enableHighAccuracy: false };
    $scope.$on('$ionicView.enter', function () {
        var map;
        $ionicLoading.show({
            content: 'Loading',
            animation: 'fade-in',
            showBackdrop: true,
            maxWidth: 200,
            showDelay: 0,
            template: '<i class="icon ion-loading-d"></i>'
        });
        $cordovaGeolocation.getCurrentPosition(options).then(function (position) {
            // shift coordinates
            currentShiftLatitude = $stateParams.Latitude;
            currentShiftLongitude = $stateParams.Longitude;
            console.log(currentShiftLatitude);
            console.log(currentShiftLongitude);
            // user coordinates ('ll be used in navigation)
            currentUserLatitude = position.coords.latitude;
            currentUserLongitude = position.coords.longitude;
            console.log(currentUserLatitude);
            console.log(currentUserLongitude);

            var latLngShift = new google.maps.LatLng(currentShiftLatitude, currentShiftLongitude);
            var latLngUser = new google.maps.LatLng(currentUserLatitude, currentUserLongitude);

            var mapOptions = {
                center: latLngShift,
                zoom: 18,
                mapTypeId: google.maps.MapTypeId.ROADMAP
            };

            $scope.map = new google.maps.Map(document.getElementById("map"), mapOptions);
            ////Add a Marker and Info Window to Your Map
            //Wait until the map is loaded
            google.maps.event.addListenerOnce($scope.map, 'idle', function () {

                var marker1 = new google.maps.Marker({
                    map: $scope.map,
                    animation: google.maps.Animation.DROP,
                    position: latLngShift
                });

                var infoWindow1 = new google.maps.InfoWindow({
                    content: "Here the shift!"
                });

                google.maps.event.addListener(marker1, 'click', function () {
                    infoWindow1.open($scope.map, marker1);
                });


                var marker2 = new google.maps.Marker({
                    map: $scope.map,
                    animation: google.maps.Animation.DROP,
                    position: latLngUser
                });

                var infoWindow2 = new google.maps.InfoWindow({
                    content: "Here I'm!"
                });

                google.maps.event.addListener(marker2, 'click', function () {
                    infoWindow2.open($scope.map, marker2);
                });
$ionicLoading.hide();
                

            });
        }, function (error) {
            console.log(error);
            console.log("Could not get location");
            var alertPopup = $ionicPopup.alert({
                title: 'Can\'t display map',
                template: 'Could Not Find Address On Map. Please Contact Your Company'
            });
        }).finally(function () {
            $ionicLoading.hide();
        });
    });

    $scope.Navigate = function () {
        $ionicLoading.show({
            content: 'Loading',
            animation: 'fade-in',
            showBackdrop: true,
            maxWidth: 200,
            showDelay: 0,
            template: '<i class="icon ion-loading-d"></i>'
        });
        var directionsService = new google.maps.DirectionsService();
        $cordovaGeolocation.getCurrentPosition(options).then(function (position) {
            var geolocate = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
            lat1 = position.coords.latitude;
            lng1 = position.coords.longitude;

            //// enable for test purpose only
            //lat1 = -33.8757436;
            //lng1 = 151.2172687;

            console.log(currentShiftLatitude, currentShiftLongitude);
            console.log('lat1= ' + lat1 + ' lng1= ' + lng1);
            directionsDisplay = new google.maps.DirectionsRenderer();
            var mapOptions = {
                center: { lat: lat1, lng: lng1 },
                zoom: 7
            };
            map = new google.maps.Map(document.getElementById('map'),
                mapOptions);
            directionsDisplay.setMap(map);
            start = new google.maps.LatLng(lat1, lng1); // me
            end = new google.maps.LatLng(currentShiftLatitude, currentShiftLongitude);// shift
            var request = {
                origin: start,
                destination: end,
                travelMode: 'DRIVING'
            };
            directionsService.route(request, function (response, status) {
                if (status == google.maps.DirectionsStatus.OK) {
                    directionsDisplay.setDirections(response);
                    var me = new google.maps.LatLng(lat1, lng1);
                    map.panTo(me);
                }
                else {
                    console.debug(response);
                }
            });
        }, function (error) {
            console.log(error);
            console.log("Could not get location");
        }).finally(function () {
            $ionicLoading.hide();
        });
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