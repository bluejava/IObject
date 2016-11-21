/* global define */

/*
    This Universal Module Definition (UMD) handles AMD, CommonJS, and Eki module loaders.
    If none of those is detected, it defines IObject on the global context.
*/
(function(global, factory) {
    if(typeof define === "function" && define.amd)
        define(factory)
	else if(typeof eki === "object" && eki.def)
		eki.def("IObject", factory)
    else if(typeof exports === "object")
        module.exports = factory()
    else
        global.IObject = factory()
	}(this, function() {

	"use strict"

	/*
		set: <Object> ob -> <String> prop -> <ANY> val -> <IObject> result

		The set function takes an object ob and a property prop string into which a
		value is assigned. The property is parsed as dot-separated property names
		that can be traversed into the object. A new IObject object is returned
		with the new assignment. The original object is unchanged.

		i.e.
			if object = { person: { address: { street: "123 Main St."}} ...}
		then
			set(object, "person.address.street", "500 Wall St.")

		is the immutable equivalent to object.person.address.street = "500 Wall St."
	*/
	function set(ob, prop, val)
	{
		var o2 = createIObject(ob),
			co = o2,
			parts = prop.split(".")

		while(parts.length > 1)
		{
			var nextPart = parts.shift()
			co[nextPart] = Object.assign({}, co[nextPart])
			co = co[nextPart]
		}

		co[parts[0]] = val

		return deepFreeze(o2)
	}

	/*
		Return a frozen version of the object passed, based on the IObject.freeze switch.
		If IObject.freeze is set to "DEEP" the object is recursively frozen. If IObject.freeze
		is set to "SHALLOW" then only the first level of objects are frozen. Otherwise the
		object is not frozen.
	*/
	function deepFreeze(o)
	{
		if(IObject.freeze === "SHALLOW" || IObject.freeze === "DEEP")
		{
			Object.freeze(o)

			if(IObject.freeze === "DEEP")
				Object.getOwnPropertyNames(o)
					.forEach(function(n) {
							if((typeof o[n] === "object" || typeof o[n] === "function") && !Object.isFrozen(o[n]))
								deepFreeze(o[n])
						})
		}

		return o
	}

	/* Create a prototype for all IObject objects. This will contain the set method for cloning the
		object with a change. We define the set method as a non-enumerable property value on the
		prototype so that it doesn't appear when enumerating over the object */
	var IOProto = { }
	Object.defineProperty(IOProto, "set", {
		value: function(prop, val) {
				return set(this, prop, val)
			},
		enumerable: false })

	// Create a new IObject from the prototype and all the properties from the fromObject (if present)
	function createIObject(fromObject)
	{
		return Object.assign(
				Object.create(IOProto),
				fromObject
			)
	}

	// Our factory method takes an optional fromOb, creates a new IObject, deep freezes it and returns it.
	function IObject(fromOb)
	{
		return deepFreeze(createIObject(fromOb))
	}

	return IObject

}))
