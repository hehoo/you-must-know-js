# Object
JavaScript provides a native `Object` object, all objects are inherited from it. It is a constructor as well, so it can be used to create a new instance of object. 
```javascript
var obj = new Object();
```
For primitive value, the value will be wrapped as a wrapped object as returned object. 
```javascript
var o1 = {a: 1};
var o2 = new Object(o1);
o1 === o2 // true

new Object(123) instanceof Number
// true
```

## Object()
`Object` can be used as an utility method which is to convert any type of value to an object. 
```javascript
Object() // return an empty object
Object() instanceof Object // true

Object(undefined) // return an empty object
Object(undefined) instanceof Object // true

Object(null) // return an empty object
Object(null) instanceof Object // true

Object(1) // the same as new Number(1)
Object(1) instanceof Object // true
Object(1) instanceof Number // true

Object('foo') // the same as new String('foo')
Object('foo') instanceof Object // true
Object('foo') instanceof String // true

Object(true) // the same as new Boolean(true)
Object(true) instanceof Object // true
Object(true) instanceof Boolean // true
```
NOTE: If the argument is an object, then the original object will be returned directly. 
```javascript
var arr = [];
Object(arr) 
Object(arr) === arr // true

var obj = {};
Object(obj) /
Object(obj) === obj // true

var fn = function () {};
Object(fn) 
Object(fn) === fn // true
```
To utilize this point, it is very easy to write a function to check if an variable is an object or not. 
```javascript
function isObject(value) {
  return value === Object(value);
}

isObject([]) // true
isObject(true) // false
```

## Object static methods
### Object.keys(), Object.getOwnPropertyNames()
`Object.keys` and `Object.getOwnPropertyNames` are used to iterate object's properties. The difference is `Object.keys` only returns enumerable properties. 
```javascript
var a = ["Hello", "World"];

Object.keys(a)
// ["0", "1"]

Object.getOwnPropertyNames(a)
// ["0", "1", "length"]
```
Normally,  `Object.keys` is always be used. 

### Other methods
#### Property related methods
* Object.getOwnPropertyDescriptor()
* Object.defineProperty()
* Object.defineProperties()
* Object.getOwnPropertyNames()

### Object states related methods
* Object.preventExtensions()
* Object.isExtensible()
* Object.seal()
* Object.isSealed()
* Object.freeze()
* Object.isFrozen()

### prototype related methods
* Object.create()
* Object.getPrototypeOf()

## Object instance methods
### Object.prototype.valueOf()
By default, it always returns itself. 
```javascript
var o = new Object();
o.valueOf() === o // true
```
This method is very important and will be used during coercion. It will be discussed in detail in that chapter. 

### Object.prototype.toString()
`toString` method is the similar as `valueOf`, it will be called automatically during coercion according to some rules. This will be discussed in detail in coercion chapter. 

Array, String, function and Date objects deploy their own version of `toString` method to override `Object.prototype.toString`.
```javascript
[1, 2, 3].toString() // "1,2,3"

'123'.toString() // "123"

(function () {
  return 123;
}).toString()
// "function () {
//   return 123;
// }"

(new Date()).toString()
// "Tue May 10 2016 09:11:31 GMT+0800 (CST)"
```

As `Object.prototype.toString` returns a string to represent the type of object, so it can be used to check a type of value. 
```javascript
var o = {};
o.toString() // "[object Object]"
```
The returned value for `Object.prototype.toString` are:
* Number: [object Number]
* String: [object String]
* Boolean: [object Boolean]
* undefined: [object Undefined]
* null: [object Null]
* Array: [object Array]
* arguments object: [object Arguments]
* function: [object Function]
* Error: [object Error]
* Date: [object Date]
* RegExp: [object RegExp]
* others: [object Object]

Because of this, it is better idea to write a function to check the type of an value to replace `typeof`. 
```javascript
var type = function (o){
  var s = Object.prototype.toString.call(o);
  return s.match(/\[object (.*?)\]/)[1].toLowerCase();
};

type({}); // "object"
type([]); // "array"
type(5); // "number"
type(null); // "null"
type(); // "undefined"
type(/abcd/); // "regex"
type(new Date()); // "date"
```
Make it better: 
```javascript
['Null',
 'Undefined',
 'Object',
 'Array',
 'String',
 'Number',
 'Boolean',
 'Function',
 'RegExp',
 'NaN',
 'Infinite'
].forEach(function (t) {
  type['is' + t] = function (o) {
    return type(o) === t.toLowerCase();
  };
});

type.isObject({}) // true
type.isNumber(NaN) // true
type.isRegExp(/abc/) // true
```

# Property Descriptor Object
JavaScript provides an internal data structure to describe and control the behaviors of object's properties. This is called attributes object. 
Every property has its own attribute object which has property's meta information.

For instance:
```javascript
{
  value: 123,
  writable: false,
  enumerable: true,
  configurable: false,
  get: undefined,
  set: undefined
}
````
As it is seen that attribute object provides 6 meta properties: 
* value
the value of the property, default value: `undefined`.
* writable
the flag to indicate whether the value can be changed or not, default value: `true`
* enumerable
the flag to indicate whether the property can be iterated, default value: `true`
* configurable 
the flag to indicate whether the attribute object can be configured/changed, default value: `true`
* get
the getter function for getting the value of property, default value: `undefined`
* set
the setter function for setting the value of property, default value: `undefined`

## Object.getOwnPropertyDescriptor()
```javascript
var o = { p: 'a' };

Object.getOwnPropertyDescriptor(o, 'p')
// Object { value: "a",
//   writable: true,
//   enumerable: true,
//   configurable: true
// }
````

## Object.defineProperty(), Object.defineProperties()
`Object.defineProperty` is used to define/update attribute object for one property. 
```javascript
Object.defineProperty(object, propertyName, attributesObject)
````
for example: 
```javascript
var o = Object.defineProperty({}, 'p', {
  value: 123,
  writable: false,
  enumerable: true,
  configurable: false
});

o.p
// 123

o.p = 246;
o.p
// 123
// 因为writable为false，所以无法改变该属性的值
````
To define/update attribute objects for multiple properties, `Object.defineProperties` can be used. 
```javascript
var o = Object.defineProperties({}, {
  p1: { value: 123, enumerable: true },
  p2: { value: 'abc', enumerable: true },
  p3: { get: function () { return this.p1 + this.p2 },
    enumerable:true,
    configurable:true
  }
});

o.p1 // 123
o.p2 // "abc"
o.p3 // "123abc"
````

NOTE: once the `get` or `set` function is specified, it is not allowed to set `writable` to be `true`, or define the `value` property. 
```javascript
var o = {};

Object.defineProperty(o, 'p', {
  value: 123,
  get: function() { return 456; }
});
// TypeError: Invalid property.
// A property cannot both have accessors and be writable or have a value,
````

NOTE: the default value is `false` for `writable`, `configurable` and `enumerable` properties in `Object.defineProperty` and `Object.deflineProperties`. 
```javascript
var obj = {};
Object.defineProperty(obj, 'foo', { configurable: true });
Object.getOwnPropertyDescriptor(obj, 'foo')
// {
//   value: undefined,
//   writable: false,
//   enumerable: false,
//   configurable: true
// }
````

Consider the example:
```javascript
var o = {};

Object.defineProperty(o, 'p', {
  value: "bar"
});

o.p // bar

o.p = 'foobar';
o.p // bar

Object.defineProperty(o, 'p', {
  value: 'foobar',
});
// TypeError: Cannot redefine property: p (only in strict mode)
````
if `configurable` is `false`, it cannot neither be deleted or update the `attributes` object. 
```javascript
var o = {};

Object.defineProperty(o, 'p', {
  value: 'bar',
});

delete o.p
o.p // "bar"
````
If `enumerable` is `false`, the related properties cannot be iterated through `for...in` and `Object.keys` method. 
```javascript
var o = {
  p1: 10,
  p2: 13,
};

Object.defineProperty(o, 'p3', {
  value: 3,
});

for (var i in o) {
  console.log(i, o[i]);
}
// p1 10
// p2 13
````

