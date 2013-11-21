function App() {
    var self = this;

    self.page = ko.observable('edit');

    //--------------------------------------------------------------
    // SKINS
    self.skins = ko.observable([
            { text: 'Desert', value: 'dessertSkin' },
            { text: 'Grass',  value: 'grassSkin' },
            { text: 'LEGO',   value: 'legoSkin' }
    ]);
    self.skin  = ko.observable(self.skins()[1]);
    self.skin.file = function(filename) {
        return 'skins/' + self.skin().value + '/' + filename;
    }

    //--------------------------------------------------------------
    // ACTIONS
    self.leftMouseFunction  = ko.observable('paint');
    self.rightMouseFunction = ko.computed(function() {
        return self.leftMouseFunction() == 'paint' ? 'pan' : 'paint';
    });

    self.map     = new Map();
    self.palette = new Palette(self.skin);
    self.editor  = new Editor(self.map, self.palette, self.skin);
    self.mapFile = new MapFile(self.map, self.palette);

    var mouseActions = {
        paint: new PaintAction(self.palette, self.map, self.editor),
        pan: new PanAction(self.editor)
    };

    var mouseLocation = function(e) {
        var ofs = $('.editor').offset();
        return $V([ e.pageX - ofs.left, e.pageY - ofs.top ]);
    }

    var currentAction;

    $('.editor').mousedown(function(e) {
        var btn = $(e.target).closest('button');
        if (btn.length) return; // Ignore click if it was on a button

        var mouseAction = e.which == 1 ? self.leftMouseFunction() : self.rightMouseFunction();
        currentAction = mouseActions[mouseAction];

        currentAction.mouseDown(mouseLocation(e));

        e.preventDefault();
        return false;
    }).on('contextmenu', function(e) {
        return false;
    });

    $(document.body).mousemove(function(e) {
        if (!currentAction) return;
        currentAction.mouseMove(mouseLocation(e));
    }).mouseup(function(e) {
        if (!currentAction) return;
        currentAction = null;
    });
    //--------------------------------------------------------------
    $(self.mapFile).on('loaded', function() {
        self.editor.topLeft($V([0, 0]));
        self.toEdit();
    });

    self.toEdit = function() { self.page('edit'); }
    self.toLoad = function() { self.page('load'); }
    self.toSave = function() { 
        self.mapFile.save();
        self.page('save');
    }
    self.toShare = function() {
        self.page('share');
        self.mapFile.prepareShareURL();
    }


    self.paint = function() {
        self.leftMouseFunction('paint');
    }

    self.pan = function() {
        self.leftMouseFunction('pan');
    }
}

/**
 * Paint using the tool from the palette
 */
function PaintAction(palette, map, editor) {
    var lastPxLoc;

    this.mouseDown = function(pxLoc) {
        var tool = palette.selectedTool();
        if (!tool) return;

        lastPxLoc = pxLoc;
        tool.click(map, editor.pixelToTile(pxLoc));
    }

    this.mouseMove = function(pxLoc) {
        var tool = palette.selectedTool();
        if (!tool) return;

        tileLine(lastPxLoc, pxLoc, editor.tileSize(), function(loc) {
            tool.click(map, editor.pixelToTile(loc));
        });

        lastPxLoc = pxLoc;
    }
}

/**
 * Pan the map in the editor
 */
function PanAction(editor) {
    var startLoc;
    var startOrigin;

    this.mouseDown = function(loc) {
        startLoc    = loc;
        startOrigin = editor.topLeft();
    }

    this.mouseMove = function(loc) {
        editor.topLeft(startOrigin.subtract( loc.subtract(startLoc) ));
    }
}
