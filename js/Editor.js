function Editor(map, palette, skin) {
    var self = this;

    var unscaledTileSize = 200;
    var nativeBgSize     = 1024;
    var extraBackgroundZoom = 2;
    var zoomRange           = [0.08, 0.8];

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

    var editorCenter = function() {
        var e = $('.editor');
        return $V([ e.width(), e.height() ]).x(1/2);
    }

    var centerPoint = function() {
        return viewportToVirtual(editorCenter());
    }

    self.centerOn = function(loc) {
        var curCenter = centerPoint();

        self.topLeft( self.topLeft().add( loc.subtract(curCenter).x(self.zoomFactor()) ) );
    }

    self.zoomIn = function() {
        var cp = centerPoint();
        self.zoomFactor(Math.min(self.zoomFactor() * 1.2, zoomRange[1]));
        self.centerOn(cp);
    }

    self.zoomOut = function() {
        var cp = centerPoint();
        self.zoomFactor(Math.max(self.zoomFactor() / 1.2, zoomRange[0]));
        self.centerOn(cp);
    }

    self.tileSize = function() {
        return unscaledTileSize * self.zoomFactor();
    }

    self.mapTiles = projectedArray(map.tiles, function(tile) {
        return { cssStyle: ko.computed(function() {
            var pxLoc = self.tileToPixel(tile.loc, true);
            var css = tile.tool.image(skin, self.tileSize(), true);
            css.position = 'absolute';
            css['left'] = pxLoc.e(1) + 'px';
            css['top']  = pxLoc.e(2) + 'px';
            return mkCss(css);
        })};
    });

    var viewportToVirtual = function(px) {
        return px.add(self.topLeft()).multiply(1 / self.zoomFactor());
    }

    var virtualToViewport = function(px) {
        return px.multiply(self.zoomFactor()).subtract(self.topLeft());
    }

    /**
     * Translate editor pixel coordinates to a tile index
     */
    self.pixelToTile = function(px) {
        var unscaledPx = viewportToVirtual(px);
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
        var r = virtualToViewport(unscaledPx);
        if (inInner) r = r.add(self.topLeft()); // We subtracted topLeft which we shouldn't have
        return r;
    }
}
