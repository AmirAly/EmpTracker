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
        if ($stateParams.Latitude == null || $stateParams.Longitude == null) {
            $scope.noCoordinates = true;
        }
        else {
            $scope.noCoordinates = false;
        }
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
        console.log($rootScope.rosteredEmployeesArray);
        console.log($rootScope.otherEmployeesArray);
        for (var i = 0; i < $rootScope.rosteredEmployeesArray.length; i++) {
            console.log($rootScope.rosteredEmployeesArray[i].Shifts[0].SiteCoordinates.Latitude);
            emp = { "id": i, "Name": $rootScope.rosteredEmployeesArray[i].Name, "Lat": $rootScope.rosteredEmployeesArray[i].Shifts[0].SiteCoordinates.Latitude, "Lng": $rootScope.rosteredEmployeesArray[i].Shifts[0].SiteCoordinates.Logitude, "selected": false };
            if (emp.Latitude == lat && emp.Logitude == lng) {
                emp.selected = true;
                $scope.indexToShow = i;
                console.log($scope.empArray[i]);
            }
            console.log(emp);
            $scope.empArray.push(emp);
        }
        for (var i = 0; i < $rootScope.otherEmployeesArray.length; i++) {
            emp = { "id": i, "Name": $rootScope.otherEmployeesArray[i].Name, "Lat": $rootScope.otherEmployeesArray[i].SiteCoordinates.Latitude, "Lng": $rootScope.otherEmployeesArray[i].SiteCoordinates.Logitude, "selected": false };
            if ($rootScope.otherEmployeesArray[i].SiteCoordinates.Latitude == lat && $rootScope.otherEmployeesArray[i].SiteCoordinates.Logitude == lng) {
                emp.selected = true;
                $scope.indexToShow = i;
                console.log($scope.empArray[i]);
            }
            $scope.empArray.push(emp);
        }
        console.log($scope.empArray);
    }
    
    $scope.nextEmp = function () {
        $scope.indexToShow = ($scope.indexToShow + 1);
        if ($scope.indexToShow < $scope.empArray.length) {
            console.log($scope.empArray[$scope.indexToShow]);
        }
        else {
            $scope.indexToShow = 0;
            console.log($scope.empArray[$scope.indexToShow]);
        }


        lat1 = -33.8757436; //$scope.empArray[$scope.indexToShow].Lat
        lng1 = 151.2172687; //$scope.empArray[$scope.indexToShow].Lng

        $scope.map.panTo({ lat: lat1, lng: lng1 });
        $scope.map.setZoom(15);
        window.setTimeout(function () {
            marker.setPosition({ lat: lat1, lng: lng1 });
            var html = $scope.empArray[$scope.indexToShow].Name;
            infowindow.setContent(html);
            infowindow.open(map, marker, html);
        }, 100);


    }

});

