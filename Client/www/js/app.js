angular.module('App', ['App.controllers', 'App.services', 'App.models', 'ui.router', 'ngMaterial'])
    .config(function ($stateProvider, $urlRouterProvider, $mdThemingProvider) {
        $stateProvider
            .state('fridge', {
                url: '/fridge',
                templateUrl: 'views/fridge.html'
            })

            .state('shopping', {
                url: '/shopping',
                templateUrl: 'views/shopping.html'
            })

            .state('menus', {
                url: '/menus',
                templateUrl: 'views/menus.html'
            });

        $urlRouterProvider.otherwise('/fridge');

        $mdThemingProvider.theme('default')
            .primaryPalette('light-blue')
            .accentPalette('deep-orange');
    });

isMobile = document.URL.indexOf('http://') === -1 && document.URL.indexOf('https://') === -1;

URL_SERVER = "http://77.204.229.132/whatsinmyfridge/";