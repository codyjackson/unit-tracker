define(['angular', 'Unit', 'services', 'leaflet'], function(angular, Unit){
    
    angular.module('controllers', ['services']).
    controller('MainController', ['$scope', '$http', '$xmlParser', function($scope, $http, $xmlParser){
        function extractUnits(jsonRoot){
            var units = {};
            var timeFrames = jsonRoot.GMIMessage.Predictions.LG_LTPByFrame.COASet.TimeFrame;
            //Remove empty timeframes
            timeFrames = timeFrames.filter(angular.isObject);

            function upsertUnit(rawUnit){
                if(!(rawUnit.UnitID && rawUnit.Location))
                    return;

                var id = rawUnit.UnitID;
                var lat = parseFloat(rawUnit.Location.Lat.__text);
                var lng = parseFloat(rawUnit.Location.Lon.__text);
                var location = L.latLng(lat, lng);

                if(!units[id]) {
                    units[id] = new Unit(id, location);
                    return;
                }

                units[id].addLocation(location);
            }

            function flattenToArray(units) {
                var flatUnits = [];
                for(var key in units) {
                    flatUnits.push(units[key]);
                }
                return flatUnits;
            }


            timeFrames.forEach(function(timeFrame){
                if(!angular.isArray(timeFrame.Unit))
                    return;

                timeFrame.Unit.forEach(upsertUnit);
            });
            return flattenToArray(units);
        }

        $scope.onFileSelected = function($event) {
            try {
                var json = $xmlParser.parseXmlToJson($event.fileData);
                $scope.units = extractUnits(json);
            } catch(e) {
                alert('We failed to parse the file you provided. Please ensure that you\'ve provided the proper format. If you have please notify us of the problem.');
                console.log(e);
            }
        };
    }]).
    controller('UnitLegendController', ['$scope', function($scope){
        function getVisiblePathBoundingBox(units) {
            var visibleUnits = units.filter(function(unit){
                return unit.showPath;
            });

            if(visibleUnits.length === 0)
                return null;

            var sw = visibleUnits[0].bounds.getSouthWest();
            var ne = visibleUnits[0].bounds.getNorthEast();
            var boundsClone = L.latLngBounds(sw, ne);
            return visibleUnits.reduce(function(bounds, unit){
                bounds.extend(unit.bounds.getSouthWest());
                bounds.extend(unit.bounds.getNorthEast());
                return bounds;
            }, boundsClone);
        }

        function scrollVisiblePathsIntoView(units) {
            var bounds = getVisiblePathBoundingBox(units);
            if(bounds)
                $scope.fitBounds(bounds);
        }

        $scope.toggleVisiblePath = function(unit) {
            if(unit.showPath)
                $scope.addToMap(unit.path);
            else
                $scope.removeFromMap(unit.path);

            scrollVisiblePathsIntoView($scope.units);
        };

        //This will initialize the the first unit in units to show it's path.
        //It seemed like a nice feature to have in order to show an initial path.
        $scope.$watch('units', function(units){
            if(!units || units.length === 0)
                return;

            units[0].showPath = true;
            $scope.toggleVisiblePath(units[0]);
        });
    }]);
});