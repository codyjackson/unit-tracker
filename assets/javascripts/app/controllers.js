define(['angular', 'services'], function(angular){
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

        $http.get('GMIMessageEx2.xml').then(function(response){
            var json = $xmlParser.parseXmlToJson(response.data);
            console.log(json);
        });
    }]);
});