require.config({
    paths: {
        jquery: 'vendor/jquery/jquery',
        angular: 'vendor/angular/angular',
        'angular-route': 'vendor/angular-route/angular-route',
        controllers: 'app/controllers',
        services: 'app/services',
        directives: 'app/directives',
        Unit: 'app/unit',
        leaflet: 'vendor/leaflet/leaflet',
        xml2json: 'vendor/xml2json/xml2json',
        seedrandom: 'vendor/seedrandom/seedrandom',
        md5: 'vendor/JavaScript-MD5/md5'
    },
    shim: {
        'angular': {
            deps: ['jquery'],
            exports: 'angular'
        },
        'angular-route': {
            deps: ['angular']
        },
        'xml2json': {
            exports: 'xml2json'
        }
    },
});

require(['angular', 'angular-route', 'controllers', 'directives'], function(angular){
    var application = angular.module('unit-tracker', ['ngRoute', 'controllers', 'directives']);
    
    //Configure application routes
    application.config(['$routeProvider', function($routeProvider){
        $routeProvider.when('/', {
            templateUrl: 'partial-views/main.html',
            controller: 'MainController'
        });
    }]);
    
    //Bootstrap the angular application
    angular.element(document).ready(function(){
        angular.bootstrap(document, ['unit-tracker']);
    });
});
