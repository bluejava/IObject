/* global section, test, assert  */

(function(global, factory) {
    if(typeof define === "function" && define.amd) // eslint-disable-line no-undef
        define(["../IObject"], factory) // eslint-disable-line no-undef
    else if(typeof exports === "object")
        module.exports = factory(require("../IObject.js"))
    else
        throw Error("No module loader found")

    }(this, function(IObject) {

		function basicTests()
		{
			test("construction and identification", function() {

					var o = IObject()
					assert(o !== null)
					assert(o instanceof Object)
					assert.equal(o.constructor.name, "Object")
					assert.equal(o.constructor, Object)

				})

			test("set", function() {

					var o = IObject({a: 1, b: 2, c: 3, d: { a: { b: { c: 10 }}}})
					var o2 = o.set("a", 5).set("d.a.b.c", 50)
					var o3 = o2.set("a", 17).set("d.a.b.c", 22)
					assert.deepEqual(o, {a: 1, b: 2, c: 3, d: { a: { b: { c: 10 }}}}) // unchanged
					assert.deepEqual(o2, {a: 5, b: 2, c: 3, d: { a: { b: { c: 50 }}}}) // has changes
					assert.deepEqual(o3, {a: 17, b: 2, c: 3, d: { a: { b: { c: 22 }}}}) // again...
			})
		}

		function shallowImmutabilityTests()
		{
			test("first-level assign immutable", function() {

					var o = IObject({a: 1, b: 2, c: 3, d: { a: { b: { c: 10 }}}})
					o.a = 22
					o.b = 33
					o.c = 100
					assert.deepEqual(o, {a: 1, b: 2, c: 3, d: { a: { b: { c: 10 }}}}) // show that nothing has changed

				})
		}

		function deepImmutabilityTests()
		{
			test("first-level assign immutable", function() {

					var o = IObject({a: 1, b: 2, c: 3, d: { a: { b: { c: 10 }}}})
					o.d.a = 99
					assert.deepEqual(o, {a: 1, b: 2, c: 3, d: { a: { b: { c: 10 }}}}) // show that nothing has changed

				})
		}

		function noFreezeTests()
		{
			return section("Full Array Testing with No Freezing", function() {

					IObject.freeze = "NONE"

					basicTests()
				})
		}

		function shallowFreezeTests()
		{
			return section("Full Array Testing with Shallow Freezing", function() {

					IObject.freeze = "SHALLOW"

					basicTests()
					shallowImmutabilityTests()
				})
		}

		function deepFreezeTests()
		{
			return section("Full Array Testing with Deep Freezing", function() {

					IObject.freeze = "DEEP"

					basicTests()
					shallowImmutabilityTests()
					deepImmutabilityTests()
				})
		}

		noFreezeTests()
			.then(shallowFreezeTests)
			.then(deepFreezeTests)
}))
