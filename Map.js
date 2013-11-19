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
            while (self.tiles()[j].hasLoc(newTile.loc) && j < self.tiles().length) {
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

    /**
     * Get tiles in a sparse array
     */
    self.getTiles2D = function(layer) {
        var ret = [];
        var row = [];
        var lastTile;

        _(self.tiles()).each(function(tile) {
            if (!tile.onLayer(layer)) return;

            if (!lastTile || tile.row() == lastTile.row()) {
                if (lastTile) 
                    for (var i = lastTile.col() + 1; i < tile.col(); i++)
                        row.push(null);
                row.push(tile);
            } else {
                for (var i = lastTile.row() + 1; i < tile.row(); i++)
                    ret.push([]);
                ret.push(row);
                row = [tile];
            }
            lastTile = tile;
        });
        if (row.length) ret.push(row)

        return ret;
    }

    self.getTiles = function(layer) {
        return _(self.tiles()).filter(function(tile) {
            return tile.onLayer(layer);
        });
    }
}
