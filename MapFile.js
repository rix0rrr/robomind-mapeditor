/**
 * .map file loader and writer
 */
function MapFile(map, palette) {
    var self = this;

    self.fileApisAvailable = ko.observable(window.File && window.FileReader);

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
            line = line.trim();
            if (line.match(/^#/))
                /* skip */;
            else if (line.match(/:$/))
                capturing = line == name + ':';
            else if (capturing)
                ret.push(line);
        });

        return ret;
    }

    self.load = function(text) {
        var lines = text.split('\n');

        map.clear();
        var mapLines = getSection(lines, 'map');
        _(mapLines).each(function(line, y) {
            _(line).each(function(c, x) {
                var tool = palette.getTool('tile-' + c);
                if (tool) tool.click(map, $V([ x, y ]));
            });
        });

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