## meta properties
### enumerable
If `enumerable` is `false`, the following actions cannot get that associated property.  
1. for...in loop
2. Object.keys
3. JSON.stringify

### configurable
In short, if `configurable` is `false`, then `value`, `writable`, `enumerable` and `configurable` cannot be updated. 
```javascript
var o = Object.defineProperty({}, 'p', {
  value: 1,
  writable: false,
  enumerable: false,
  configurable: false
});

Object.defineProperty(o,'p', {value: 2})
// TypeError: Cannot redefine property: p

Object.defineProperty(o,'p', {writable: true})
// TypeError: Cannot redefine property: p

Object.defineProperty(o,'p', {enumerable: true})
// TypeError: Cannot redefine property: p

Object.defineProperties(o,'p',{configurable: true})
// TypeError: Cannot redefine property: p
```
NOTE: when the variable is modified by `var` command, the `configurable` is `false`. 
```javascript
var a1 = 1;

Object.getOwnPropertyDescriptor(this,'a1')
// Object {
//  value: 1,
//  writable: true,
//  enumerable: true,
//  configurable: false
// }
```
But if the variable is defined by the way of property assignment, the `configurable` is `true`. 
```javascript
a2 = 1;

Object.getOwnPropertyDescriptor(this,'a2')
// Object {
//  value: 1,
//  writable: true,
//  enumerable: true,
//  configurable: true
// }

// OR

window.a3 = 1;

Object.getOwnPropertyDescriptor(window, 'a3')
// Object {
//  value: 1,
//  writable: true,
//  enumerable: true,
//  configurable: true
// }
```
This difference results in that the variable declared by `var` cannot be deleted by `delete` operator. 
```javascript
var a1 = 1;
a2 = 1;

delete a1 // false
delete a2 // true

a1 // 1
a2 // ReferenceError: a2 is not defined
```

### writable
```javascript
var o = {};

Object.defineProperty(o, 'a', {
  value: 37,
  writable: false
});

o.a // 37
o.a = 25;
o.a // 37
```

NOTE: 
1. only in 'strict mode' assigning new value to property can result an error, in normal mode, it will be failed quietly.
2. If the property's writable of original object is `false`, its extension object cannot modify the property as well. 
```javascript
var proto = Object.defineProperty({}, 'foo', {
  value: 'a',
  writable: false
});

var o = Object.create(proto);

o.foo = 'b';
o.foo // 'a'
```
An workaround can make it is to override the attribute object descriptor. 
```javascript
Object.defineProperty(o, 'foo', {
  value: 'b'
});

o.foo // 'b'
```

### Object.getOwnPropertyNames()
This method can return all properties' name no matter those properties are enumerable or not. 
```javascript
var o = Object.defineProperties({}, {
  p1: { value: 1, enumerable: true },
  p2: { value: 2, enumerable: false }
});

Object.getOwnPropertyNames(o)
// ["p1", "p2"]

// 
Object.keys([]) // []
Object.getOwnPropertyNames([]) // [ 'length' ]

// 
Object.keys(Object.prototype) // []
Object.getOwnPropertyNames(Object.prototype)
// ['hasOwnProperty',
//  'valueOf',
//  'constructor',
//  'toLocaleString',
//  'isPrototypeOf',
//  'propertyIsEnumerable',
//  'toString']
```

### Object.prototype.hasOwnProperty()
`hasOwnProperty` is to check if the given property is defined in the object itself or its prototype. 
```javascript
Date.hasOwnProperty('length')
// true

Date.hasOwnProperty('toString')
// false
````

### Object.prototype.propertyIsEnumerable()
This method is used to check whether a property is enumerable or not. 
```javascript
var o = {};
o.p = 123;

o.propertyIsEnumerable('p') // true
o.propertyIsEnumerable('toString') // false
```

### accessor
Besides defining the property directly, the property can also be defined by accessor - `setter` and `getter`. 

Accessor actually provides virtual property, the property does not exist. The value will be generated every time when accessing it. 

To utilize accessor, a lot of advanced features can be achieved. For example:
```javascript
var o = {
  get p() {
    return 'getter';
  },
  set p(value) {
    console.log('setter: ' + value);
  }
};
```
```javascript
o.p // "getter"
o.p = 123 // "setter: 123"
```

Another example to be used in most of scenarios: the property value depends on internal data value. 
```javascript
var o ={
  $n : 5,
  get next() { return this.$n++ },
  set next(n) {
    if (n >= this.$n) this.$n = n;
    else throw 'New value must bigger than current value';
  }
};

o.next // 5

o.next = 10;
o.next // 10
```
accessor can be defined by `Object.defineProperty` as well. 
```javascript
var d = new Date();

Object.defineProperty(d, 'month', {
  get: function () {
    return d.getMonth();
  },
  set: function (v) {
    d.setMonth(v);
  }
});
```
accessor can be defined in `Object.create` as well. 
```javascript
var o = Object.create(Object.prototype, {
  foo: {
    get: function () {
      return 'getter';
    },
    set: function (value) {
      console.log('setter: '+value);
    }
  }
});
```

An useful example of binding between object and DOM. 
```javascript
Object.defineProperty(user, 'name', {
  get: function () {
    return document.getElementById('foo').value;
  },
  set: function (newValue) {
    document.getElementById('foo').value = newValue;
  },
  configurable: true
});
```

### copying of object
There is no native method in JavaScript to copy an object to another. You have to write it by your own(to utilize `Object.defineProperty` and `Object.getOwnPropertyDescriptor`).
```javascript
var extend = function (to, from) {
  for (var property in from) {
    var descriptor = Object.getOwnPropertyDescriptor(from, property);

    if (descriptor && ( !descriptor.writable
      || !descriptor.configurable
      || !descriptor.enumerable
      || descriptor.get
      || descriptor.set)) {
      Object.defineProperty(to, property, descriptor);
    } else {
      to[property] = from[property];
    }
  }
}
```

To clone an object, you have to do two things:
1. Make sure the new object has the same prototype as original object. 
2. Make sure the new object has same properties. 
```javascript
function copyObject(orig) {
  var copy = Object.create(Object.getPrototypeOf(orig));
  copyOwnPropertiesFrom(copy, orig);
  return copy;
}

function copyOwnPropertiesFrom(target, source) {
  Object
  .getOwnPropertyNames(source)
  .forEach(function(propKey) {
    var desc = Object.getOwnPropertyDescriptor(source, propKey);
    Object.defineProperty(target, propKey, desc);
  });
  return target;
}
````


### controlling object's states
#### Object.preventExtensions() & Object.isExtensible()
To prevent from adding new properties to an object. 
```javascript
var o = new Object();

Object.preventExtensions(o);

Object.defineProperty(o, 'p', {
  value: 'hello'
});
// TypeError: Cannot define property:p, object is not extensible.

o.p = 1;
o.p // undefined
```
Even though new properties cannot be added, deletion on then are allowed. 
```javascript
var o = new Object();
o.p = 1;

Object.preventExtensions(o);

delete o.p;
o.p // undefined
```

`Object.isExtensible()` can be used to check whether the object can add new properties. 
```javascript
var o = new Object();

Object.isExtensible(o) // true
Object.preventExtensions(o);
Object.isExtensible(o) // false
```
#### Object.seal() & Object.isSealed()
`Object.seal()` can make an object not able to add new properties as well as delete existing old properties. 
```javascript
var o = {
  p: 'hello'
};

Object.seal(o);

delete o.p;
o.p // "hello"

o.x = 'world';
o.x // undefined
```

Under the hood, the implementation of `Object.seal` is actually setting the configurable to be `false`, thus the attribute object descriptor cannot be modifed as well. 
for `writable`, it can be changed from `true` to `false`, but cannot be changed from `false` to `true` after calling `Object.seal` on the object. 

See an example how to use `Object.isSealed`. 
```javascript
var o = { p: 'a' };

Object.seal(o);
Object.isSealed(o); // true
Object.isExtensible(o) // false
````

#### Object.freeze() & Object.isFrozen()
`Object.freeze` can make the object not able to add and delete properties as well as not able to change the properties values in order to make the object to be a constant. 
```javascript
var o = {
  p: 'hello'
};

