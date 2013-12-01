function contains(actual, substring) {
    ok(actual.indexOf(substring) != -1, '"' + actual + '" does not contain "' + substring + '"');
}

function doesNotContain(actual, substring) {
    ok(actual.indexOf(substring) == -1, '"' + actual + '" should not contain "' + substring + '"');
}

test("Tiles image depends on skin", function() {
    var app = createRoboMindApp();
    app.palette.tool('A').click(app.map, $V([ 0, 0 ]));

    contains(app.editor.mapTiles()[0].cssStyle(), '/grassSkin/');

    app.selectSkinByName('legoSkin');

    doesNotContain(app.editor.mapTiles()[0].cssStyle(), '/grassSkin/');
    contains(app.editor.mapTiles()[0].cssStyle(), '/legoSkin/');
});

test("Tile size depends on zoomfactor", function() {
    var app = createRoboMindApp();
    app.palette.tool('A').click(app.map, $V([ 0, 0 ]));

    contains(app.editor.mapTiles()[0].cssStyle(), 'width: 45px;');

    app.editor.zoomFactor(0.8);

    doesNotContain(app.editor.mapTiles()[0].cssStyle(), 'width: 45px;');
});
