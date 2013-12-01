$(function() {
    var app = createRoboMindApp();
    
    ko.applyBindings(app);

    app.mapFile.setFileControl(document.getElementById('loadMapFile'));

    //----------------------------------------------------------------------
    // When mousewheel scroll distance exceeds a given distance, zoom
    (function() {
        var ZoomThreshold = 100;

        var d = 0;
        $('.editor').mousewheel(function(e) {
            d += e.deltaY * e.deltaFactor;

            while (d < -ZoomThreshold) {
                app.editor.zoomOut();
                d += ZoomThreshold;
            }

            while (d > ZoomThreshold) {
                app.editor.zoomIn();
                d -= ZoomThreshold;
            }

            return false;
        });
    }());

    //----------------------------------------------------------------------
    // Resize editor to fix screen vertically
    (function() {
        var update = function() {
            app.editor.editorHeight($(window).height() - $('.editor').offset().top - 20);
        }

        $(window).on('resize', update);
        update();
    }());

    //----------------------------------------------------------------------
    // Retain theme choice in localstorage
    if (window.localStorage) {
        var s = localStorage.getItem('skin');
        if (s) app.selectSkinByName(s);

        app.skin.subscribe(function(skin) {
            localStorage.setItem('skin', skin.value);
        });
    }

    //----------------------------------------------------------------------
    // Load from hash fragment
    var loadState = function() {
        var h = window.location.hash.substr(1);
        if (h) app.mapFile.loadFromShareFragment(h);
    }
    $(window).on('hashchange', loadState);
    loadState();
});
