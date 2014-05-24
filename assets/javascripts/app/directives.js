define(['angular', 'services', 'leaflet'], function(angular){
    angular.module('directives',['services']).
    /*
    *This directive will allow the element to be clicked on to open the user's 
    *filebrowser as well as allow the user to drag and drop files onto the element.
    *
    *Attributes:
    *   file-selected
    *       Evaluates an expression while passing it an object that looks like:
    *       {
    *           $event: {
    *               fileData: <filedata>
    *               fileName: <filename>
    *           }
    *       }
    *   typical usage: file-selected="onFileSelected($event)"
    */
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
    /*
    *This directive will inject a leaflet map with osm tiles into itself.
    *
    *It's a stripped down analog of leaflet's maps:
    *http://leafletjs.com/reference.html#map-class
    *
    *Scope Methods:
    *   $scope.addToMap(leafletEntity)
    *       Adds any leaflet entity that supports <entity>.addTo(map).
    *   $scope.removeFromMap(leafletEntity)
    *       Removes any leaflet entity that supports map.removeLayer(<entity>).
    */
    directive('map', ['$q', function($q){
        //We're using the promise so that we can defer invocations on
        //the map object until after it's been constructed in the link
        //function.
        var _mapDeferred = $q.defer(); 
        var _mapPromise = _mapDeferred.promise;
        return {
            resrict: 'A',
            scope: true,
            link: function(scope, element, attributes, controller) {
                var jelement = $(element);
                var map = L.map(jelement[0]).setView([51.505, -0.09], 13);

                L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
                    attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                }).addTo(map);

                _mapDeferred.resolve(map);
            },
            controller: ['$scope', function($scope){
                $scope.addToMap = function (entity) {
                    _mapPromise.then(function(map){
                        entity.addTo(map);
                    });
                }

                $scope.removeFromMap = function (entity) {
                    _mapPromise.then(function(map){
                        map.removeLayer(entity);
                    });
                }

                $scope.fitBounds = function(latLngBounds) {
                    _mapPromise.then(function(map){
                        map.fitBounds(latLngBounds);
                    });
                }
            }]
        };
    }]).
    /*
    *This directive will simply inject itself into the map directive as one of
    *it's controls. 
    *
    *It's a stripped down analog of leaflet's control:
    *http://leafletjs.com/reference.html#control
    */
    directive('control', [function(){
        return {
            restrict: 'A',
            transclude: 'element',
            require: ['^map'],
            link: function(scope, element, attributes, controllers, transclude) {
                var control = L.control();

                transclude(scope, function(clone){
                    control.onAdd = function(map){
                        return clone[0];
                    };
                    scope.addToMap(control);
                });

                scope.$on('$destroy', function() {
                    scope.removeFromMap(control);
                });
            }
        };
    }]);
});