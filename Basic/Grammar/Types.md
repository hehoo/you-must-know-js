# Built-in Types
   * null
   * undefined
   * boolean
   * number
   * string
   * object
   * symbol -- added in ES6!
   
> All of these types except object are called "primitives". Array and function are objects.

```javascript
typeof undefined     === "undefined"; // true
typeof true          === "boolean";   // true
typeof 42            === "number";    // true
typeof "42"          === "string";    // true
typeof { life: 42 }  === "object";    // true

// added in ES6!
typeof Symbol()      === "symbol";    // true
```
The most interesting thing is `null` as you can see below
```javascript
typeof null === "object"; // true
```
Actually it is a bug in JS and it has persisted for nearly two decades, and will likely never be fixed because there's too much existing web content that relies on its buggy behavior. 
If you want to test for `null` value using its type, you need to a compound condition:
```javascript
var a = null;

(!a && typeof a === "object"); // true
```
How about function? 
```javascript
typeof function a(){ /* .. */ } === "function"; // true
```
It's easy to think that function would be a top-level built-in type in JS, especially given this behavior of the typeof operator. However, if you read the spec, you'll see it's actually a "subtype" of object. Specifically, a function is referred to as a "callable object" -- an object that has an internal [[Call]] property that allows it to be invoked.
The fact that functions are actually objects is quite useful. Most importantly, they can have properties. For example:
```javascript
function a(b,c) {
    /* .. */
}

a.length; // 2
```
What about arrays? Are they a special type? 
```javascript
typeof [1,2,3] === "object"; // true
```
Nope, just objects. It's most appropriate to think of them also as a "subtype" of object. 
If so, how to check whether an value is an Array? It will be covered in Array chapter. 
 # *undefined* VS "undeclared"
 Variables that have no value currently, actually have the undefined value. Calling typeof against such variables will return "undefined":
```javascript
var a;

typeof a; // "undefined"

var b = 42;
var c;

// later
b = c;

typeof b; // "undefined"
typeof c; // "undefined"
```
An "undefined" variable is one that has been declared in the accessible scope, but at the moment has no other value in it. By contrast, an "undeclared" variable is one that has not been formally declared in the accessible scope.

Consider:
```javascript
var a;

a; // undefined
b; // ReferenceError: b is not defined
```
> `undefined` and 'is not defined' is different. 
There's also a special behavior associated with typeof as it relates to undeclared variables that even further reinforces the confusion. Consider:
```javascript
var a;

typeof a; // "undefined"

typeof b; // "undefined"
```
The typeof operator returns "undefined" even for "undeclared" (or "not defined") variables. Notice that there was no error thrown when we executed typeof b, even though b is an undeclared variable. This is a special safety guard in the behavior of typeof.
Similar to above, it would have been nice if typeof used with an undeclared variable returned "undeclared" instead of conflating the result value with the different "undefined" case.
Nevertheless, this safety guard is a useful feature when dealing with JavaScript in the browser, where multiple script files can load variables into the shared global namespace.
```javascript
// oops, this would throw an error!
if (DEBUG) {
    console.log( "Debugging is starting" );
}

// this is a safe existence check
if (typeof DEBUG !== "undefined") {
    console.log( "Debugging is starting" );
}
```
In this case the safety guard on typeof is our friend to prevent throwing a `ReferenceError`. 
It is also useful to check for a built-in API. 
```javascript
if (typeof atob === "undefined") {
    atob = function() { /*..*/ };
}
```
Alternatively, doing these checks against global variables but without the safety guard feature of `typeof` is to observe that all global variables are also properties of the global object, which in the browser is basically the window object. 
 ```javascript
 if (window.DEBUG) {
     // ..
 }
 
 if (!window.atob) {
     // ..
 }
 ```
 Unlike referencing undeclared variables, there is no ReferenceError thrown if you try to access an object property (even on the global window object) that doesn't exist.
 # `undefined` VS `null`
 `undefined` and `null' are almost the same. Also both of them would be cast to false value. 
 ```javascript
 if (!undefined) {
   console.log('undefined is false');
 }
 // undefined is false
 
 if (!null) {
   console.log('null is false');
 }
 // null is false
 
 undefined == null
 // true
 ```
 The difference:
 ```javascript
 Number(null) // 0
 5 + null // 0
 ```
 ```javascript
 Number(undefined) // NaN
 5 + undefined // NaN
 ```
```javascript
typeof null // "object"
```
# boolean
boolean represents two states `true` and `false`. 
The value will be casted implicitly whenever the expected value should be boolean in JavaScript. The converting rule is the following six values would be `false` and others are `true`
   * `undefined`
   * `null`
   * `false`
   * `0`
   * `NaN`
   * `""` or `''` (empty string)
Usually boolean value would be used for flow controlling. e.g. 
 ```javascript
 if ('') {
   console.log(true);
 }
 // no output
 
 if ([]) {
   console.log(true);
 }
 // true
 
 if ({}) {
   console.log(true);
 }
 // true
 ```