var fs = require("fs")
var path = require("path")

module.exports = resolveLocalDependency;

function resolveLocalDependency (dir, module) {
    var p, pa, modulePath

    /*
      find parent dir with component.json containing
      a paths
    */
    do {
        p = path.join(dir, "component.json")
        if (fs.existsSync(p)) {
            var json = read(p)
            var paths = json.paths
            if (paths) {
              for(var i = 0; i < paths.length; i++) {
                pa = paths[i];
                modulePath = path.join(dir, pa, module)
                if (fs.existsSync(modulePath)) {
                  return modulePath
                }
              }
            }
        }

        dir = path.dirname(dir);
    } while (dir != '/')
}


// Tests
if (!module.parent) {
    var assert = require('assert')
    var mock = require('mock-fs');
    mock({
      '/test/lib/my-local/component.json': '{"local":["schema"]}',
      '/test/lib/schema/component.json': '{"main": "schema.js"}',
      '/test/component.json': '{"paths": ["lib"]}'
    });
    var componentPath = resolveLocalDependency('/test/lib/my-local', 'schema');
    mock.restore();
    assert.equal(componentPath, '/test/lib/schema');

    // mock({
    //   '/test/some/path': {},
    //   '/test/components/some-module': '{}'
    // });

    // componentsPath = resolveLocalDependency('/test/some/path', 'some-module');
    // mock.restore();
    // assert(componentJsonPath == '/test/components/some-module',
    //        "components in grand parent dir");
}

function read (f) {
  return JSON.parse(fs.readFileSync(f).toString())
}