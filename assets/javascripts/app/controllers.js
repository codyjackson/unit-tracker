define(['angular', 'Unit', 'services', 'leaflet'], function(angular, Unit){
    angular.module('controllers', ['services']).
    controller('MainController', ['$scope', '$http', '$xmlParser', function($scope, $http, $xmlParser){
        function extractUnits(jsonRoot){
            var units = {};
            var timeFrames = jsonRoot.GMIMessage.Predictions.LG_LTPByFrame.COASet.TimeFrame;

            //Ignore empty time frames
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

            timeFrames.forEach(function(timeFrame){
                if(!angular.isArray(timeFrame.Unit))
                    return;

                timeFrame.Unit.forEach(upsertUnit);
            });

            function flattenToArray(units) {
                var flatUnits = [];
                for(var key in units) {
                    flatUnits.push(units[key]);
                }
                return flatUnits;
            }

            return flattenToArray(units);
        }

        $http.get('GMIMessageEx2.xml').then(function(response){
            var json = $xmlParser.parseXmlToJson(response.data);
            $scope.units = extractUnits(json);
        });
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

        $scope.togglePath = function(unit) {
            if(unit.showPath)
                $scope.addToMap(unit.path);
            else
                $scope.removeFromMap(unit.path);

            var bounds = getVisiblePathBoundingBox($scope.units);
            if(bounds)
                $scope.fitBounds(bounds);
        };
    }]);
});