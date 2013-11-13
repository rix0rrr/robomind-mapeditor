function App() {
    var self = this;

    self.page = ko.observable('edit');

    self.skin      = ko.observable('grassSkin');
    self.skin.file = function(filename) {
        return 'url(skins/' + self.skin() + '/' + filename + ')';
    }

    self.map     = new Map();
    self.palette = new Palette(self.skin);
    self.editor  = new Editor(self.map, self.palette, self.skin);
    self.mapFile = new MapFile();

    // Apply the current tool to the location clicked in the editor
    $('.editor').click(function(e) {
        var tool = self.palette.selectedTool();
        if (!tool) return;

        var pixelLoc = $V([
            e.pageX - $(this).offset().left,
            e.pageY - $(this).offset().top
            ]);

        var tileLoc = self.editor.pixelToTile(pixelLoc);

        tool.click(self.map, tileLoc);
    });

    self.toEdit = function() { self.page('edit'); }
    self.toLoad = function() { self.page('load'); }
    self.toSave = function() { self.page('save'); }
}
