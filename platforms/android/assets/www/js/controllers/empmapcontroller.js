empTracker.controller("empmapController", function ($scope, $state, $timeout, $stateParams, $rootScope, $window, $cordovaGeolocation, $ionicLoading) {
    var marker, infowindow;
    $scope.$on('$ionicView.enter', function () {
        //$rootScope.toggledrag = true;
        //Create a Map in Your Application
        var options = { timeout: 10000, enableHighAccuracy: false };
        $cordovaGeolocation.getCurrentPosition(options).then(function (position) {
            $rootScope.locationService = 'active';
            // emp coordinates
            var latLng;
            if ($stateParams.Latitude == null) {
                latLng = { lat: 0, lng: 0 };
            }
            else {
                latLng = new google.maps.LatLng($stateParams.Latitude, $stateParams.Longitude);
            }
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

                if ($stateParams.Latitude == null || $stateParams.Latitude == ''|| $stateParams.Latitude === undefined) {
                    console.log('if 00');
                    infowindow = new google.maps.InfoWindow({
                        content: "Employee " + $stateParams.Name + " is not clocked in any shift"
                    });
                }
                else {
                    console.log('else 00');
                    console.log($stateParams.Latitude);
                    infowindow = new google.maps.InfoWindow({
                        content: "Here is " + $stateParams.Name
                    });
                }

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
        $scope.adjustEmpData($stateParams.EmpNo);
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
    $scope.adjustEmpData = function (_EmpNo) {
        $scope.empArray = [];
        var emp;
        // i'm here
        for (var i = 0; i < $rootScope.allemployeesArray.length; i++) {
            
            if ($rootScope.allemployeesArray[i].Shifts.length != 0) {
                console.log('if');
                console.log($rootScope.allemployeesArray[i].Shifts[0].SiteCoordinates.Latitude);
                emp = { "id": i, "EmpNo": $rootScope.allemployeesArray[i].EmpNo, "Name": $rootScope.allemployeesArray[i].Name, "Lat": $rootScope.allemployeesArray[i].Shifts[0].SiteCoordinates.Latitude, "Lng": $rootScope.allemployeesArray[i].Shifts[0].SiteCoordinates.Logitude, "selected": false };
                if (emp.EmpNo == _EmpNo) {
                    emp.selected = true;
                    $scope.indexToShow = i;
                    console.log($scope.empArray[i]);
                }
            }
            else {
                console.log('else');
                emp = { "id": i, "EmpNo": $rootScope.allemployeesArray[i].EmpNo, "Name": $rootScope.allemployeesArray[i].Name, "Lat": 0, "Lng": 0, "selected": false };
                if (emp.EmpNo == _EmpNo) {
                    emp.selected = true;
                    $scope.indexToShow = i;
                    console.log($scope.empArray[i]);
                }
            }

            console.log(emp);
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


        lat1 = $scope.empArray[$scope.indexToShow].Lat; // //-33.8757436
        lng1 = $scope.empArray[$scope.indexToShow].Lng; // //151.2172687

        $scope.map.panTo({ lat: lat1, lng: lng1 });
        $scope.map.setZoom(15);
        window.setTimeout(function () {
            var html;
            if (lat1 == 0) {
                console.log('if : null');
                marker.setPosition({ lat: 0, lng: 0 });
                html = "Employee " + $scope.empArray[$scope.indexToShow].Name + " is not clocked in any shift";
            }
            else {
                console.log('else : not null');
                marker.setPosition({ lat: lat1, lng: lng1 });
                html = "Here is " + $scope.empArray[$scope.indexToShow].Name;
            }
            infowindow.setContent(html);
            infowindow.open(map, marker, html);
        }, 100);


    }

});

