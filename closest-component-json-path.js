var fs = require("fs")
var path = require("path")

module.exports = closesComponentJsonPath;

function closesComponentJsonPath (dir) {
    var filename = "component.json"
    var p
    while (dir != '/') {
        p = path.join(dir, filename)
        if (fs.existsSync(p)) {
            return p;
        } else {
            dir = path.dirname(dir);
        }
    }
}

// Tests
if (!module.parent) {
    var assert = require('better-assert')
    var mock = require('mock-fs');
    mock({
      '/test/some/path': {
        'component.json': 'file content here',
      }
    });
    var componentJsonPath = closesComponentJsonPath('/test/some/path');
    mock.restore();
    assert(componentJsonPath == '/test/some/path/component.json',
           "component.json in root dir");

    mock({
      '/test/some/path': {},
      '/test/component.json': '{}'
    });

    componentJsonPath = closesComponentJsonPath('/test/some/path');
    mock.restore();
    assert(componentJsonPath == '/test/component.json',
           "component.json in grand parent dir");
}