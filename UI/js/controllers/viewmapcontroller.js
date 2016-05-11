empTracker.controller("viewmapController", function ($scope, $state, $rootScope,$timeout) {

    $scope.$on('$ionicView.enter', function () {
        // me
        var lat1; var lng1;
        // shift
        var lat2 = '-25.038580';
        var lng2 = '133.433440';
        var map;
        $rootScope.toggledrag = true;
        $scope.load = function () {
            console.log('enter');
            $timeout(function () {
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
            },1000)
        }
        $scope.load();

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