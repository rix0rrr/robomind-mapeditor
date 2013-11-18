/**
 * ID is the symbol used in mapfiles
 *
 */
function Tool(id, shadow, fileName) {
    var self = this;

    self.id     = id;
    self.shadow = shadow;
    self.layer  = 0;
    self.fileName = fileName || ('tile-' + self.id);

    var textureToTile = (shadow ? 225 : 200) / 200;

    var to3DLocation = function(loc2d) {
        return $V([ loc2d.e(1), loc2d.e(2), self.layer ]);
    }

    self.click = function(map, loc) {
        map.addOrReplaceTile(self.toTile(map, loc));
    }

    self.toTile = function(map, loc) {
        if (loc.dimensions() != 2) throw new Error("Tool functions accept 2D locations");
        return new MapTile(to3DLocation(loc), self.id, self);
    }

    self.bgSize = function(size) {
        return size * textureToTile;
    }

    self.bgImage = function(skin) {
        return skin.file(self.fileName + '.png');
    }
}

function RemoveTool() {
    var self = this;

    self.id = 'remove';
    self.click  = function(map, loc) { map.removeTile(loc); }
    self.bgSize = function(size) { return size; }
    self.bgImage = function(skin) {
        return 'images/remove.png';
    }
}