Object.freeze(o);

o.p = 'world';
o.p // hello

o.t = 'hello';
o.t // undefined
```

To check whether the object is frozen, use `Object.isFrozen`. 
```javascript
var o = {
  p: 'hello'
};

Object.freeze(o);
Object.isFrozen(o) // true
```

#### Limitations
To use the methods mentioned above, there are some limitations:
1. It is also possible to add properties to prototype object even though the original object is locked. 

```javascript
var o = new Object();
Object.preventExtensions(o);

var proto = Object.getPrototypeOf(o);
proto.t = "hello";
o.t // hello
```

A solution is to freeze its prototype at the same time. 

```javascript
var o = Object.seal(
  Object.create(
    Object.freeze({x: 1}),
    {
      y: {
        value: 2,
        writable: true
      }
    }
  )
);

Object.getPrototypeOf(o).t = "hello";
o.hello // undefined
```
2. If the value of property is also an object, it is not able to freeze the object content, but only the object reference. 

```javascript
var obj = {
  foo: 1,
  bar: ['a', 'b']
};
Object.freeze(obj);

obj.bar.push('c');
obj.bar // ["a", "b", "c"]
```



# Object constructor and new operator
## Constructor
Object Oriented Programming is very popular and is one of programming paradigm. The traditional OOP languages are C++ and Java, which use 'Class' concept to construct object. 
But in JavaScript, it is not based on 'Class', but constructor and prototype. 
JavaScript uses constructor as the template of the object. Constructor is a function to generate/produce object. One constructor can generate/produce multiple objects that have same structure. 

See an example:
```javascript
var Vehicle = function () {
  this.price = 1000;
};
```
The Vehicle is a constructor, it provides a template to generate/produce an instance of object. Normally, the first character is upper case by convention.  

A constructor usually:
1. `this` is used inside the constructor function to represent the instance of object
2. to generate/produce an object, you have to use `new` operator to call the constructor function. 

## new operator
The purpose of `new` operator is to invoke the function and return an instance of object. 
```javascript
var Vehicle = function (){
  this.price = 1000;
};

var v = new Vehicle();
v.price // 1000
```

If calling the function directly instead of calling it by `new` operator, what would happen? 
```javascript
ar Vehicle = function (){
  this.price = 1000;
};

var v = Vehicle();
v.price
// Uncaught TypeError: Cannot read property 'price' of undefined

price
// 1000
```
the `this` points to global object and the `price` becomes a global property. 

How to avoid it? An easy way is to use `use strict` inside the function. 
```javascript
function Fubar(foo, bar){
  'use strict';
  this._foo = foo;
  this._bar = bar;
}

Fubar()
// TypeError: Cannot set property '_foo' of undefined
```
As in the strict mode, the this inside the function cannot point to the global object, the `this` is undefined by default. 
Another solution is to make a check inside the function to make sure the function is called by `new` operator. if it is not, returning an instance of object directly. 
```javascript
function Fubar(foo, bar){
  if (!(this instanceof Fubar)) {
    return new Fubar(foo, bar);
  }

  this._foo = foo;
  this._bar = bar;
}

Fubar(1, 2)._foo // 1
(new Fubar(1, 2))._foo // 1
```

## What `new` operator does
When using `new` operator to invoke a function, it is not like the normal invocation of function, but calling the function following the steps below:

1. Create an empty object as returned instance of object. 
2. Make this empty object's prototype pointing to constructor's prototype.
3. Assign this empty object to `this`.
4. Initial execute this constructor function. 

NOTE: if there is an object following `return`, the `new` operator would return that object rather than the this, otherwise returning the `this`. 
```javascript
var Vehicle = function () {
  this.price = 1000;
  return 1000;
};

(new Vehicle()) === 1000
// false
```

```javascript
var Vehicle = function (){
  this.price = 1000;
  return { price: 2000 };
};

(new Vehicle()).price
// 2000
```

For normal function(not constructor function), if it is called by `new`, then it will return an empty object if the function does not return an object. 
```javascript
function getMessage() {
  return 'this is a message';
}

var msg = new getMessage();

msg // {}
typeof msg // "Object"
```

Below code can tell the way how the `new` works like above mentioned:
```javascript
function _new( constructor, param1) {
  var args = [].slice.call(arguments);
  var constructor = args.shift();
  var context = Object.create(constructor.prototype);
  var result = constructor.apply(context, args);
  return (typeof result === 'object' && result != null) ? result : context;
}

// 
var actor = _new(Person, '张三', 28);
```

## new.target
`new.target` is pointing to the constructor if the function is called by `new` operator.
```javascript
function f() {
  console.log(new.target === f);
}

f() // false
new f() // true
```

# Prototype object
As already mentioned above, JavaScript's OOP is based on `prototype` rather than `class`. There are many difference between JavaScript and traditional OOP languages. 

## The constructor's disadvantage
Taking an example below:
```javascript
function Cat(name, color) {
  this.name = name;
  this.color = color;
  this.meow = function () {
    console.log('mew, mew, mew...');
  };
}

var cat1 = new Cat('大毛', '白色');
var cat2 = new Cat('二毛', '黑色');

cat1.meow === cat2.meow
// false
```
As you can see above, the function meow is different in different instance, which is a kind of waste, as the behavior of meow is the same among all instances. The function meow should be shared among them. 

## Prototype property
Every object in JavaScript inherited from another object, which is called `prototype` object. Except `null` as it has no `prototype` object. 
All properties and methods in `prototype` object can be shared by its child objects. This is the essential mechanism of inheriting  in JavaScript.

The object created by `new` constructor will be assigned a prototype object automatically. Every constructor function has a `prototype` property and this property is the prototype object of instance object. 
```javascript
function Animal (name) {
  this.name = name;
}

Animal.prototype.color = 'white';

var cat1 = new Animal('大毛');
var cat2 = new Animal('二毛');

cat1.color // 'white'
cat2.color // 'white'
```

Because all objects have their own constructor function, all constructor/functions have their own `prototype` property, thus all objects have their own prototype object. 

## prototype chain
As prototype is also an object which has its own `prototype`, so it can form a prototype chain. All prototype chain will end with `Object.prototype`. You would ask what's the prototype of `Object.prototype`? 
The answer is `null` which has no property and method. `null` has no prototype. 

When reading a property, JavaScript engine would try to find the property from the object itself, if not found, find it from its prototype, if not found again, go to prototype's prototype to find it util end the finding at `Object.prototype`. If not foud still, return `undefined`. 

NOTE: it takes time to find properties in prototype chain, so it impacts performance. 

See an example:
```javascript
var MyArray = function () {};

MyArray.prototype = new Array();
MyArray.prototype.constructor = MyArray;

var mine = new MyArray();
mine.push(1, 2, 3);

mine.length // 3
mine instanceof Array // true
```

## setting & shadowing properties
Consider the code below, you would think that it is too simple and just set a property to an object. But it is more complex than that you can imagine. 
```javascript
myObject.foo = "bar";
````

If the myObject object already has a normal data accessor property called foo directly present on it, the assignment is as simple as changing the value of the existing property.

If foo is not already present directly on myObject, the [[Prototype]] chain is traversed, just like for the [[Get]] operation. If foo is not found anywhere in the chain, the property foo is added directly to myObject with the specified value, as expected.

However, if foo is already present somewhere higher in the chain, nuanced (and perhaps surprising) behavior can occur with the myObject.foo = "bar" assignment. We'll examine that more in just a moment.

If the property name foo ends up both on myObject itself and at a higher level of the [[Prototype]] chain that starts at myObject, this is called shadowing. The foo property directly on myObject shadows any foo property which appears higher in the chain, because the myObject.foo look-up would always find the foo property that's lowest in the chain.

As we just hinted, shadowing foo on myObject is not as simple as it may seem. We will now examine three scenarios for the myObject.foo = "bar" assignment when foo is not already on myObject directly, but is at a higher level of myObject's [[Prototype]] chain:

