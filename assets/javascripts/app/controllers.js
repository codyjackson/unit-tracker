define(['angular', 'services', 'leaflet'], function(angular){
    angular.module('controllers', ['services']).
    controller('MainController', ['$scope', '$http', '$xmlParser', function($scope, $http, $xmlParser){
        $scope.units = [
            {
                name: 'Ted'
            },
            {
                name: 'Jim'
            }
        ];

        function Unit(id, firstLocation) {
            this.id = id;
            this.locations = [firstLocation];
        }

        Unit.prototype.addLocation = function (location) {
            this.locations.push(location);
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
            console.log(json);
            console.log(extractUnits(json));
        });
    }]);
});