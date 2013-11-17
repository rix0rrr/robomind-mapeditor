function Map() {
    var self = this;

    self.tiles = ko.observableArray();

    self.addOrReplaceTile = function(newTile) {
        var i = sortedIndex(self.tiles(), newTile, MapTile.compare);

        if (self.tiles().length <= i)
            self.tiles.push(newTile);
        else if (self.tiles()[i].loc.eql(newTile.loc))
            self.tiles.splice(i, 1, newTile);
        else
            self.tiles.splice(i, 0, newTile);
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
    self.getTiles = function() {
        var ret = [];
        var row = [];
        var lastTile;

        _(self.tiles()).each(function(tile) {
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
}
