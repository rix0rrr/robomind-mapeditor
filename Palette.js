function Palette(skin) {
    var self = this;

    self.tools = ko.observableArray();
    self.selectedTool = ko.observable();
    var toolIndex = {};

    var toolSize = 50;

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
            cssStyle: mkCss(tool.image(skin, toolSize, false))
        }
    };
}
