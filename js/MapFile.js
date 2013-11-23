/**
 * .map file loader and writer
 */
function MapFile(map, palette) {
    var self = this;

    var lzma = new LZMA("bower_components/LZMA-JS/src/lzma_worker.js");
    var baseUrl = function() {
        return location.protocol+'//'+location.host+location.pathname;
    }

    self.fileApisAvailable = ko.observable(window.File && window.FileReader);
    self.saveRepresentation = ko.observable('');
    self.saveRepresentationEncoded = ko.observable('');
    self.shareURL = ko.observable('');

    self.setFileControl = function(fileControl) {
        self.fileControl = fileControl;
    }

    /**
     * Return the section starting with 'name:' from the set of lines
     */
    var getSection = function(lines, name) {
        var ret = [];

        var capturing = false;
        _(lines).each(function(line) {
            line = line.trimRight();
            if (line.trim().match(/^#/))
                /* skip */;
            else if (line.match(/:$/))
                capturing = line == name + ':';
            else if (capturing)
                ret.push(line);
        });

        return ret;
    }

    /**
     * Save current map representation to the saveRepresentation observable
     */
    self.save = function() {
        self.saveRepresentation(self.mapToText());
        self.saveRepresentationEncoded(encodeURIComponent(self.saveRepresentation()));
    }

    self.mapToText = function() {
        var ret = [];

        var tl = map.topLeft2D().to3D();

        ret.push('# This file was saved at ' + new Date());
        ret.push('# from ' + baseUrl());
        ret.push('');
        ret.push('extra:');
        ret = ret.concat(_(map.getTiles(ExtraLayer)).map(function(tile) {
            var relLoc = tile.loc.subtract(tl);
            return tile.tool.id + '@' + relLoc.e(1) + ',' + relLoc.e(2);
        }));
        ret.push('');
        ret.push('paint:');
        ret = ret.concat(_(map.getTiles(PaintLayer)).map(function(tile) {
            var relLoc = tile.loc.subtract(tl);
            return '(' + tile.id.substr(0, 1) + ',' + tile.id.substr(1, 1) + ',' + relLoc.e(1) + ',' + relLoc.e(2) + ')';
        }));
        ret.push('');
        ret.push('map:');
        ret = ret.concat(_(map.getTiles2D(TileLayer)).map(function(row) {
            return _(row).map(function(tile) {
                return tile ? tile.mapSymbol() : ' ';
            }).join('');
        }));

        return ret.join('\n');
    }

    /**
     * Load a map from text
     *
     * Add additional topleft offset
     */
    self.setMapFrom = function(text, topLeft) {
        topLeft = topLeft || $V([ 0, 0 ]);
        var lines = text.split('\n');
        var newTiles = [];

        var placeTool = function(id, x, y) {
            //console.log('Placing', id, 'at', x, ',', y);
            var tool = palette.tool(id);
            if (tool) newTiles.push(tool.toTile(map, $V([ x, y ]).add(topLeft)));
        }

        // Load regular map tiles
        var mapLines = getSection(lines, 'map');
        _(mapLines).each(function(line, y) {
            _(line).each(function(c, x) {
                placeTool(c, x, y);
            });
        });

        // Load paint
        var paints = getSection(lines, 'paint').join('');
        _(paints.split('(')).each(function(paint) {
            var m = /(w|b),(\.|-|\|),(\d+),(\d+)\)/.exec(paint);
            if (!m) return;

            var id = m[1] + m[2];
            var x = parseInt(m[3], 10);
            var y = parseInt(m[4], 10);

            placeTool(id, x, y);
        });

        // Load extras
        _(getSection(lines, 'extra')).each(function(extra) {
            var m = /(\w+)@(\d+),(\d+)/.exec(extra);
            if (!m) return;

            var id = m[1];
            var x = parseInt(m[2], 10);
            var y = parseInt(m[3], 10);

            placeTool(id, x, y);
        });

        map.replaceTiles(newTiles);
    }

    self.load = function(text) {
        self.setMapFrom(text);
        $(self).trigger('loaded');
    }

    self.loadFromFile = function() {
        var files = self.fileControl.files;
        if (files.length == 0) {
            alert('Select a file first.');
            return;
        }

        var reader = new FileReader();
        reader.onload = function(theFile) {
            self.load(reader.result);
        };
        reader.readAsText(files[0]);
    };

    self.textArea = ko.observable('');
    self.loadFromText = function() {
        if (self.textArea().trim()) {
            self.load(self.textArea().trim());
            self.textArea('');
        } else
            alert('Copy and paste the contents of a .map file here');
    }

    /**
     * Convert array to string, for interfacing with the LZMA library
     */
    var arrayToStr = function(arr) {
        var binary = '';
        var bytes  = new Uint8Array(arr);
        var len = bytes.byteLength;
        for (var i = 0; i < len; i++) {
            binary += String.fromCharCode(bytes[i]);
        }
        return binary;
    }

    /**
     * Convert string to array
     */
    var strToArray = function(str) {
        var bytes = [];
        var len = str.length;
        for (var i = 0; i < len; i++) {
            bytes.push(str.charCodeAt(i));
        }
        return bytes;
    }

    self.prepareShareURL = function() {
        self.shareURL('');
        lzma.compress(self.mapToText(), 1, function(compressed) {
            var blob = btoa(arrayToStr(compressed));
            self.shareURL(baseUrl() + '#' + blob);
        });
    }

    self.loadFromShareFragment = function(blob) {
        var compressed = atob(blob.trim());
        lzma.decompress(strToArray(compressed), function(txt) {
            if (txt) self.load(txt);
        });
    }

    self.copyShareURL = function() {
        window.prompt("Press Ctrl-C to copy the URL to your clipboard:", self.shareURL());
    }
}
