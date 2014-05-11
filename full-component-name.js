module.exports = fullComponentName;

function fullComponentName (name, json) {
    return Object.keys(json.dependencies).filter(function (d) {
        return d.split('/')[1] == name
    }).pop();
}

// Tests
if (!module.parent) {
    var assert = require("assert");
    var json = {
        dependencies: {
            "component/emitter": "*"
        }
    }
    var fullName = fullComponentName("emitter", json);

    assert(fullName == "component/emitter")
}