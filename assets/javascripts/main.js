require.config({
    paths: {
        jquery: 'vendor/jquery/jquery',
        angular: 'vendor/angular/angular',
        'angular-route': 'vendor/angular-route/angular-route',
        controllers: 'app/controllers',
        services: 'app/services',
        directives: 'app/directives',
        leaflet: 'vendor/leaflet/leaflet'
    },
    shim: {
        'angular': {
            deps: ['jquery'],
            exports: 'angular'
        },
        'angular-route': {
            deps: ['angular']
        }
    },
});

require(['angular', 'angular-route', 'controllers', 'directives'], function(angular){
    angular.module('unit-tracker', ['ngRoute', 'controllers', 'directives']).
    config(['$routeProvider', function($routeProvider){
        $routeProvider.when('/', {
            templateUrl: 'partial-views/main.html',
            controller: 'MainController'
        });
    }]);
    angular.element(document).ready(function(){
        angular.bootstrap(document, ['unit-tracker']);
    });
});