1. If a normal data accessor (see Chapter 3) property named foo is found anywhere higher on the [[Prototype]] chain, and it's not marked as read-only (writable:false) then a new property called foo is added directly to myObject, resulting in a shadowed property.
2. If a foo is found higher on the [[Prototype]] chain, but it's marked as read-only (writable:false), then both the setting of that existing property as well as the creation of the shadowed property on myObject are disallowed. If the code is running in strict mode, an error will be thrown. Otherwise, the setting of the property value will silently be ignored. Either way, no shadowing occurs.
3. If a foo is found higher on the [[Prototype]] chain and it's a setter (see Chapter 3), then the setter will always be called. No foo will be added to (aka, shadowed on) myObject, nor will the foo setter be redefined.

Most developers assume that assignment of a property ([[Put]]) will always result in shadowing if the property already exists higher on the [[Prototype]] chain, but as you can see, that's only true in one (#1) of the three situations just described.

If you want to shadow foo in cases #2 and #3, you cannot use = assignment, but must instead use Object.defineProperty(..) (see Chapter 3) to add foo to myObject.

Note: Case #2 may be the most surprising of the three. The presence of a read-only property prevents a property of the same name being implicitly created (shadowed) at a lower level of a [[Prototype]] chain. The reason for this restriction is primarily to reinforce the illusion of class-inherited properties. If you think of the foo at a higher level of the chain as having been inherited (copied down) to myObject, then it makes sense to enforce the non-writable nature of that foo property on myObject. If you however separate the illusion from the fact, and recognize that no such inheritance copying actually occurred (see Chapters 4 and 5), it's a little unnatural that myObject would be prevented from having a foo property just because some other object had a non-writable foo on it. It's even stranger that this restriction only applies to = assignment, but is not enforced when using Object.defineProperty(..).

Shadowing with methods leads to ugly explicit pseudo-polymorphism (see Chapter 4) if you need to delegate between them. Usually, shadowing is more complicated and nuanced than it's worth, so you should try to avoid it if possible
```javascript
var anotherObject = {
	a: 2
};

var myObject = Object.create( anotherObject );

anotherObject.a; // 2
myObject.a; // 2

anotherObject.hasOwnProperty( "a" ); // true
myObject.hasOwnProperty( "a" ); // false

myObject.a++; // oops, implicit shadowing! myObject.a++ works as myObject.a = myObject.a + 1;

anotherObject.a; // 2
myObject.a; // 3

myObject.hasOwnProperty( "a" ); // true
````

## the constructor property
`prototype` object has a property called `constructor` that points to the `prototype` object's constructor function. 

```javascript
function P() {}

P.prototype.constructor === P
// true
```

As `constructor` is in `prototype` object, so it can be inherited/got from instance object. 

```javascript
function P() {}
var p = new P();

p.constructor
// function P() {}

p.constructor === P.prototype.constructor
// true

p.hasOwnProperty('constructor')
// false
```

With `constructor` property, it is able to create another instance from instance object. 
```javascript
function Constr() {}
var x = new Constr();

var y = new x.constructor();
y instanceof Constr // true
```
Some more useful application by using `constructor`.

```javascript
Constr.prototype.createCopy = function () {
  return new this.constructor();
};
```

One inheriting pattern can be made by this:
```javascript
function Super() {}

function Sub() {
  Sub.superclass.constructor.call(this);
}

Sub.superclass = new Super();
```

As `constructor` has the relation between `prototype` object and its `constructor` function. So you must be careful if you need to change the `prototype` of an object.
 
```javascript
function A() {}
var a = new A();
a instanceof A // true

function B() {}
A.prototype = B.prototype;
a instanceof A // false
```

```javascript
// Please avoid doing this
C.prototype = {
  method1: function (...) { ... },
  // ...
};

// better way
C.prototype = {
  constructor: C,
  method1: function (...) { ... },
  // ...
};

// best way   
C.prototype.method1 = function (...) { ... };
```

## instanceof operator
`instanceof` is used to check an object whether it is created by a constructor function. 
```javascript
var v = new Vehicle();
v instanceof Vehicle // true
```

```javascript
v instanceof Vehicle
// the same as
Vehicle.prototype.isPrototypeOf(v)
```

As `instanceof` is for the entire prototype chain. So:
```javascript
var d = new Date();
d instanceof Date // true
d instanceof Object // true
```

And for the object which has no `prototype`, `instanceof` would return false. 
```javascript
Object.create(null) instanceof Object // false
```

`instanceof` cannot be used for primitive value. 
```javascript
var s = 'hello';
s instanceof String // false
```

## Object.getPrototypeOf()
`Object.getPrototypeOf` is to return a prototype of an object. 
```javascript
// 空对象的原型是Object.prototype
Object.getPrototypeOf({}) === Object.prototype
// true

// 函数的原型是Function.prototype
function f() {}
Object.getPrototypeOf(f) === Function.prototype
// true

// f 为 F 的实例对象，则 f 的原型是 F.prototype
var f = new F();
Object.getPrototypeOf(f) === F.prototype
// true
```

## Object.setPrototypeOf()
`Object.setPrototypeOf` is to set a prototype for existing object and return a new object. 
It accepts two arguments, first argument is original object to be set, the second one is prototype object. 
```javascript
var a = {x: 1};
var b = Object.setPrototypeOf({}, a);
// the same as
// var b = {__proto__: a};

b.x // 1
```

`new` operator to create an instance is actually to set prototype of instance object to constructor's prototype. 
```javascript
var F = function () {
  this.foo = 'bar';
};

var f = new F();

// the same as
var f = Object.setPrototypeOf({}, F.prototype);
F.call(f);
```

## Object.create()
`Object.create` is to create a new object from given prototype object in order to replace `new` operator. 
```javascript
var A = {
 print: function () {
   console.log('hello');
 }
};

var B = Object.create(A);

B.print() // hello
B.print === A.print // true
```
It is the same as: 
```javascript
var A = function () {};
A.prototype = {
 print: function () {
   console.log('hello');
 }
};

var B = new A();

B.print === A.prototype.print // true
```
Actually the implementation of `Object.create` is similar like below:
```javascript
if (typeof Object.create !== 'function') {
  Object.create = function (o) {
    function F() {}
    F.prototype = o;
    return new F();
  };
}
```
To create an object which does not inherit any property, it can do pass `null` argument to `Object.create`.
```javascript
var o = Object.create(null);

o.valueOf()
// TypeError: Object [object Object] has no method 'valueOf'
```
If prototype object is changed, the created object inherited from prototype object would reflect the change as well. 
```javascript
var o1 = { p: 1 };
var o2 = Object.create(o1);

o1.p = 2;
o2.p
// 2
```

The second argument of `Object.create` is to accept an attribute object descriptor that will be added into the new object. 
```javascript
var o = Object.create({}, {
  p1: {
    value: 123,
    enumerable: true,
    configurable: true,
    writable: true,
  },
  p2: {
    value: 'abc',
    enumerable: true,
    configurable: true,
    writable: true,
  }
});

// the same as
var o = Object.create({});
o.p1 = 123;
o.p2 = 'abc';
```

The object created by `Object.create` also inherit its prototype's constructor. 
```javascript
function A() {}
var a = new A();
var b = Object.create(a);

b.constructor === A // true
b instanceof A // true
```






## Object.prototype.isPrototypeOf()
`isPrototypeOf` is to check if an object is another object's prototype. 
```javascript
var o1 = {};
var o2 = Object.create(o1);
var o3 = Object.create(o2);

o2.isPrototypeOf(o3) // true
o1.isPrototypeOf(o3) // true
```
See more example:
```javascript
Object.prototype.isPrototypeOf({}) // true
Object.prototype.isPrototypeOf([]) // true
Object.prototype.isPrototypeOf(/xyz/) // true
Object.prototype.isPrototypeOf(Object.create(null)) // false
```
As `Object.prototype` is the top of the prototype chain, as all checks return true except `Object.create(null)` as it has not prototype. 

## Object.prototype.__proto__
`__proto__` property can used to change object's prototype. 
```javascript
var obj = {};
var p = {};

