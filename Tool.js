var TileSize   = 200;
var ShadowSize = 25;

/**
 * ID is the symbol used in mapfiles
 *
 */
function Tool(id, options) {
    var self = this;

    options = options || {};

    self.id       = id;
    self.layer    = options.layer || 0;
    self.xsize    = options.w || 1;
    self.ysize    = options.h || 1;
    var shadow    = options.shadow || false;
    var fileName  = options.fileName || ('tile-' + self.id);
    var bgWidth   = options.textureTiles || self.xsize;   
    var bgHeight  = options.bgH || self.ysize;   
    var shareLoc  = options.shareLoc || [];

    var textureToTile = (shadow ? 225 : 200) / 200;

    var to3DLocation = function(loc2d) {
        return $V([ loc2d.e(1), loc2d.e(2), self.layer ]);
    }

    self.click = function(map, loc) {
        map.addOrReplaceTile(self.toTile(map, loc), shareLoc);
    }

    self.toTile = function(map, loc) {
        if (loc.dimensions() != 2) throw new Error("Tool functions accept 2D locations");
        return new MapTile(to3DLocation(loc), self.id, self);
    }

    var calcSize = function(size, tiles, shadow) {
        var t = tiles || 1;
        return (t * size) * (shadow ? textureToTile : 1.0);
    }

    self.bgImage = function(skin) {
        return skin.file(fileName + '.png');
    }

    self.image = function(skin, size, shadow) {
        return {
            background: 'url(' + self.bgImage(skin) + ')',
            'background-size': calcSize(size, bgWidth, true) + 'px ' + calcSize(size, bgHeight, true) + 'px',
            'width':  calcSize(size, self.xsize, shadow) + 'px',
            'height': calcSize(size, self.ysize, shadow) + 'px'
        }
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

    self.image = function(skin, size, shadow) {
        return {
            background: 'url(' + self.bgImage(skin) + ')',
            'background-size': 'auto ' + self.bgSize(size) + 'px',
            'width':  size + 'px',
            'height': size + 'px'
        }
    }
}
