define(['angular', 'services', 'leaflet'], function(angular){
    angular.module('directives',['services']).
    directive('map', [function(){
        return {
            resrict: 'A',
            link: function(scope, element, attributes, controller) {
                var jelement = $(element);
                var map = L.map(jelement[0]).setView([51.505, -0.09], 13);

                // add an OpenStreetMap tile layer
                L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
                    attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                }).addTo(map);
            }
        };
    }]);
});