obj.__proto__ = p;
Object.getPrototypeOf(obj) === p // true
```
per standard, `__proto__` is an internal property and only needs to be deploy in browser, thus in other environment, it may not have this property. So you should try avoid using it, but `Object.getPrototypeOf` and `Object.setPrototpeOf`. 

## the ways to get prototype object
There are three ways to get prototype object from an object:
* obj.__proto__
* obj.constructor.prototype
* Object.getPrototypeOf(obj)

Above three ways, the first two are not reliable as per ES6 standard, `__proto__` only needs to be deployed in browser, not mandatory for other environments. for `obj.constructor.prototype`, if the prototype object was changed manually, it may fail to get correct prototype. 
```javascript
var P = function () {};
var p = new P();

var C = function () {};
C.prototype = p;
var c = new C();

c.constructor.prototype === p // false
```
To correct it, you have to change the constructor as well during changing the prototype. 
```javascript
C.prototype = p;
C.prototype.constructor = C;

c.constructor.prototype === p // true
```

All in all, the best way is to use `Object.getPrototypeOf` to get prototype object. 
```javascript
var o = new Object();
Object.getPrototypeOf(o) === Object.prototype
// true
```

## in operator and for...in loop
`in` operator is to check if property belongs to the object or its prototype chain.  
 Similarly, `for...in` can get all own and inherited properties which are *enumerable* from an object. In order to get own properties, `hasOwnProperty` can be use for filtering. 
 But as you may have already known that the best way is to use `Object.keys()`. 
 
 To get all own and inherited properties including non-enumerable ones, the following code can do that:
 ```javascript
 function inheritedPropertyNames(obj) {
   var props = {};
   while(obj) {
     Object.getOwnPropertyNames(obj).forEach(function(p) {
       props[p] = true;
     });
     obj = Object.getPrototypeOf(obj);
   }
   return Object.getOwnPropertyNames(props);
 }
 ````
 
# OOP pattern in JavaScript
## Constructor Inheriting
Two steps to achieve constructor inheriting: 
1. Call super constructor in sub constructor to make sub has all super properties
```javacript
function Sub(value) {
  Super.call(this);
  this.prop = value;
}
```

2. Make sub's prototype point to super's prototype so that sub inherits from super's prototype
```javascript
Sub.prototype = Object.create(Super.prototype);
Sub.prototype.constructor = Sub;
Sub.prototype.method = '...';
````
Alternatively, you can do:
```javascript
Sub.prototype = new Super();
````
The above way has a side effect is that the sub would have properties which are from super's instance object. Sometime, it may not be needed for purpose. So the first option is suggested. 

See a complete example:
```javascript
function Shape() {
  this.x = 0;
  this.y = 0;
}

Shape.prototype.move = function (x, y) {
  this.x += x;
  this.y += y;
  console.info('Shape moved.');
};


function Rectangle() {
  Shape.call(this); //1. call super constructor function
}


// sub inherits from super's prototype
Rectangle.prototype = Object.create(Shape.prototype);
Rectangle.prototype.constructor = Rectangle;
````

## Multiple Inheritance
JavaScript does not support multiple inheritance, but some tricky methods can be used to achieve it. 
```javascript
function M1() {
  this.hello = 'hello';
}

function M2() {
  this.world = 'world';
}

function S() {
  M1.call(this);
  M2.call(this);
}
S.prototype = M1.prototype;

var s = new S();
s.hello // 'hello'
s.world // 'world'
````

## Module in JavaScript (prior to ES6)
Usually IIFE is used to encapsulate private variables in order to create "module". 
```javascript
var module1 = (function () {
　var _count = 0;
　var m1 = function () {
　  //...
　};
　var m2 = function () {
　　//...
　};
　return {
　　m1 : m1,
　　m2 : m2
　};
})();
````

### augmentation of module
```javascript
var module1 = (function (mod){
　mod.m3 = function () {
　　//...
　};
　return mod;
})(module1);
````
Loose augmentation:
```javascript
var module1 = ( function (mod){
　//...
　return mod;
})(window.module1 || {});
````

### passing global variables
```javascript
var module1 = (function ($, YAHOO) {
　//...
})(jQuery, YAHOO);
````
Example:
```javascript
(function($, window, document) {

  function go(num) {
  }

  function handleEvents() {
  }

  function initialize() {
  }

  function dieCarouselDie() {
  }

  //attach to the global scope
  window.finalCarousel = {
    init : initialize,
    destroy : dieCouraselDie
  }

})( jQuery, window, document );
````

# Class (since ES6)

ES6's `class` is a controversial topic as there are a lot of arguments/discusses in JavaScript community. 
To be honest, I cannot tell you who is right, who is wrong, but want to list all facts and features in this section. You should judge it by yourself. 

What advantages ES6 `class` brings to us:
1. syntax looking nicer
2. there is no more references to `.prototype` cluttering the code. (but not very true:))
3. `extends` to be used for "inherit from", instead of needing to use `Object.create()` to replace a `.prototype` object that's linked, or having to set with `__proto__` or `Object.setPrototypeOf(...)`.
4. `super()` now gives us a very helpful relative polymorphism capability, so that any method at one level of the chain can refer relatively one level up the chain to a method of the same name. 
5. `class` literal syntax has no affordance for specifying properties(only methods). his might seem limiting to some, but it's expected that the vast majority of cases where a property (state) exists elsewhere but the end-chain "instances", this is usually a mistake and surprising (as it's state that's implicitly "shared" among all "instances"). So, one could say the class syntax is protecting you from mistakes.
6. `extends` lets you extend even built-in object (sub)types, like `Array` or `RegExp`, in a very natural way. Doing so without class .. extends has long been an exceedingly complex and frustrating task, one that only the most adept of framework authors have ever been able to accurately tackle. Now, it will be rather trivial!

More information about the arguments/discussion, it is suggested reading the thoughts of the author of "You Don't Know JavaScript" book. 
https://github.com/getify/You-Dont-Know-JS/blob/master/this%20%26%20object%20prototypes/ch5.md 
https://github.com/getify/You-Dont-Know-JS/blob/master/this%20%26%20object%20prototypes/ch6.md
https://github.com/getify/You-Dont-Know-JS/blob/master/this%20%26%20object%20prototypes/apA.md 

## basic syntax
ES6 introduces `Class` concept as object's template. ES6's `Class` is actually a syntax sugar to make the OOP to be easier to write. 
```javascript
function Point(x, y) {
  this.x = x;
  this.y = y;
}

Point.prototype.toString = function () {
  return '(' + this.x + ', ' + this.y + ')';
};

var p = new Point(1, 2);

//Change into ES6 Class:
class Point {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }

  toString() {
    return '(' + this.x + ', ' + this.y + ')';
  }
}
````

ES6's `Class` can be recognized as another expression of constructor. 
```javascript
class Point {
  // ...
}

typeof Point // "function"
Point === Point.prototype.constructor // true
````
`Class` has also prototype property, and all methods defined in `Class` actually define in its prototype. 
```javascript
class Point {
  constructor(){
    // ...
  }

  toString(){
    // ...
  }

  toValue(){
    // ...
  }
}

// The same as:

Point.prototype = {
  toString(){},
  toValue(){}
};
````
NOTE: All methods defined in `Class` are non-enumerable:
```javascript
class Point {
  constructor(x, y) {
    // ...
  }

  toString() {
    // ...
  }
}

Object.keys(Point.prototype)
// []
Object.getOwnPropertyNames(Point.prototype)
// ["constructor","toString"]
````

The properties can be defined by property name expression:
```javascript
let methodName = "getArea";
class Square{
  constructor(length) {
    // ...
  }

  [methodName]() {
    // ...
  }
}
```

`Class`'s constructor can only be invoked by `new` operator, if call it like normal function, an error will be thrown. 
```javascript
class Foo {
  constructor() {
    return Object.create(null);
  }
}

Foo()
// TypeError: Class constructor Foo cannot be invoked without 'new'
```

## no hoisting 
*`Class` does not have hoisting. This is the different with ES5 *
```javascript
new Foo(); // ReferenceError
class Foo {}
```

## class expression
```javascript
const MyClass = class Me {
  getClassName() {
    return Me.name;
  }
};
```
NOTE: 'Me' can be only used inside the class. 
'Me' can be ignored if it is not needed. 
```javascript
const MyClass = class { /* ... */ };
````

