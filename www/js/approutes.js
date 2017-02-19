var empTracker = angular.module('empTracker', ['ionic', 'ngCordova', 'ui.router', 'flexcalendar', 'pascalprecht.translate']);

empTracker.run(function ($ionicPlatform, $rootScope, $state, InternetConnection, CurrentLocation, CallPerodicalUpdate, LocalStorage, $ionicHistory) {
    $ionicPlatform.ready(function () {
        if (window.cordova && window.cordova.plugins.Keyboard) {
            cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
        }
        if (window.StatusBar) {
            StatusBar.styleDefault();
        }

        document.addEventListener("deviceready", onDeviceReady, false);
        function onDeviceReady() {
            console.log(device.cordova);
            console.log(JSON.stringify(device));
            $rootScope.DeviceType = device.platform;
            $rootScope.DeviceName = device.model;
            window.plugins.sim.getSimInfo(function getSimInfoSuccessCallback(result) {
                console.log('111111111111111111111111');
                console.log(JSON.stringify(result));
                $rootScope.IMEI = result.deviceId;
            }, function getSimInfoErrorCallback(error) {
                console.log('000000000000000000000000');
                console.log(JSON.stringify(error));
            });
        }

        //$rootScope.IMEI = 5;



        $ionicPlatform.registerBackButtonAction(function (event) {
            if ($ionicHistory.currentStateName() === 'app.dashboard') {
                event.preventDefault();
            } else {
                $ionicHistory.goBack();
            }
        }, 100);

        $rootScope.showToast = function (_message) {

            window.plugins.toast.showWithOptions({
                message: _message,
                duration: "long",
                position: "center",
                styling: {
                    textColor: '#ffffff',//'#f44336', // Ditto. Default #FFFFFF
                    //textSize: '20.5', // Default is approx. 13.
                    opacity: '0.8', // 0.0 (transparent) to 1.0 (opaque). Default 0.8
                    cornerRadius: '10', // minimum is 0 (square). iOS default 20, Android default 100
                    backgroundColor: '#8b0000',//'#111111',
                    horizontalPadding: '16',// iOS default 16, Android default 50
                    verticalPadding: '12' // iOS default 12, Android default 30
                    // backgroundColor: '#FF0000', // make sure you use #RRGGBB. Default #333333
                }
            },
           //Success callback
            function (args) {
                console.log('cordovaToast: ' + JSON.stringify(args));
                if (args && args.event == "touch") {
                    //alert("touched");
                }
            },
            function (error) {
                log('cordovaToast error: ', error);
            });

            //var audio = new Audio('http://codedreaming.com/wp-content/uploads/main_tune.mp3');
            if (ionic.Platform.isAndroid()) {
                var audio = new Audio('/android_asset/www/sounds/msg.wav');
                audio.play();
            }
            else {
                var audio = new Audio('sounds/msg.wav');
                audio.play();
            }

        }

        $rootScope.userSettings = LocalStorage.getObject('userSettingsObject');

        //start monday mondayWeekStart , mondayWeekEnd
        $rootScope.mondayWeekStart = moment().isoWeekday(1).startOf('isoweek'); //console.log($rootScope.mondayWeekStart._d);
        $rootScope.mondayWeekEnd = moment().isoWeekday(1).endOf('isoweek'); //console.log($rootScope.mondayWeekEnd._d);
        //start sunday sundayWeekStart , sundayWeekEnd
        $rootScope.sundayWeekStart = moment().isoWeekday(1).startOf('isoweek').subtract(1, 'days'); //console.log($rootScope.sundayWeekStart._d);
        $rootScope.sundayWeekEnd = moment().isoWeekday(1).endOf('isoweek').subtract(1, 'days'); //console.log($rootScope.sundayWeekEnd._d);

        if (window.cordova) {
            FCMPlugin.getToken(
                function (sucess) {
                    $rootScope.tokken = sucess;
                    $rootScope.MessagingRegistrationNo = sucess;
                    console.log(sucess);
                }
                , function (err) {
                    $rootScope.tokken = err;
                    console.log(err);
                });
            FCMPlugin.onNotification(
                function (data) {
                    $rootScope.dataFCM = data;
                    console.log(JSON.stringify(data));
                    if (data.wasTapped) {
                        //Notification was received on device tray and tapped by the user.
                        //$state.go('forget');
                        $rootScope.notificationstatusFCM = 'onNotification tapped true';
                        console.log('onNotification tapped true');
                    } else {
                        //$state.go('tempdevicelogin');
                        //Notification was received in foreground. User needs to be notified.
                        $rootScope.notificationstatusFCM = 'onNotification tapped false';
                        console.log('onNotification tapped false');
                    }
                },
                function (msg) { // successCallback
                    $rootScope.msgFCM = msg;
                    console.log('onNotification callback successfully registered: ' + msg);
                },
                function (err) { // errorCallback
                    $rootScope.errFCM = err;
                    console.log('Error registering onNotification callback: ' + err);
                }
            );
            FCMPlugin.onNotificationReceived(
                function (_receivedData) {
                    $rootScope.receivedDataFCM = _receivedData;
                    console.log(_receivedData);
                }
            );
            FCMPlugin.onMessageReceived(
                function (_msgData) {
                    $rootScope.msgDataFCM = _msgData;
                    console.log(_msgData);
                }
            );
        }
    });

    // set default value of internetStatus checkConnection every 10 seconds
    $rootScope.internetStatus = 'disconnected';
    $rootScope.checkInternet = function () {
        setInterval(function () {
            InternetConnection.checkConnection();
        }, 10000);
    };
    $rootScope.checkInternet();

    // get current location lat lng
    $rootScope.locationService = 'inactive';
    $rootScope.getCurrentLocation = function () {
        CurrentLocation.getLatLng();
    };

   

    // challenge called every 10 minutes if UserIsInShift : 600000 ms
    $rootScope.UserIsInShift = false;
    $rootScope.wakeupChallange = function () {
        var rand = Math.floor(Math.random() * 3600000) + 1800000;
        var i = setInterval(function () {
            if ($rootScope.UserIsInShift == true) {
                console.log(rand);
                rand = Math.floor(Math.random() * 3600000) + 1800000
                $state.go('app.challenge');
            }
            else {
                clearInterval(i);
            }
        }, rand);
    };
    $rootScope.wakeupChallange();


    // perodical update called every 10 minutes if UserIsInShift = 600000 ms
    $rootScope.perodicalUpdate = function () {
        setInterval(function () {
            if ($rootScope.UserIsInShift == true) {
                CallPerodicalUpdate.sendUpdate();
            }
        }, 600000);
    };
    $rootScope.perodicalUpdate();

});

