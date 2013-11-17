function Tool(id, shadow) {
    var self = this;

    self.id     = id;
    self.shadow = shadow;
    var textureToTile = (shadow ? 225 : 200) / 200;

    self.click = function(map, loc) {
        map.addOrReplaceTile(self.toTile(map, loc));
    }

    self.toTile = function(map, loc) {
        return new MapTile(loc, self.id, self.bgSize(200));
    }

    self.bgSize = function(size) {
        return size * textureToTile;
    }
}
