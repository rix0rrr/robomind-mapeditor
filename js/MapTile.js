/**
 * Map Tile
 *
 * Locations are actually 3-dimensional, the 3rd coordinate
 * is the "layer"
 */
function MapTile(loc, id, tool) {
    if (loc.dimensions() != 3) throw new Error("Tile location should have 3 dimensions");

    this.loc  = loc;
    this.id   = id;
    this.tool = tool;
}
MapTile.prototype.col = function() {
    return this.loc.e(1);
}
MapTile.prototype.row = function() {
    return this.loc.e(2);
}
MapTile.prototype.mapSymbol = function() {
    return this.id;
}
MapTile.prototype.hasLoc = function(loc) {
    if (loc.dimensions() == 3) {
        // Match location exactly
        for (var y = 0; y < this.tool.ysize; y++)
            for (var x = 0; x < this.tool.xsize; x++)
                if (this.loc.add($V([x, y, 0])).eql(loc))
                    return true;
        return false;
    } else {
        // Match location approximately
        for (var y = 0; y < this.tool.ysize; y++)
            for (var x = 0; x < this.tool.xsize; x++) {
                var l = this.loc.add($V([x, y, 0]));
                if (l.e(1) == loc.e(1) && l.e(2) == loc.e(2))
                    return true;
            }
        return false;
    }
}
MapTile.prototype.onLayer = function(layer) {
    return this.loc.e(3) == layer;
}

/**
 * Sort first by layer, then by row, then by column
 */
MapTile.compare = function(a, b) {
    var d_layer = a.loc.e(3) - b.loc.e(3);
    var d_row   = a.loc.e(2) - b.loc.e(2);
    var d_col   = a.loc.e(1) - b.loc.e(1);

    if (d_layer != 0) return d_layer;
    if (d_row   != 0) return d_row;
    return d_col;
}
