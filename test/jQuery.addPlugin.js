var test = require("unit.js"),
    assert = test.assert,
    common = require("./common.js");

describe("jQuery.addPlugin", function () {
    var window = common.getWindow(),
        jQuery = common.getjQuery(window),
        unique = jQuery("#unique");

    describe("Pre-flight checks", function () {
        it("jQuery.addPlugin should be a function", function() {
            test.function(jQuery.addPlugin);
        });

        it("jQuery('#unique') should contain a single item", function () {
            test.number(unique.length).is(1);
        });
    });

    describe("jQuery.addPlugin('testPlugin')", function () {
        it("should create jQuery.fn.testPlugin", function () {
            jQuery.addPlugin("testPlugin");
            test.function(jQuery.fn.testPlugin)
                .object(jQuery.fn.testPlugin.defaults)
                .function(jQuery.fn.testPlugin.updateDefaultsWith)
                .function(jQuery.fn.testPlugin.extendMembersWith)
                .function(jQuery.fn.testPlugin.cloneTo)
                .function(jQuery.fn.testPlugin.extendTo);
        });

        describe("jQuery('#unique').testPlugin()", function () {
            it("should instantiate testPlugin on #unique", function () {
                unique.testPlugin();
                test.object(unique.data("jquery-plugincreator-testPlugin"));
            });
        });

        describe("jQuery('#unique').testPlugin('destroy')", function () {
            it("should destroy testPlugin on #unique", function () {
                unique.testPlugin("destroy");
                test.undefined(unique.data("jquery-plugincreator-testPlugin"));
            });
        });
    });

    describe("jQuery.addPlugin('testPlugin', constructorFunction)", function () {
        it("should create jQuery.fn.testPlugin", function () {
            jQuery.addPlugin("testPlugin", function () {
                this.test = true;
            });
            test.function(jQuery.fn.testPlugin);
        });

        describe("jQuery('#unique').testPlugin()", function () {
            it("should instantiate testPlugin on #unique", function () {
                unique.testPlugin();
            });
            it("should call `constructorFunction` during instantiation", function () {
                test.object(unique.data("jquery-plugincreator-testPlugin"))
                    .hasProperty("test", true);
            });
            after(function () {
                unique.testPlugin("destroy");
            });
        });
    });

    describe("jQuery.addPlugin('testPlugin', null, defaults)", function () {
        it("should create jQuery.fn.testPlugin", function () {
            jQuery.addPlugin("testPlugin", null, {
                test: true
            });
            test.function(jQuery.fn.testPlugin);
        });

        describe("jQuery('#unique').testPlugin()", function () {
            it("should instantiate testPlugin on #unique", function () {
                unique.testPlugin();
            });
            it("should make `defaults` available to the instance via the `options` member created during instantiation", function () {
                var instance = unique.data("jquery-plugincreator-testPlugin");
                test.object(instance)
                    .hasProperty("options")
                    .object(instance.options)
                    .hasProperty("test", true);
            });
            after(function () {
                unique.testPlugin("destroy");
            });
        });
    });

    describe("jQuery.addPlugin('testPlugin', null, null, members)", function () {
        it("should create jQuery.fn.testPlugin", function () {
            jQuery.addPlugin("testPlugin", null, null, {
                testValue: true,
                testFunction1: function () {
                    this.testFunctionResult = true;
                },
                testFunction2: function (parameter) {
                    this.testFunctionResult = parameter;
                }
            });
            test.function(jQuery.fn.testPlugin);
        });

        describe("jQuery('#unique').testPlugin()", function () {
            it("should instantiate testPlugin on #unique", function () {
                unique.testPlugin();
            });
            it("should make `members` available to the instance via the prototype", function () {
                var instance = unique.data("jquery-plugincreator-testPlugin");
                test.object(instance)
                    .hasProperty("testValue", true)
                    .function(instance.testFunction1)
                    .function(instance.testFunction2);
            });
        });

        describe("jQuery('#unique').test('testFunction1')", function () {
            it("should set `testFunctionResult` on the instance to `true`", function () {
                var instance = unique.data("jquery-plugincreator-testPlugin");
                unique.testPlugin("testFunction1");
                test.object(instance)
                    .hasProperty("testFunctionResult", true);
            });
        });

        describe("jQuery('#unique').test('testFunction2', 'someValue')", function () {
            it("should set `testFunctionResult` on the instance to `someValue`", function () {
                var instance = unique.data("jquery-plugincreator-testPlugin");
                unique.testPlugin("testFunction2", "someValue");
                test.object(instance)
                    .hasProperty("testFunctionResult", "someValue");
            });
            after(function () {
                unique.testPlugin("destroy");
            });
        });
    });

    describe("jQuery.addPlugin('testPlugin', null, null, null, prototypeFunction)", function () {
        it("should create jQuery.fn.testPlugin", function () {
            jQuery.addPlugin("testPlugin", null, null, null, function () {
                this.testValue = true;
            });
        });

        describe("jQuery('#unique').testPlugin()", function () {
            it("should instantiate testPlugin on #unique", function () {
                unique.testPlugin();
            });
            it("should set `testValue` on the instance to `true` as a result executing the prototype function", function () {
                var instance = unique.data("jquery-plugincreator-testPlugin");
                test.object(instance)
                    .hasProperty("testValue", true);
            });
            after(function () {
                unique.testPlugin("destroy");
            });
        });
    });

    after(function () {
        window.close();
    });
});

