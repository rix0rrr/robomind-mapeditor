function Tool(id, shadow) {
    var self = this;

    self.id     = id;
    self.shadow = shadow;

    self.click = function(map, loc) {
        map.addOrReplaceTile(new MapTile(loc, self.id, shadow ? 225 : 200));
    }
}
