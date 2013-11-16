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
