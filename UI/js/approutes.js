var empTracker = angular.module('empTracker', ['ionic', 'flexcalendar', 'pascalprecht.translate'])

empTracker.run(function ($ionicPlatform, $rootScope) {
    $ionicPlatform.ready(function () {
        if (window.cordova && window.cordova.plugins.Keyboard) {
            cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
        }
        if (window.StatusBar) {
            StatusBar.styleDefault();
        }
    });
})

empTracker.run(function ($templateCache, $http) {
    $http.get('templates/calendar.html', { cache: $templateCache });
    $http.get('templates/dailyview.html', { cache: $templateCache });
    $http.get('templates/empmap.html', { cache: $templateCache });
    $http.get('templates/home.html', { cache: $templateCache });
    $http.get('templates/myaccount.html', { cache: $templateCache });
    $http.get('templates/submenu.html', { cache: $templateCache });
    $http.get('templates/login.html', { cache: $templateCache });
    $http.get('templates/tempdevicelogin.html', { cache: $templateCache });
    $http.get('templates/menu.html', { cache: $templateCache });
    $http.get('templates/supervisingemployees.html', { cache: $templateCache });
    $http.get('templates/supervisoraccount.html', { cache: $templateCache });
    $http.get('templates/thisweek.html', { cache: $templateCache });
    $http.get('templates/tracker.html', { cache: $templateCache });
    $http.get('templates/attendance.html', { cache: $templateCache });
    $http.get('templates/supervisornotifications.html', { cache: $templateCache });
});

empTracker.config(function ($stateProvider, $urlRouterProvider, $translateProvider) {
    $urlRouterProvider.otherwise('/login');
    $stateProvider
    .state('login', {
        cache: false,
        url: '/login',
        controller: "LoginController",
        templateUrl: 'templates/login.html'
    })
    .state('tempdevicelogin', {
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
        url: '/home',
        views: {
            'menuContent': {
                controller: "homeController",
                templateUrl: 'templates/home.html'
            }
        }
    })
    .state('app.thisweek', {
        url: '/thisweek',
        views: {
            'menuContent': {
                controller: "thisweekController",
                templateUrl: 'templates/thisweek.html'
            }
        }
    })
    .state('app.submenu', {
        url: '/submenu',
        views: {
            'menuContent': {
                controller: "submenuController",
                templateUrl: 'templates/submenu.html'
            }
        }
    })
    .state('app.dailyview', {
        cache: false,
        url: '/dailyview',
        views: {
            'menuContent': {
                controller: "dailyviewController",
                templateUrl: 'templates/dailyview.html'
            }
        }
    })
    .state('app.tracker', {
        url: '/tracker',
        views: {
            'menuContent': {
                controller: "trackerController",
                templateUrl: 'templates/tracker.html'
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
    .state('app.calendar', {
        url: '/calendar',
        views: {
            'menuContent': {
                controller: "calendarController",
                templateUrl: 'templates/calendar.html'
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
    .state('app.myaccount', {
        url: '/myaccount',
        views: {
            'menuContent': {
                controller: "myaccountController",
                templateUrl: 'templates/myaccount.html'
            }
        }
    })
    .state('supervisingemployees', {
        url: '/supervisingemployees',
        controller: "supervisingemployeesController",
        templateUrl: 'templates/supervisingemployees.html'
    })
    .state('empmap', {
        url: '/empmap',
        cache: false,
        controller: "empmapController",
        templateUrl: 'templates/empmap.html'

    })
    .state('supervisoraccount', {
        url: '/supervisoraccount',
        controller: "supervisoraccountController",
        templateUrl: 'templates/supervisoraccount.html'

    })
    .state('supervisornotifications', {
        url: '/supervisornotifications',
        controller: "supervisornotificationsController",
        templateUrl: 'templates/supervisornotifications.html'

    });


    // Flex Calendar Language Options
    $translateProvider.translations('en', {
        JANUARY: 'January',
        FEBRUARY: 'February',
        MARCH: 'March',
        APRIL: 'April',
        MAI: 'Mai',
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