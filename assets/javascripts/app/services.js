define(['angular', 'xml2json'], function(angular){
    angular.module('services',[]).
    factory('$xmlParser', [function(){
        var x2js = new X2JS();
        
        return {
            parseXmlToJson: function (xmlString) {
                return x2js.xml_str2json(xmlString);
            }
        };
    }]);
});