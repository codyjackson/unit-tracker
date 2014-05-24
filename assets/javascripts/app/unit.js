define([], function(){
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
        
    return Unit;
});