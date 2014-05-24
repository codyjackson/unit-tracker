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


        var t = 'rgb(' + r + ',' + g + ',' + b + ')';
        console.log(t);
        return t;
    }

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

    return Unit;
});