# IObject

An Immutable Object that looks, behaves (and IS) a standard JavaScript `Object` but with immutable properties.

Upon creation from an existing object, all immediate (not from prototype) enumerable properties are transferred to the `IObject`.

For immutable arrays, see [IArray](https://github.com/bluejava/IArray)

## Why

One of the cornerstones of functional programming is immutable data structures. Using immutable data structures insures to the author and other programmers that once they have a handle to an object, it won't change beneath their feet. This is important for reasoning about code. It aids with testing, debugging and refactoring. It provides a much faster way to determine if state has changed. And it helps you write pure functions.

Native objects are an extremely popular data structure in most JavaScript programs. But they are far from immutable. One can simply assign values via `myObject.foo = 100`.

Some libraries exist that provide immutable objects, such as [Mori](http://swannodette.github.io/mori/) or [Immutable](https://facebook.github.io/immutable-js/) - but they are large opinionated libraries that expose a completely different API.

**IObject** provides an Immutable object only, and is very light.

```bash
wc -l IObject.js
103 IObject.js
```

103 lines in the *source* file, much of which is comments and the universal module definition. `IObject.min.js` is currently just **765** bytes.

## How

`IObject ` extends `Object` and adds the non-enumerable `set` function for setting values (top level and _deep_ values). Because of this approach, `IObject` appears and behaves just like an object literal with the exception of how you set values.

Note: By default the object does not block standard setting of values. You may set `IObject.freeze` to either `SHALLOW` or `DEEP` to block standard setting of values. 'SHALLOW' only blocks top-level setting of values, whereas `DEEP` freezes all objects at all levels within the `IObject`. It is recommended that you set `IObject.freeze` to `DEEP` during development to ensure you are not inadvertently setting object values directly. 

## API

`IObject` is a standard JavaScript `Object` and hence inherits all properties and methods of `Object`. In addition, it has a `set` function for setting top-level and deep values within the structure.

### constructor

Create a new `IObject` simply by calling the `IObject()` function. You may optionally use the `new` keyword, but it makes no difference. You may also pass in an initialization object, whose properties will be copied to the new `IObject`.

```javascript
var a = IObject()		// creates a new empty IObject
var b = new IObject()	// Same as above - just stylistic difference
var c = IObject({ a: 1, b: 2, c: 3}) // init IObject with these properties
var d = c.a + c.b + c.c		// d = 6
```

### `set(<String> name, value) => IObject`

Set the property indicated by `name` to `value`. The `name` is interpreted as a "dotted path" to allow the setting of "deep properties" within the `IObject`.

```javascript
IObject.freeze = "DEEP"		// disallow modifying IObject or anything inside
var a = IObject()			// create new empty IObject
console.log(a)				// { }
a.foo = "bar"				// does not effect a. still { }
```

Notice that setting values directly does not take effect. `IObject` is immutable and so does not allow changes. You must use `set` which returns a **new** `IObject` with the change in place:


```javascript
var a = IObject()			// create new empty IObject
var b = a.set("foo","bar")	// creates a NEW IObject with "foo" set to "bar"
console.log(a)				// a = { }
console.log(b)				// b = { "foo": "bar" }
```

Now lets looks at *deep* properties - i.e. properties not at the top level of the `IObject`, but properties on other objects that are stored within an `IObject`.

```javascript
var user = IObject({ id: 123, name: "glenn" }) // two top-level properties
user = user.set("address",  // setting object property for "address"
	{ street: "123 Main St.", city: "Yokohama", country: "Japan" })
	
// We access deep properties just as we would in a standard object
log(user.address.country)	// Japan

// But we set them via the set() call using dotted path string which returns
// the new IObject with the changed property
user = user.set("address.city", "Fujisawa")
log(user.address.city)	// Fujisawa
```

### License

See the LICENSE file for license rights and limitations (MIT).