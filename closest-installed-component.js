var fs = require("fs")
var path = require("path")
var semver = require("semver")

module.exports = closestInstalledComponent;

function closestInstalledComponent (dir, module) {
    var p
    do {
        p = path.join(dir, "components", module)
        if (fs.existsSync(p)) {
            var versions = fs.readdirSync(p);
            var maxVersion = versions.sort(semver.compare).pop()
            var modulePath = path.join(p, maxVersion);
            return modulePath
        } else {
            dir = path.dirname(dir);
        }
    } while (dir != '/')
}


// Tests
if (!module.parent) {
    var assert = require('assert')
    var mock = require('mock-fs');
    mock({
      '/test/some/path/components/namespace/some-module/0.0.1': {
          'component.json': '{}'
      }
    });
    var componentsPath = closestInstalledComponent('/test/some/path', 'namespace/some-module');
    mock.restore();
    assert.equal(componentsPath, '/test/some/path/components/namespace/some-module/0.0.1');

    // mock({
    //   '/test/some/path': {},
    //   '/test/components/namespace/some-module/0.0.1': '{}'
    // });

    // componentsPath = closestInstalledComponent('/test/some/path', 'namespace/some-module');
    // mock.restore();
    // assert(componentsPath == '/test/components/namespace/some-module/0.0.1',
    //        "components in grand parent dir");
}