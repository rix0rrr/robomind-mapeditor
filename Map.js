function Map() {
    var self = this;

    self.tiles = ko.observableArray();

    /**
     * Keep the tiles sorted, so that when they are drawn in
     * sequence, they display correctly
     */
    var sortTiles = function(tiles) {
        // Sort first by row, then by column
        tiles.sort(function(a, b) {
            var d_layer = a.layer - b.layer;
            var d_row   = a.loc.e(2) - b.loc.e(2);
            var d_col   = a.loc.e(1) - b.loc.e(1);

            if (d_layer != 0) return d_layer;
            if (d_row   != 0) return d_row;
            return d_col;
        });
    };

    self.addOrReplaceTile = function(newTile) {
        var existing = _(self.tiles()).find(function(tile) {
            return tile.loc.eql(newTile.loc);
        });

        if (existing) self.tiles.remove(existing);
        self.tiles.push(newTile);
        sortTiles(self.tiles);
    }

    self.replaceTiles = function(tiles) {
        sortTiles(tiles);
        self.tiles(tiles);
    }
}
