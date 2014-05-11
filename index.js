var fs = require("fs");
var path = require("path");
var Module = require("module")

var closestComponentJsonPath = require("./closest-component-json-path")
var closestInstalledComponent = require("./closest-installed-component")
var resolveLocalDependency = require("./resolve-local-dependency")
var fullComponentName = require("./full-component-name")

var _resolveFilename = Module._resolveFilename

function componentResolve (r, parent) {
    if (isRelative(r)) {
        return r;
    }
    
    var parentDir = path.dirname(parent.filename)
    var jsonPath = closestComponentJsonPath(parentDir)
    var componentsDir = path.join(path.dirname(jsonPath), "components")
    var json = read(jsonPath);
    var component = fullComponentName(r, json)
    if (!component) {
        if (isLocalComponent(r, json)) {
            return componentEntry(resolveLocalDependency(parentDir));
        }
    }
    var componentPath = closestInstalledComponent(parentDir, component)
    
    if (!componentPath) {
        throw Exception("Component not installed " + component)
    }
    
    return componentEntry(componentPath)
}

function componentEntry (componentPath) {
    var componentJson = readComponentJson(componentPath)
    var entry = path.join(componentPath, componentJson.main || "index.js")
    return entry
}

function readComponentJson(componentPath) {
    return read(path.join(componentPath, "component.json"))
}

function isLocalComponent (name, json) {
  var locals = json.local || json.locals || [];
  return locals.indexOf(name) != -1;
}

function isRelative (p) {
  return p[0] == '.'
}

function read(f) {
    return JSON.parse(fs.readFileSync(f).toString())
}

if (require.main != module) {
    // Patch _resoveFilename to try to resolve components first,
    // falling back to node modules.
    Module._resolveFilename = function(request, parent) {
      return componentResolve(request, parent) || _resolveFilename(request, parent)
    }
}

// Test
if (require.main === module) {
    var assert = require("better-assert")
    var mock = require('mock-fs');
    mock({
      '/test/some/path/component.json': '{"dependencies": {"karlbohlmark/my-module": "*"}}',
      '/test/some/path/components/karlbohlmark/my-module/component.json': '{"main": "start.js"}'
    });
    var parentModule = {
        filename: "/test/some/path/module.js"
    }
    var moduleEntryPath = componentResolve('my-module', parentModule);
    console.log("entry: ", moduleEntryPath)
    assert(moduleEntryPath, "/test/some/path/components/karlbohlmark/my-module/start.js");
    mock.restore()
}