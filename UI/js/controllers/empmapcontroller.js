empTracker.controller("empmapController", function ($scope, $state,$timeout) {
    //$scope.load = function () {
    //    console.log('emp map');
    //    google.maps.event.addDomListener(window, 'load', initialize());
    //    var map2;
    //    function initialize() {
    //        console.log('init');
    //        $timeout(function () {
    //            var myLatLng = new google.maps.LatLng(-25.038580, 133.433440);
    //            var mapOptions = {
    //                zoom: 4,
    //                center: myLatLng,
    //            };
    //            map2 = new google.maps.Map(document.getElementById('map2'),
    //                mapOptions);
    //        }, 1000);
    //    }
    //}
    //$scope.load();

    
   

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

