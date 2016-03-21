empTracker.controller("empmapController", function ($scope, $state) {

    google.maps.event.addDomListener(window, 'load', initialize);
    var map;

    function initialize() {
        var myLatLng = new google.maps.LatLng(-25.038580, 133.433440);
        var mapOptions = {
            zoom: 4,
            center: myLatLng,
        };
        map = new google.maps.Map(document.getElementById('map'),
            mapOptions);
    }

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

