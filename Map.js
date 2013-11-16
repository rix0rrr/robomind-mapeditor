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
}
