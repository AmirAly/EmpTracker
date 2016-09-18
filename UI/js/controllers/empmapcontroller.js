empTracker.controller("empmapController", function ($scope, $state, $timeout, $stateParams, $rootScope, $window, $cordovaGeolocation, $ionicLoading) {
    var marker, infowindow;
    $scope.$on('$ionicView.enter', function () {
        //$rootScope.toggledrag = true;
        //Create a Map in Your Application
        var options = { timeout: 10000, enableHighAccuracy: true };
        $cordovaGeolocation.getCurrentPosition(options).then(function (position) {
            $rootScope.locationService = 'active';
            // emp coordinates
            var latLng = new google.maps.LatLng($stateParams.Latitude, $stateParams.Longitude);
            latLng = { lat: -33.8657436, lng: 151.2172687 }
            var mapOptions = {
                center: latLng,
                zoom: 15,
                mapTypeId: google.maps.MapTypeId.ROADMAP
            };

            $scope.map = new google.maps.Map(document.getElementById("map"), mapOptions);
            ////Add a Marker and Info Window to Your Map
            //Wait until the map is loaded
            google.maps.event.addListenerOnce($scope.map, 'idle', function () {

                marker = new google.maps.Marker({
                    map: $scope.map,
                    animation: google.maps.Animation.DROP,
                    position: latLng
                });

                infowindow = new google.maps.InfoWindow({
                    content: "Here employee!"
                });
                // open info window by default
                infowindow.open($scope.map, marker);
                // open info window on click
                google.maps.event.addListener(marker, 'click', function () {
                    infowindow.open($scope.map, marker);
                });



            });
        }, function (error) {
            $rootScope.locationService = 'inactive';
            console.log("Could not get location , You have to enable location on your device");
            $ionicLoading.show({
                template: '<div class="padding">\
                                    <a class="button button-icon icon energized ion-alert-circled"></a>\
                                    <h4>Can\'t get your location</h4>\
                                    <h5>You have to allow geolocation service on your device.</h4>\
                                </div>',
                animation: 'slide-in-up'
            });
            $timeout(function () {
                $ionicLoading.hide();
            }, 5000);
        });
        $scope.adjustEmpData($stateParams.Latitude, $stateParams.Longitude);
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
    $scope.indexToShow = 0;
    $scope.adjustEmpData = function (lat, lng) {
        $scope.empArray = [];
        var emp;
        console.log($rootScope.allemployeesArray);
        for (var i = 0; i < $rootScope.allemployeesArray.length; i++) {
            emp = { "id": i, "Name": $rootScope.allemployeesArray[i].EmployeeName, "Lat": $rootScope.allemployeesArray[i].LocationCoordinates.Latitude, "Lng": $rootScope.allemployeesArray[i].LocationCoordinates.Logitude, "selected": false };
            if ($rootScope.allemployeesArray[i].LocationCoordinates.Latitude == lat && $rootScope.allemployeesArray[i].LocationCoordinates.Logitude == lng){
                emp.selected = true;
                $scope.indexToShow = i;
            }
            $scope.empArray.push(emp)
        }
        console.log($scope.empArray);
    }
    
    $scope.nextEmp = function () {
        console.log($scope.indexToShow);
        if (typeof $scope.indexToShow !== 'undefined') {
            $scope.indexToShow = ($scope.indexToShow + 1);
        }
        else {
            $scope.indexToShow = 0;
        }
        console.log($scope.empArray[$scope.indexToShow]);
        for (var i = 0; i < $scope.empArray.length; i++) {
            if ($scope.empArray[i].id == $scope.indexToShow) {
                //$scope.empArray[i + 1];
            }
        }


        lat1 = -33.8757436;
        lng1 = 151.2172687;

        $scope.map.panTo({ lat: lat1, lng: lng1 });
        $scope.map.setZoom(15);
        window.setTimeout(function () {
            marker.setPosition({ lat: lat1, lng: lng1 });
            var html = "Here employee 222222!";
            infowindow.setContent(html);
            infowindow.open(map, marker, html);
        }, 100);


    }

});

