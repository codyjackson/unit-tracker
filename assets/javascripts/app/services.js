define(['angular', 'xml2json'], function(angular){
    angular.module('services',[]).

    /*
    *This service provides a very thin wrapper around the xml2json library.
    *
    *parseXmlToJson(xmlString):
    *   This takes an xml string and returns a json object. It's a wrapper around
    */
    factory('$xmlParser', [function(){
        var x2js = new X2JS();
        
        return {
            parseXmlToJson: function (xmlString) {
                return x2js.xml_str2json(xmlString);
            }
        };
    }]);
});