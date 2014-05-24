define(['seedrandom', 'md5'], function(seedrandom, md5){
    //A random color generator that generates colors that look
    //decent together. Largely an implementation of the algorithm explained here:
    //http://stackoverflow.com/questions/43044/algorithm-to-randomly-generate-an-aesthetically-pleasing-color-palette
    function generateRandomColor(unitId) {
        Math.seedrandom(md5(unitId));
        function getRandomChannelValue(mix) {
            var randomChannel = Math.random() * 256;
            return Math.floor((randomChannel + mix) / 2);
        }
        var r = getRandomChannelValue(100);
        var g = getRandomChannelValue(100);
        var b = getRandomChannelValue(100);


        return 'rgb(' + r + ',' + g + ',' + b + ')';
    }

    /*
    * Unit is a class which associates an id with a path and bounding box.
    *
    * Properties:
    *   id: <string> An identifier which is unique amongst other unit objects.
    *   path: <PolyLine> A path that this particular unit has taken.
    *   bounds: <LatLngBounds> A bounding box for the path.
    *
    * Unit(id, firstLocation):
    *   id: <string> An identifier which is unique amongst other unit objects.
    *   firstLocation: <LatLng> The starting location of the unit.
    *
    * Methods:
    *   addLocation(latlng):
    *       latlng: <LatLng> The next location that the unit traveled to.
    *
    *   getDistance():
    *       returns: Number The total distance this unit has traveled along the 
    *                current path.
    *   
    *   getColor():
    *       returns: <string> A color randomly assigned to this unit which should 
                              destinguish it from other units.
    */
    function Unit(id, firstLocation) {
        this.id = id;
        this.path = L.polyline([firstLocation], {
            color: generateRandomColor(id),
            opacity: 1.0
        });
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

    Unit.prototype.getColor = function() {
        return this.path.options.color;
    };

    return Unit;
});