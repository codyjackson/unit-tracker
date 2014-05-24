define(['angular', 'services', 'leaflet'], function(angular){
    angular.module('controllers', ['services']).
    controller('MainController', ['$scope', '$http', '$xmlParser', function($scope, $http, $xmlParser){

        function Unit(id, firstLocation) {
            this.id = id;
            this.path = L.polyline([firstLocation]);
            this.bounds = null;
        }

        Unit.prototype.addLocation = function (latlng) {
            this.path.addLatLng(latlng);
            if(this.path._latlngs.length == 2)
                this.bounds = L.latLngBounds(this.path._latlngs[0], this.path._latlngs[1]);
            else
                this.bounds.extend(latlng);
        };

        Unit.prototype.getDistance = function() {
            var latLngs = this.path._latlngs;
            if(latLngs.length < 2)
                return 0;

            var distance = 0;
            for(var i = 0; i < latLngs.length - 1; ++i) {
                distance += latLngs[i].distanceTo(latLngs[i + 1]);
            }
            return distance / 1000;
        };

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

            return units;
        }

        $http.get('GMIMessageEx2.xml').then(function(response){
            var json = $xmlParser.parseXmlToJson(response.data);
            $scope.units = extractUnits(json);
        });
    }]).
    controller('UnitLegendController', ['$scope', function($scope){
        $scope.togglePath = function(unit) {
            if(unit.showPath)
                $scope.addToMap(unit.path);
            else
                $scope.removeFromMap(unit.path);
        };
    }]);
});