empTracker.config(['$ionicConfigProvider', function ($ionicConfigProvider) {
    $ionicConfigProvider.tabs.position('bottom'); // other values: top
}]);


empTracker.config(function ($stateProvider, $urlRouterProvider, $translateProvider) {
    $urlRouterProvider.otherwise('/login');
    $stateProvider
    .state('login', {
        //cache: false,
        url: '/login',
        controller: "LoginController",
        templateUrl: 'templates/login.html'
    })

    .state('forget', {
        cache: false,
        url: '/forget',
        controller: "forgetController",
        templateUrl: 'templates/forget.html'
    })

    .state('tempdevicelogin', {
        cache: false,
        url: '/tempdevicelogin',
        controller: "tempdeviceloginController",
        templateUrl: 'templates/tempdevicelogin.html'
    })

    .state('app', {
        url: '/app',
        abstract: true,
        templateUrl: 'templates/menu.html',
        controller: 'MenuController'
    })

    .state('app.home', {
        cache: false,
        url: '/home',
        views: {
            'menuContent': {
                controller: "homeController",
                templateUrl: 'templates/home.html'
            }
        }
    })

    .state('app.submenu', {
        url: '/submenu',
        views: {
            'menuContent': {
                controller: "MenuController",
                templateUrl: 'templates/submenu.html'
            }
        }
    })

    .state('app.shiftview', {
        cache: false,
        url: '/shiftView/:shiftid?',
        views: {
            'menuContent': {
                controller: "shiftviewController",
                templateUrl: 'templates/shiftview.html'
            }
        }
    })

    .state('app.attendance', {
        url: '/attendance',
        views: {
            'menuContent': {
                controller: "attendanceController",
                templateUrl: 'templates/attendance.html'
            }
        }
    })

    .state('app.notifications', {
        url: '/notifications',
        views: {
            'menuContent': {
                controller: "notificationsController",
                templateUrl: 'templates/notifications.html'
            }
        }
    })

    .state('app.challenge', {
        url: '/challenge',
        views: {
            'menuContent': {
                controller: "challengeController",
                templateUrl: 'templates/challenge.html'
            }
        }
    })

    .state('app.changepassword', {
        url: '/changepassword',
        views: {
            'menuContent': {
                controller: "changepasswordController",
                templateUrl: 'templates/changepassword.html'
            }
        }
    })

    .state('app.myaccount', {
        cache: false,
        url: '/myaccount',
        views: {
            'menuContent': {
                controller: "myaccountController",
                templateUrl: 'templates/myaccount.html'
            }
        }
    })

    .state('app.dashboard', {
        url: '/dashboard',
        views: {
            'menuContent': {
                controller: "dashboardController",
                templateUrl: 'templates/dashboard.html'
            }
        }
    })

    .state('app.viewmap', {
        cache: false,
        url: '/viewmap/:Latitude/:Longitude',
        views: {
            'menuContent': {
                controller: "viewmapController",
                templateUrl: 'templates/viewmap.html'
            }
        }
    })

    .state('app.unscheduledshift', {
        url: '/unscheduledshift',
        views: {
            'menuContent': {
                controller: "unscheduledshiftController",
                templateUrl: 'templates/unscheduledshift.html'
            }
        }
    })


    .state('supervisormenu', {
        url: '/supervisormenu',
        abstract: true,
        templateUrl: 'templates/supervisormenu.html',
        controller: 'supervisormenuController'
    })


    .state('supervisormenu.supervisingemployees', {
        url: '/supervisingemployees',
        views: {
            'menuContent': {
                controller: "supervisingemployeesController",
                templateUrl: 'templates/supervisingemployees.html'
            }
        }
    })

    .state('supervisormenu.supervisoraccount', {
        cache: false,
        url: '/supervisoraccount',
        views: {
            'menuContent': {
                controller: "supervisoraccountController",
                templateUrl: 'templates/supervisoraccount.html'
            }
        }
    })

    .state('supervisormenu.supervisorchangepassword', {
        url: '/supervisorchangepassword',
        views: {
            'menuContent': {
                controller: "supervisorchangepasswordController",
                templateUrl: 'templates/supervisorchangepassword.html'
            }
        }
    })

    .state('supervisormenu.empmap', {
        cache: false,
        url: '/empmap/:Name/:EmpNo/:Latitude/:Longitude',
        views: {
            'menuContent': {
                controller: "empmapController",
                templateUrl: 'templates/empmap.html'
            }
        }
    })

     .state('supervisormenu.supervisornotifications', {
         url: '/supervisornotifications',
         views: {
             'menuContent': {
                 controller: "supervisornotificationsController",
                 templateUrl: 'templates/supervisornotifications.html'
             }
         }
     });


    // Flex Calendar Language Options
    $translateProvider.translations('en', {
        JANUARY: 'January',
        FEBRUARY: 'February',
        MARCH: 'March',
        APRIL: 'April',
        MAI: 'May',
        JUNE: 'June',
        JULY: 'July',
        AUGUST: 'August',
        SEPTEMBER: 'September',
        OCTOBER: 'October',
        NOVEMBER: 'November',
        DECEMBER: 'December',

        SUNDAY: 'Sunday',
        MONDAY: 'Monday',
        TUESDAY: 'Tuesday',
        WEDNESDAY: 'Wednesday',
        THURSDAY: 'Thurday',
        FRIDAY: 'Friday',
        SATURDAY: 'Saturday'
    });
    $translateProvider.preferredLanguage('en');
    $translateProvider.useSanitizeValueStrategy('escape');
});