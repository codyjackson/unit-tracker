define(['angular', 'services'], function(angular){
    angular.module('controllers',['services']).
    controller('MainController', ['$scope', function($scope){
        $scope.units = [
            {
                name: 'Ted'
            },
            {
                name: 'Jim'
            }
        ];
    }]);
});