With class expression, it is able to write IIFE by using class. 
```javascript
let person = new class {
  constructor(name) {
    this.name = name;
  }

  sayName() {
    console.log(this.name);
  }
}('Jonathan');

person.sayName(); // "Jonathan"
```

## private methods
ES6 class does not provide a way to create private methods. 
One way is to move private methods out to module. 
```javascript
class Widget {
  foo (baz) {
    bar.call(this, baz);
  }

  // ...
}

function bar(baz) {
  return this.snaf = baz;
}
```

Another method is to use `Symbol` to naming the private methods. 
```javascript
const bar = Symbol('bar');
const snaf = Symbol('snaf');

export default class myClass{

  // public methods
  foo(baz) {
    this[bar](baz);
  }

  // private methods
  [bar](baz) {
    return this[snaf] = baz;
  }

  // ...
};
```
Because `bar` and `snaf` are `Symbol` which result in they cannot be got from 3rd part/outside. 


## the pointing of this
By default `this` points to the instance object. But you should be careful for using it. 
```javascript
class Logger {
  printName(name = 'there') {
    this.print(`Hello ${name}`);
  }

  print(text) {
    console.log(text);
  }
}

const logger = new Logger();
const { printName } = logger;
printName(); // TypeError: Cannot read property 'print' of undefined
```

To correct it, the `this` can be bound to the method:
```javascript
class Logger {
  constructor() {
    this.printName = this.printName.bind(this);
  }

  // ...
}
```
Another solution is use arrow function: 
```javascript
class Logger {
  constructor() {
    this.printName = (name = 'there') => {
      this.print(`Hello ${name}`);
    };
  }

  // ...
}
```
The third solution is to use proxy:
```javascript
function selfish (target) {
  const cache = new WeakMap();
  const handler = {
    get (target, key) {
      const value = Reflect.get(target, key);
      if (typeof value !== 'function') {
        return value;
      }
      if (!cache.has(value)) {
        cache.set(value, value.bind(target));
      }
      return cache.get(value);
    }
  };
  const proxy = new Proxy(target, handler);
  return proxy;
}

const logger = selfish(new Logger());
```

## strict mode
in `class` and `module`, the code runs in 'strict mode' by default. 

## name property
`name` property always returns the name which follows the keyword `class`. 
```javascript
class Point {}
Point.name // "Point"
```



## Class's getter and setter
The same as ES5, `class` can use keywords `set` and `get` to intercept the behaviors of setting and getting properties. 
```javascript
class MyClass {
  constructor() {
    // ...
  }
  get prop() {
    return 'getter';
  }
  set prop(value) {
    console.log('setter: '+value);
  }
}

let inst = new MyClass();

inst.prop = 123;
// setter: 123

inst.prop
// 'getter'
````

Actually the `setter` and `getter` are defined in property's Descriptor object. This is the same as ES5. 
```javascript
class CustomHTMLElement {
  constructor(element) {
    this.element = element;
  }

  get html() {
    return this.element.innerHTML;
  }

  set html(value) {
    this.element.innerHTML = value;
  }
}

var descriptor = Object.getOwnPropertyDescriptor(
  CustomHTMLElement.prototype, "html"
);

"get" in descriptor  // true
"set" in descriptor  // true
````

## Class's generator method
If there is a `*` in front of the method name, the method is actually a Generator function. 
```javascript
class Foo {
  constructor(...args) {
    this.args = args;
  }
  * [Symbol.iterator]() {
    for (let arg of this.args) {
      yield arg;
    }
  }
}

for (let x of new Foo('hello', 'world')) {
  console.log(x);
}
// hello
// world
````

## Class's static method
If a function is modified by `static` keyword, the function will not be inherited by instance, but be called directly through the class, which is called "static method".

```javascript
class Foo {
  static classMethod() {
    return 'hello';
  }
}

Foo.classMethod() // 'hello'

var foo = new Foo();
foo.classMethod()
// TypeError: foo.classMethod is not a function
````

Parent class's static method can be inherited by sub class. 
```javascript
class Foo {
  static classMethod() {
    return 'hello';
  }
}

class Bar extends Foo {
}

Bar.classMethod(); // 'hello'
````
The static method can also be invoked from the `super` object. 
```javascript
class Foo {
  static classMethod() {
    return 'hello';
  }
}

class Bar extends Foo {
  static classMethod() {
    return super.classMethod() + ', too';
  }
}

Bar.classMethod();
````

## Class's static property and instance property
Similar as static method. static property is the property on class itself, Class.propname. Not defined in instance object(this). 
```javascript
class Foo {
}

Foo.prop = 1;
Foo.prop // 1
````

This is the only correct way to define static properties as ES6 explicitly specify that inside class, there is only static methods, no static properties. 
```javascript
// both are invalid
class Foo {
  // approach #1
  prop: 2

  // approach #2
  static prop: 2
}

Foo.prop // undefined
````
In ES7, there a proposal to introduce new ways to define static properties and instance properties
1. Class's instance property
```javascript
class MyClass {
  myProp = 42;

  constructor() {
    console.log(this.myProp); // 42
  }
}
````
in ES6, we define instance properties like this way: 
```javascript
class ReactCounter extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      count: 0
    };
  }
}
````
With new way in ES7, it becomes more simple and clear, doesn't it? 

2. Class's static properties
With new way of defining static properties, you can define the static properties simply by `static` keyword. 
```javascript
class MyClass {
  static myStaticProp = 42;

  constructor() {
    console.log(MyClass.myStaticProp); // 42
  }
}
````

## private property
The same as private methods, ES6 doesn't support private property. There is a proposal adding private property to `class` by setting `#` before the property name. 
```javascript
class Point {
  #x;

  constructor(x = 0) {
    #x = +x;
  }

  get x() { return #x }
  set x(value) { #x = +value }
}
````
So with this, you can use `#` to write private methods as well. 
```javascript
class Foo {
  #a;
  #b;
  #sum() { return #a + #b; }
  printSum() { console.log(#sum()); }
  constructor(a, b) { #a = a; #b = b; }
}
````

## new.target property
Since ES6, `new.target` is introduced to return the constructor invoked by operator `new`. If the constructor is not invoked by `new` operator, `new.target` returns `undefined`. 
```javascript
function Person(name) {
  if (new.target !== undefined) {
    this.name = name;
  } else {
    throw new Error('the function must be called by new operator');
  }
}

// another approach
function Person(name) {
  if (new.target === Person) {
    this.name = name;
  } else {
    throw new Error('the function must be called by new operator');
  }
}

var person = new Person('Jonathan'); // correct
var notAPerson = Person.call(person, 'Jonathan');  // error
```

If `new.target` is called inside Class, it returns current Class. But note that in sub class, `new.target` returns sub class rather than parent class. 
```javascript
class Rectangle {
  constructor(length, width) {
    console.log(new.target === Rectangle);
    // ...
  }
}

class Square extends Rectangle {
  constructor(length) {
    super(length, length);
  }
}

var obj = new Square(3); // 输出 false
```

With this feature, you are able to write a Class which can only be inherited. 
```javascript
class Shape {
  constructor() {
    if (new.target === Shape) {
      throw new Error('本类不能实例化');
    }
  }
}

class Rectangle extends Shape {
  constructor(length, width) {
    super();
    // ...
  }
}

var x = new Shape();  // 报错
var y = new Rectangle(3, 4);  // 正确
```

NOTE: using `new.target` outside function would get an error. 

## the inheritance of class
`extends` is used for extending between Classes. It is much more easier and clearer to do OOP than updating prototype in ES5. 
```javascript
class ColorPoint extends Point {} 
```
See an example:
```javascript
class ColorPoint extends Point {
  constructor(x, y, color) {
    super(x, y); // call parent's constructor(x, y)
    this.color = color;
  }

