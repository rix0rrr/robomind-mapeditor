function MapTile(loc, id, unscaledSize) {
    this.loc = loc;
    this.id  = id;
    this.unscaledSize = unscaledSize;
    this.layer = 0;
}
MapTile.prototype.col = function() {
    return this.loc.e(1);
}
MapTile.prototype.row = function() {
    return this.loc.e(2);
}
MapTile.prototype.mapSymbol = function() {
    if (this.id.match(/^tile-/))
        return this.id.substr(5);
    return '?';
}
MapTile.prototype.hasLoc = function(loc) {
    return this.loc.eql(loc);
}

/**
 * Sort first by layer, then by row, then by column
 */
MapTile.compare = function(a, b) {
    var d_layer = a.layer    - b.layer;
    var d_row   = a.loc.e(2) - b.loc.e(2);
    var d_col   = a.loc.e(1) - b.loc.e(1);

    if (d_layer != 0) return d_layer;
    if (d_row   != 0) return d_row;
    return d_col;
}
