function Palette(skin) {
    var self = this;

    self.tools = ko.observableArray();
    self.selectedTool = ko.observable();

    var size = 50;

    self.toolsMenu = ko.computed(function() {
        return _(self.tools()).map(function(tool) {
            return {
                selected: self.selectedTool() === tool,
                select: function() {
                    self.selectedTool(tool)
                },
                cssStyle: mkCss({
                    background: skin.file(tool.id + '.png'),
                    'background-size': 'auto ' + size + 'px',
                    'width': size + 'px',
                    'height': size + 'px'
                })
            }
        });
    });

    self.addTool = function(tool) {
        self.tools.push(tool);
    }

    self.getTool = function(id) {
        return _(self.tools()).findWhere({ id: id });
    }
}
