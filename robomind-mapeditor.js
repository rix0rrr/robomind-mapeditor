$(function() {
    var app = new App();

    // Load palette with default tools
    app.palette.addTool(new Tool('A', true));
    app.palette.addTool(new Tool('B', true));
    app.palette.addTool(new Tool('C', true));
    app.palette.addTool(new Tool('D', true));
    app.palette.addTool(new Tool('E', true));
    app.palette.addTool(new Tool('F', true));
    app.palette.addTool(new Tool('G', true));
    app.palette.addTool(new Tool('H', true));
    app.palette.addTool(new Tool('I', true));
    app.palette.addTool(new Tool('J'));
    app.palette.addTool(new Tool('K'));
    app.palette.addTool(new Tool('L'));
    app.palette.addTool(new Tool('M'));
    app.palette.addTool(new Tool('N', true));
    app.palette.addTool(new Tool('O', true));
    app.palette.addTool(new Tool('P', true));
    app.palette.addTool(new Tool('Q', true));
    app.palette.addTool(new Tool('R'));
    app.palette.addTool(new Tool('@'));
    app.palette.addTool(new Tool('*', false, 'beacon'));
    app.palette.addTool(new RemoveTool());

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
