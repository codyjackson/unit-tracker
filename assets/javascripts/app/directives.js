define(['angular', 'services', 'leaflet'], function(angular){
    angular.module('directives',['services']).
    directive('filebrowser', ['$q', '$parse', '$rootScope', function($q, $parse, $rootScope){
        return {
            restrict: 'A',
            link: function(scope, element, attributes, controller){
                var filebutton = $('<input type="file" style="position:fixed;top:-1000px;left:-1000px">').insertBefore(element);
                var jelement = $(element);

                function loadFile(file){
                    var deferred = $q.defer();
                    var reader = new FileReader();
                    reader.onload = function(ev){
                        deferred.resolve({fileData:ev.target.result, fileName:file.name});
                    };
                    reader.readAsText(file);
                    return deferred.promise;
                }

                function onFileSelected(ev){
                    ev.target = element;
                    clickHandler = $parse(attributes.fileSelected);
                    clickHandler(scope, {$event: ev});
                }

                $(document).on('drop dragleave dragover', function(ev){
                    ev.preventDefault();
                });

                element.on('click', function(){
                    filebutton.click();
                });

                filebutton.on('change', function(ev){
                    loadFile(ev.currentTarget.files[0]).then(onFileSelected);
                });

                element.on('drop', function(ev){
                    ev.preventDefault();
                    ev.stopPropagation();
                    loadFile(ev.originalEvent.dataTransfer.files[0]).then(onFileSelected);
                });


                var fileHoverClass = 'filehover';
                element.on('dragenter', function(){
                    element.addClass(fileHoverClass);
                });

                element.on('dragleave drop', function(){
                    element.removeClass(fileHoverClass);
                });
            }
        };
    }]).
    directive('map', [function(){
        var controls = [];
        return {
            resrict: 'A',
            link: function(scope, element, attributes, controller) {
                var jelement = $(element);
                var map = L.map(jelement[0]).setView([51.505, -0.09], 13);

                L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
                    attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                }).addTo(map);

                controls.forEach(function(control){
                    control.addTo(map);
                });
            },
            controller: ['$scope', function($scope){
                this.addControl = function(leafletControl){
                    controls.push(leafletControl);
                };
            }]
        };
    }]).
    directive('controlLayer', [function(){
        return {
            restrict: 'A',
            transclude: 'element',
            require: ['^map'],
            link: function(scope, element, attributes, controllers, transclude) {
                var mapController = controllers[0];
                transclude(scope, function(clone){
                    var control = L.control();
                    control.onAdd = function(map){
                        return clone[0];
                    };
                    mapController.addControl(control);
                });
            }
        };
    }]);
});