  toString() {
    return this.color + ' ' + super.toString(); // call parent's toString()
  }
}
```
There is a biggest difference on inheritance between ES5 and ES6 class. 
ES5: the sub instance will be created firstly and then add parent's properties to this sub instance. 
ES6: the parent instance will be created firstly and then update the instance in sub constructor. 

If there is no constructor method explicitly defined, the constructor will be defined/added by default automatically. 
```javascript
constructor(...args) {
  super(...args);
}
```

Note that the `this` can be used only after calling `super` method as only `super` can return an instance of parent. 
```javascript
class Point {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }
}

class ColorPoint extends Point {
  constructor(x, y, color) {
    this.color = color; // ReferenceError
    super(x, y);
    this.color = color; // OK
  }
}
```

### class's prototype and __proto__
Class as constructor's syntax sugar, it has both `prototype` and `__proto__` property, thus it has two inheritance chain. 
1. sub class's `__proto__` property represents the inheritance of constructor which always points to parent class. 
2. sub class's `prototype`'s `__proto__` property represents inheritance for methods, which always points to parent's prototype. 

```javascript
class A {
}

class B extends A {
}

B.__proto__ === A // true
B.prototype.__proto__ === A.prototype // true
```
The result tells us the inheritance of class implements as the below way:
```javascript
class A {
}

class B {
}

// B's instance inherits A's instance
Object.setPrototypeOf(B.prototype, A.prototype);
const b = new B();

// B's static property inherits A's static property
Object.setPrototypeOf(B, A);
const b = new B();
```
As you may have already known that:
```javascript
Object.setPrototypeOf(B.prototype, A.prototype);
// the same as
B.prototype.__proto__ = A.prototype;

Object.setPrototypeOf(B, A);
// the same as
B.__proto__ = A;
````

It can be understood this way:
1. As an object(function itself) the sub class `B`'s prototype(`__proto__`) is parent class `A`. 
2. As a constructor, the sub class `B`'s prototype is parent's instance object. 

### the inheritance target of extends
The `extends` keyword can be followed multiple type of values. 
```javascript
class B extends A {
}
```
The normally case is that the A can/should be any function except `Function.prototype` as long as the A has `prototype` property. 
Besides function, some special cases need to pay more attention:
1. `A` is Object
```javascript
class A extends Object {
}

A.__proto__ === Object // true
A.prototype.__proto__ === Object.prototype // true
```

2. there is no `A`
```javascript
class A {
}

A.__proto__ === Function.prototype // true
A.prototype.__proto__ === Object.prototype // true
```

3. `A` is null
```javascript
class A extends null {
}

A.__proto__ === Function.prototype // true
A.prototype.__proto__ === undefined // true

```
The code above actually does:
```javascript
class C extends null {
  constructor() { return Object.create(null); }
}
```

NOTE: if a function was made/returned by `.bind()`, that function cannot be extended by ES6 `extend` keyword. 


### Object.getPrototypeOf()
As already mentioned above, `Object.getPrototypeOf` can be used to get parent from sub. 
```javascript
Object.getPrototypeOf(ColorPoint) === Point
// true
```

### super keyword
`super` can be used as function and object. 
* When it is used as function, it represents the constructor function. ES6 requires the in sub's constructor function, the `super` function must be called once. 
```javascript
class A {}

class B extends A {
  constructor() {
    super();
  }
}
```
The `super()` actually does `A.prototype.constructor.call(this)`. 
```javascript
class A {
  constructor() {
    console.log(new.target.name);
  }
}
class B extends A {
  constructor() {
    super();
  }
}
new A() // A
new B() // B
```
As a function, `super()` can only be used in constructor function. It would throw an error if it is used in elsewhere. 

* When it is used as an object, in instance function it points to parent's prototype; in static function it points to parent. 
```javascript
class A {
  p() {
    return 2;
  }
}

class B extends A {
  constructor() {
    super();
    console.log(super.p()); // 2
  }
}

let b = new B();
```
Indeed, `super.p()` actually equals `A.prototype.p()`. 

NOTE: as super points to parent's property, so the methods or properties defined in instance object directly cannot be got by `super`. 
```javascript
class A {
  constructor() {
    this.p = 2;
  }
}

class B extends A {
  get m() {
    return super.p;
  }
}

let b = new B();
b.m // undefined
```
if the property is defined in parent's prototype object, then `super` can get it. 
```javascript
class A {}
A.prototype.x = 2;

class B extends A {
  constructor() {
    super();
    console.log(super.x) // 2
  }
}

let b = new B();
```

ES6 also specify that when `super` call parent's method, super will be bound with sub class's `this`. 
```javascript
class A {
  constructor() {
    this.x = 1;
  }
  print() {
    console.log(this.x);
  }
}

class B extends A {
  constructor() {
    super();
    this.x = 2;
  }
  m() {
    super.print();
  }
}

let b = new B();
b.m() // 2
```

As binding with sub class's `this`, if assigning an value to `super`, as `super` is sub class's `this`, so the value will be set to sub instance object. 
```javascript
class A {
  constructor() {
    this.x = 1;
  }
}

class B extends A {
  constructor() {
    super();
    this.x = 2;
    super.x = 3;
    console.log(super.x); // undefined
    console.log(this.x); // 3
  }
}

let b = new B();
```
As you may note that when reading `super.x`, the result is `undefined`. This is because reading from `super.x` is actually reading from `A.prototype.x`. 

If `super` as an object be used in static method, then `super` points to parent, rather than parent's prototype. 
```javascript
class Parent {
  static myMethod(msg) {
    console.log('static', msg);
  }

  myMethod(msg) {
    console.log('instance', msg);
  }
}

class Child extends Parent {
  static myMethod(msg) {
    super.myMethod(msg);
  }

  myMethod(msg) {
    super.myMethod(msg);
  }
}

Child.myMethod(1); // static 1

var child = new Child();
child.myMethod(2); // instance 2
```

NOTE: when you use `super`, you must to explicitly specify it is used as an object or an function. Otherwise you will get error. 
```javascript
class A {}

class B extends A {
  constructor() {
    super();
    console.log(super); // error
  }
}
```

At last, as object always extends from other object, so you can use `super` keyword in any object. 
```javascript
var obj = {
  toString() {
    return "MyObject: " + super.toString();
  }
};

obj.toString(); // MyObject: [object Object]
```

NOTE: For performance pragmatism reasons, super is not late bound (aka, dynamically bound) like this is. Instead it's derived at call-time from [[HomeObject]].[[Prototype]], where [[HomeObject]] is statically bound at creation time.
Consider an example:
```javascript
class P {
	foo() { console.log( "P.foo" ); }
}

class C extends P {
	foo() {
		super();
	}
}

var c1 = new C();
c1.foo(); // "P.foo"

var D = {
	foo: function() { console.log( "D.foo" ); }
};

var E = {
	foo: C.prototype.foo
};

// Link E to D for delegation
Object.setPrototypeOf( E, D );

E.foo(); // "P.foo"
````



### instance's __proto__ property
Sub class instance's `__proto__ `'s `__proto__` points to parent class instance's `__proto__`property. That is to say sub's prototype's prototype is parent's prototype.
```javascript
var p1 = new Point(2, 3);
var p2 = new ColorPoint(2, 3, 'red');

p2.__proto__ === p1.__proto__ // false
p2.__proto__.__proto__ === p1.__proto__ // true
```

Thus, through `__proto__.__proto__` can update parent's instance behavior. 
```javascript
p2.__proto__.__proto__.printName = function () {
  console.log('Ha');
};

p1.printName() // "Ha"
```

## the inheritance for native/built-in constructor 
The following constructor are ES's native constructor functions:
* Boolean()
* Number()
* String()
* Array()
* Date()
* Function()
* RegExp()
* Error()
* Object()

Before ES6, you are not able to extend them, for example:
```javascript
function MyArray() {
  Array.apply(this, arguments);
}

MyArray.prototype = Object.create(Array.prototype, {
  constructor: {
    value: MyArray,
    writable: true,
    configurable: true,
    enumerable: true
  }
});
```
MyArray doesn't work as normal as native Array. 
```javascript
var colors = new MyArray();
colors[0] = "red";
colors.length  // 0

