function mkCss(map) {
    var ret = [];

    _(map).each(function(value, key) {
        ret.push(key + ': ' + value + ';');
    });

    return ret.join('\n');
}

/**
 * Return the index at which a value should be inserted to keep the list sorted
 */
function sortedIndex(list, newValue, comparator) {
    // Binary search
    var a = 0, b = list.length;

    // inv: list[a] <= newValue < b
    while (a < b) {
        var h = Math.floor((a + b) / 2);
        var r = comparator(list[h], newValue);
        if (r < 0)
            a = h + 1; // middle < newValue, so upper half
        else
            b = h;
    }

    return a;
}

/**
 * Invoke a function for every tile on a line between two points
 */
function tileLine(start, end, tileSize, fn) {
    var delta = end.subtract(start);

    var dX = delta.e(1), dY = delta.e(2);
    var adX = Math.abs(dX);
    var adY = Math.abs(dY);

    if (adX <= 0.0001 && adY <= 0.0001) return;

    if (adX > adY) {
        var alpha = dY / dX;
        for (var x = 0; x <= adX; x += tileSize) {
            fn(start.add($V([ x, x * alpha ])));
        }
    } else {
        var alpha = dX / dY;
        for (var y = 0; y <= adY; y += tileSize) {
            fn(start.add($V([ y * alpha, y ])));
        }
    }
}
