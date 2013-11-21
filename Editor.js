function Editor(map, palette, skin) {
    var self = this;

    var unscaledTileSize = 200;
    var nativeBgSize   = 1024;
    var extraBackgroundZoom = 2;

    self.zoomFactor   = ko.observable(0.2);
    self.topLeft      = ko.observable($V([0, 0])); // After scaling
    self.editorHeight = ko.observable(500);

    self.outerCssStyle = ko.computed(function() {
        return mkCss({
            position: 'relative',
            overflow: 'hidden',
            height: self.editorHeight() + 'px',
            background: 'url(' + skin.file('bg.png') + ')',
            'background-size': (nativeBgSize * self.zoomFactor() * extraBackgroundZoom) + 'px',
            'background-position': -self.topLeft().e(1) + 'px ' + -self.topLeft().e(2) + 'px'
        });
    });

    self.innerCssStyle = ko.computed(function() {
        var tl = self.topLeft();
        return mkCss({
            position: 'absolute',
            left: -tl.e(1) + 'px',
            top:  -tl.e(2) + 'px'
        });
    });

    self.zoomIn = function() {
        self.zoomFactor(self.zoomFactor() * 1.2);
    }

    self.zoomOut = function() {
        self.zoomFactor(self.zoomFactor() / 1.2);
    }

    self.tileSize = function() {
        return unscaledTileSize * self.zoomFactor();
    }

    self.mapTiles = ko.computed(function() {
        return _(map.tiles()).map(function(tile) {
            var pxLoc = self.tileToPixel(tile.loc, true);

            var css = tile.tool.image(skin, self.tileSize(), true);
            css.position = 'absolute';
            css['left'] = pxLoc.e(1) + 'px';
            css['top']  = pxLoc.e(2) + 'px';

            return { cssStyle: mkCss(css) };
        });

    });

    /**
     * Translate editor pixel coordinates to a tile index
     */
    self.pixelToTile = function(px) {
        var unscaledPx = px.add(self.topLeft()).multiply(1 / self.zoomFactor());
        return $V([ 
                Math.floor(unscaledPx.e(1) / unscaledTileSize),
                Math.floor(unscaledPx.e(2) / unscaledTileSize)
                ]);
    }

    /**
     * Translate tile coords to pixel coords
     */
    self.tileToPixel = function(loc, inInner) {
        var unscaledPx = $V([
                loc.e(1) * unscaledTileSize,
                loc.e(2) * unscaledTileSize
                ]);
        var r = unscaledPx.multiply(self.zoomFactor());
        if (!inInner) r = r.subtract(self.topLeft());
        return r;
    }
}
