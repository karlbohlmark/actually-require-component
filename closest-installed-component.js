var fs = require("fs")
var path = require("path")

module.exports = closestInstalledComponent;

function closestInstalledComponent (dir, module) {
    var p
    while (dir != '/') {
        p = path.join(dir, "components", module, "component.json")
        if (fs.existsSync(p)) {
            return path.dirname(p);
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
      '/test/some/path/components': {
        'some-module': {
          'component.json': '{}'
        }
      }
    });
    var componentsPath = closestInstalledComponent('/test/some/path', 'some-module');
    mock.restore();
    assert(componentJsonPath == '/test/some/path/components/some-module',
           "components in root dir");

    mock({
      '/test/some/path': {},
      '/test/components/some-module': '{}'
    });

    componentsPath = closestInstalledComponent('/test/some/path', 'some-module');
    mock.restore();
    assert(componentJsonPath == '/test/components/some-module',
           "components in grand parent dir");
}