colors.length = 0;
colors[0]  // "red"
```
Why? The reason is that sub class cannot get native constructor's inner properties. It cannot be achieved by `Array.apply()` or its prototype. Native constructor would ignore the `this` passed in `apply`. That is to say native constructor cannot bind `this`. 

ES5 would create sub class's instance object `this` and then adding parent's properties to sub `this`. Due to the parent's inner properties cannot be got, thus resulting the failure of extending from native constructor. 
See another example:
```javascript
var e = {};

Object.getOwnPropertyNames(Error.call(e))
// [ 'stack' ]

Object.getOwnPropertyNames(e)
// []
```
It demonstrates that the `Error.call(e)` cannot get inner properties from `Error`. 

But ES6 allows to extending from native constructor as ES6 would create parent's instance `this` firstly and then modify the `this` by sub constructor. 
```javascript
class MyArray extends Array {
  constructor(...args) {
    super(...args);
  }
}

var arr = new MyArray();
arr[0] = 12;
arr.length // 1

arr.length = 0;
arr[0] // undefined
```

With this, you can define a new version of Array which has "version-control" like function. 
```javascript
class VersionedArray extends Array {
  constructor() {
    super();
    this.history = [[]];
  }
  commit() {
    this.history.push(this.slice());
  }
  revert() {
    this.splice(0, this.length, ...this.history[this.history.length - 1]);
  }
}

var x = new VersionedArray();

x.push(1);
x.push(2);
x // [1, 2]
x.history // [[]]

x.commit();
x.history // [[], [1, 2]]
x.push(3);
x // [1, 2, 3]

x.revert();
x // [1, 2]
```

Another example on `Error`
```javascript
class ExtendableError extends Error {
  constructor(message) {
    super();
    this.message = message;
    this.stack = (new Error()).stack;
    this.name = this.constructor.name;
  }
}

class MyError extends ExtendableError {
  constructor(m) {
    super(m);
  }
}

var myerror = new MyError('ll');
myerror.message // "ll"
myerror instanceof Error // true
myerror.name // "MyError"
myerror.stack
// Error
//     at MyError.ExtendableError
//     ...
```

NOTE: there is a difference on `Object`. 
```javascript
class NewObj extends Object{
  constructor(){
    super(...arguments);
  }
}
var o = new NewObj({attr: true});
console.log(o.attr === true);  // false
```
ES6 specify that if the `Object()` was not called by `new`, it would ignore any passed arguments. 

### Mixin pattern
Mixin pattern means make multiple Class's interface being mixed in another Class. 
```javascript
function mix(...mixins) {
  class Mix {}

  for (let mixin of mixins) {
    copyProperties(Mix, mixin);
    copyProperties(Mix.prototype, mixin.prototype);
  }

  return Mix;
}

function copyProperties(target, source) {
  for (let key of Reflect.ownKeys(source)) {
    if ( key !== "constructor"
      && key !== "prototype"
      && key !== "name"
    ) {
      let desc = Object.getOwnPropertyDescriptor(source, key);
      Object.defineProperty(target, key, desc);
    }
  }
}
```
As you can see the `mix` function can compose multiple objects to one. To use it, you can just simply extend it. 
```javascript
class DistributedEdit extends mix(Loggable, Serializable) {
  // ...
}
```

There is another technique called Implicit Mixins. Implicit mixins are closely related to explicit pseudo-polymorphism as explained previously. As such, they come with the same caveats and warnings.

Consider this code:
```javascript
var Something = {
	cool: function() {
		this.greeting = "Hello World";
		this.count = this.count ? this.count + 1 : 1;
	}
};

Something.cool();
Something.greeting; // "Hello World"
Something.count; // 1

var Another = {
	cool: function() {
		// implicit mixin of `Something` to `Another`
		Something.cool.call( this );
	}
};

Another.cool();
Another.greeting; // "Hello World"
Another.count; // 1 (not shared state with `Something`)
```

It is said that we "mixed in" something 's behavoir with (or into) another. 

While this sort of technique seems to take useful advantage of this rebinding functionality, it is the brittle Something.cool.call( this ) call, which cannot be made into a relative (and thus more flexible) reference, that you should heed with caution. Generally, avoid such constructs where possible to keep cleaner and more maintainable code.

# Behavior Delegation
In above we have already addressed the `prototype` mechanism in detail. Also there are a lot of discussion to explain why it is confusing and inappropriate(depite countless attempts for nearly two decades) to describe it as "class" or "inheritance". 

It's a common reaction at this point to wonder why it has to be so complex to do something seemingly so simple. Now that we've pulled back the curtain and seen just how dirty it all gets, it's not a surprise that most JS developers never dive this deep, and instead relegate such mess to a "class" library to handle it for them.

I hope by now you're not content to just gloss over and leave such details to a "black box" library. Let's now dig into how we could and should be thinking about the object `Prototype` mechanism in JS, in a much simpler and more straightforward way than the confusion of classes.

As it has been told that the `prototype` mechanism is an internal link that exists on one object which references another object, so the essence of what's important to the functionality we can leverage in JavaScript, is all about objects being linked to other objects. 

## Towards Delegation-Oriented Design
To properly focus our thoughts on how to use `Prototype` in the most straightforward way, we must recognize that it represents a fundamentally different design pattern from classes 

We need to try to change our thinking from the class/inheritance design pattern to the behavior delegation design pattern. If you have done most or all of your programming in your education/career thinking in classes, this may be uncomfortable or feel unnatural. You may need to try this mental exercise quite a few times to get the hang of this very different way of thinking.

### Delegation Theory
By using behavior delegation instead of classes, you will first define an object (not a class, nor a function as most JS'rs would lead you to believe) called Task, and it will have concrete behavior on it that includes utility methods that various tasks can use (read: delegate to!). Then, for each task ("XYZ", "ABC"), you define an object to hold that task-specific data/behavior. You link your task-specific object(s) to the Task utility object, allowing them to delegate to it when they need to.
Consider the code below:
```javascript
var Task = {
	setID: function(ID) { this.id = ID; },
	outputID: function() { console.log( this.id ); }
};

// make `XYZ` delegate to `Task`
var XYZ = Object.create( Task );

XYZ.prepareTask = function(ID,Label) {
	this.setID( ID );
	this.label = Label;
};

XYZ.outputTaskDetails = function() {
	this.outputID();
	console.log( this.label );
};

// ABC = Object.create( Task );
// ABC ... = ...
```
In this code, Task and XYZ are not classes (or functions), they're just objects. XYZ is set up via Object.create(..) to [[Prototype]] delegate to the Task object (see Chapter 5).

Some differences to note compared to OOP style code:
1. Both id and label data members from the previous class example are data properties directly on XYZ (neither is on Task). In general, with [[Prototype]] delegation involved, you want state to be on the delegators (XYZ, ABC), not on the delegate (Task).

2. With the class design pattern, we intentionally named outputTask the same on both parent (Task) and child (XYZ), so that we could take advantage of overriding (polymorphism). In behavior delegation, we do the opposite: we avoid if at all possible naming things the same at different levels of the [[Prototype]] chain (called shadowing -- see Chapter 5), because having those name collisions creates awkward/brittle syntax to disambiguate references (see Chapter 4), and we want to avoid that if we can.

3. This design pattern calls for less of general method names which are prone to overriding and instead more of descriptive method names, specific to the type of behavior each object is doing. This can actually create easier to understand/maintain code, because the names of methods (not only at definition location but strewn throughout other code) are more obvious (self documenting).this.setID(ID); inside of a method on the XYZ object first looks on XYZ for setID(..), but since it doesn't find a method of that name on XYZ, [[Prototype]] delegation means it can follow the link to Task to look for setID(..), which it of course finds. Moreover, because of implicit call-site this binding rules (see Chapter 2), when setID(..) runs, even though the method was found on Task, the this binding for that function call is XYZ exactly as we'd expect and want. We see the same thing with this.outputID() later in the code listing.

In other words, the general utility methods that exist on Task are available to us while interacting with XYZ, because XYZ can delegate to Task.

**Behavior Delegation** means: let some object (XYZ) provide a delegation (to Task) for property or method references if not found on the object (XYZ).

NOTE: Mutual Delegation is Disallowed.


