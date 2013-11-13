function mkCss(map) {
    var ret = [];

    _(map).each(function(value, key) {
        ret.push(key + ': ' + value + ';');
    });

    return ret.join('\n');
}
