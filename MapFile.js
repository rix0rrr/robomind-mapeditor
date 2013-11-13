/**
 * .map file loader and writer
 */
function MapFile() {
    var self = this;

    self.fileApisAvailable = ko.observable(window.File && window.FileReader);

    self.setFileControl = function(fileControl) {
        self.fileControl = fileControl;
    }

    self.load = function(text) {
    }

    self.loadFromFile = function() {
        var files = self.fileControl.files;
        if (files.length == 0) {
            alert('Select a file first.');
            return;
        }

        var reader = new FileReader();
        reader.onload = function(theFile) {
            self.load(reader.result);
        };
        reader.readAsText(files[0]);
    };

    self.textArea = ko.observable('');
    self.loadFromText = function() {
        self.load(self.textArea());
    }
}
