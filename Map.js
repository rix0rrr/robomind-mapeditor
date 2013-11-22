function Map() {
    var self = this;

    self.tiles = ko.observableArray();

    /**
     * Place a tile on the map, replacing any tiles at the same location
     *
     * Tiles with the given IDs are not replaced.
     */
    self.addOrReplaceTile = function(newTile, allowTileIds) {
        var i = sortedIndex(self.tiles(), newTile, MapTile.compare);

        if (self.tiles().length <= i)
            // Add at end
            self.tiles.push(newTile);
        else {
            var j = i;
            // Remove tiles at those locations, unless they are allowed
            while (j < self.tiles().length && self.tiles()[j].hasLoc(newTile.loc)) {
                if (self.tiles()[j].id == newTile.id) return; // Already there
                if (!_(allowTileIds).contains(self.tiles()[j].id))
                    self.tiles.splice(j, 1); // Delete
                else // Increase
                    j++; 
            }

            // Insert at sorted location
            self.tiles.splice(i, 0, newTile);
        } 
    }

    /**
     * Remove a tile at a 2D or 3D location
     */
    self.removeTile = function(loc) {
        self.tiles(_(self.tiles()).filter(function(tile) {
            return !tile.hasLoc(loc);
        }));
    }

    self.replaceTiles = function(tiles) {
        tiles.sort(MapTile.compare);
        self.tiles(tiles);
    }

    var minRow = function() { return self.tiles().length ? self.tiles()[0] : 0; }
    var maxRow = function() { return self.tiles().length ? self.tiles()[self.tiles().length - 1] : -1; }
    var minCol = function() { return _.chain(self.tiles()).invoke('col').min().value(); }
    var maxCol = function() { return _.chain(self.tiles()).invoke('col').max().value(); }

    self.getTiles = function(layer) {
        return _(self.tiles()).filter(function(tile) {
            return tile.onLayer(layer);
        });
    }

    /**
     * Get tiles in a sparse array
     */
    self.getTiles2D = function(layer) {
        var layerTiles = self.getTiles(layer);
        if (layerTiles.length == 0) return [];

        var minCol = _(layerTiles).min(function(tile) { return tile.col(); }).col();
        var minRow = _(layerTiles).min(function(tile) { return tile.row(); }).row();
        var maxRow = _(layerTiles).max(function(tile) { return tile.row(); }).row();
        var rows   = _(layerTiles).groupBy(function(tile) { return tile.row(); });

        var ret = [];
        for (var y = minRow; y <= maxRow; y++) {
            var row = [];

            if (rows[y] !== undefined) {
                var lastCol = minCol;
                _(rows[y]).each(function(tile) {
                    while (lastCol < tile.col()) {
                        row.push(null);
                        lastCol++;
                    }
                    row.push(tile);
                });
            }

            ret.push(row);
        }

        return ret;
    }

    /**
     * Return the most topleft coordinate of the tile layer
     */
    self.topLeft2D = function() {
        var mapTiles = self.getTiles(TileLayer);
        if (mapTiles.length == 0) return $V([ 0, 0 ]);

        var x = mapTiles[0].loc.e(1);
        var y = mapTiles[0].loc.e(2);

        _(mapTiles).each(function(tile) {
            if (tile.loc.e(1) < x) x = tile.loc.e(1);
            if (tile.loc.e(2) < y) y = tile.loc.e(2);
        });
        return $V([ x, y ]);
    }
}
