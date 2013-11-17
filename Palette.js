function Palette(skin) {
    var self = this;

    self.tools = ko.observableArray();
    self.selectedTool = ko.observable();
    var toolIndex = {};

    var size = 50;

    self.addTool = function(tool) {
        if (!self.selectedTool()) self.selectedTool(tool);

        toolIndex[tool.id] = tool;
        self.tools.push(tool);
    }

    self.tool = function(id) {
        return toolIndex[id];
    }

    self.toolBtn = function(id) {
        var tool = self.tool(id);
        return {
            selected: self.selectedTool() === tool,
            select: function() {
                self.selectedTool(tool)
            },
            cssStyle: mkCss({
                background: skin.file(tool.id + '.png'),
                'background-size': 'auto ' + tool.bgSize(size) + 'px',
                'width': size + 'px',
                'height': size + 'px'
            })
        }
    };
}
