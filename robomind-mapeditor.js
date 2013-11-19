$(function() {
    var app = new App();

    // Load palette with default tools
    app.palette.addTool(new Tool('A', { shadow: true }));
    app.palette.addTool(new Tool('B', { shadow: true }));
    app.palette.addTool(new Tool('C', { shadow: true }));
    app.palette.addTool(new Tool('D', { shadow: true }));
    app.palette.addTool(new Tool('E', { shadow: true }));
    app.palette.addTool(new Tool('F', { shadow: true }));
    app.palette.addTool(new Tool('G', { shadow: true }));
    app.palette.addTool(new Tool('H', { shadow: true }));
    app.palette.addTool(new Tool('I', { shadow: true }));
    app.palette.addTool(new Tool('J'));
    app.palette.addTool(new Tool('K'));
    app.palette.addTool(new Tool('L'));
    app.palette.addTool(new Tool('M'));
    app.palette.addTool(new Tool('N'));
    app.palette.addTool(new Tool('O', { shadow: true, textureTiles: 27 }));
    app.palette.addTool(new Tool('P', { shadow: true }));
    app.palette.addTool(new Tool('Q', { shadow: true }));
    app.palette.addTool(new Tool('R', { textureTiles: 10 }));
    app.palette.addTool(new Tool('@'));
    app.palette.addTool(new Tool('*', { fileName: 'beacon' }));
    app.palette.addTool(new RemoveTool());
    app.palette.addTool(new Tool('w.', { fileName: 'strokeWhiteDot' }));
    app.palette.addTool(new Tool('b.', { fileName: 'strokeBlackDot' }));
    app.palette.addTool(new Tool('w-', { fileName: 'strokeWhiteRight', w: 2, layer: 1, shareLoc: [ 'w|', 'b|'] }));
    app.palette.addTool(new Tool('b-', { fileName: 'strokeBlackRight', w: 2, layer: 1, shareLoc: [ 'w|', 'b|']}));
    app.palette.addTool(new Tool('w|', { fileName: 'strokeWhiteDown',  h: 2, layer: 1, shareLoc: [ 'w-', 'b-']}));
    app.palette.addTool(new Tool('b|', { fileName: 'strokeBlackDown',  h: 2, layer: 1, shareLoc: [ 'w-', 'b-']}));
    app.palette.addTool(new Tool('disco', { fileName: 'extra-disco0',  textureTiles: 12, layer: 2 }));

    ko.applyBindings(app);

    app.mapFile.setFileControl(document.getElementById('loadMapFile'));

    // Load from hash fragment
    var loadState = function() {
        var h = window.location.hash.substr(1);
        if (h) app.mapFile.loadFromShareFragment(h);
    }
    $(window).on('hashchange', loadState);
    loadState();
});
