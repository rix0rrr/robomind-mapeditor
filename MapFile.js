/**
 * .map file loader and writer
 */
function MapFile(map, palette) {
    var self = this;

    self.fileApisAvailable = ko.observable(window.File && window.FileReader);
    self.saveRepresentation = ko.observable('');
    self.saveRepresentationEncoded = ko.observable('');

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
        self.saveRepresentation(mapToText());
        self.saveRepresentationEncoded(encodeURIComponent(self.saveRepresentation()));
    }

    var mapToText = function() {
        var ret = [];

        ret.push('map:');
        ret = ret.concat(_(map.getTiles()).map(function(row) {
            return _(row).map(function(tile) {
                return tile ? tile.mapSymbol() : ' ';
            }).join('');
        }));

        return ret.join('\n');
    }

    self.load = function(text) {
        var lines = text.split('\n');

        var newTiles = [];
        var mapLines = getSection(lines, 'map');
        _(mapLines).each(function(line, y) {
            _(line).each(function(c, x) {
                var tool = palette.getTool('tile-' + c);
                if (tool) newTiles.push(tool.toTile(map, $V([ x, y ])));
            });
        });
        map.replaceTiles(newTiles);

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
}
