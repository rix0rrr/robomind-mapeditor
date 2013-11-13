$(function() {
    var app = new App();

    // Load palette with default tools
    app.palette.addTool(new Tool('tile-@'));
    app.palette.addTool(new Tool('tile-A', true));
    app.palette.addTool(new Tool('tile-B', true));
    app.palette.addTool(new Tool('tile-C', true));
    app.palette.addTool(new Tool('tile-D', true));
    app.palette.addTool(new Tool('tile-E', true));
    app.palette.addTool(new Tool('tile-F', true));
    app.palette.addTool(new Tool('tile-G', true));
    app.palette.addTool(new Tool('tile-H', true));
    app.palette.addTool(new Tool('tile-I', true));
    app.palette.addTool(new Tool('tile-J'));
    app.palette.addTool(new Tool('tile-K'));
    app.palette.addTool(new Tool('tile-L'));
    app.palette.addTool(new Tool('tile-M'));
    app.palette.addTool(new Tool('tile-N', true));
    app.palette.addTool(new Tool('tile-O', true));
    app.palette.addTool(new Tool('tile-P', true));
    app.palette.addTool(new Tool('tile-Q', true));
    app.palette.addTool(new Tool('tile-R'));

    ko.applyBindings(app);
});
