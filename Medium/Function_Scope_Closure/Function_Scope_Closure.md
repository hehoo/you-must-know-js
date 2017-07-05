# Scope
About scope please refer to the following links: 
   * [What is Scope](https://github.com/getify/You-Dont-Know-JS/blob/master/scope%20%26%20closures/ch1.md)
   * [Lexical Scope](https://github.com/getify/You-Dont-Know-JS/blob/master/scope%20%26%20closures/ch2.md)

## Hoisting
For all declaration in a scope, regardless of where they appear, are processed *first* before the code itself is executed. You can visualize this as declarations(variables and functions) being "moved" to the top of their respective scopes, which is called "hoisting". 
Consider the code
```javascript
a = 2;

var a;

console.log( a ); // 2
````
It is actually like to changed into by compiler:
```javascript
var a;
a = 2;
console.log(a)
```
Consider again:
```javascript
console.log( a ); // undefined, not ReferenceError :)

var a = 2;
````

Another example:
```javascript
foo();

function foo() {
	console.log( a ); // undefined

	var a = 2;
}
````
It actually does:
```javascript
foo();

function foo() {
    var a;
	console.log( a ); // undefined

	a = 2;
}
````

More examples:
```javascript
foo(); // TypeError
bar(); // ReferenceError

var foo = function bar() {
	// ...
};
````
It is the same as 
```javascript
var foo;

foo(); // TypeError
bar(); // ReferenceError

foo = function() {
	var bar = ...self...
	// ...
}
````

### Functions First
Both function declarations and variable declarations are hoisted. But a subtle detail (that can show up in code with multiple "duplicate" declarations) is that functions are hoisted first, and then variables.
```javascript
foo(); // 1

var foo;

function foo() {
	console.log( 1 );
}

foo = function() {
	console.log( 2 );
};
````





# Function
Function is just a block of code which can be invoked many times again and again.
 
 ## The ways to declare a function
 ### Function Declaration
 ```javascript
 function print(s) {
   console.log(s);
 }
 ```
 
 ### Function Expression
 ```javascript
 var print = function(s) {
   console.log(s);
 };
 ```
 The function expression still can have a name, but the name can only be accessed inside the function. Consider: 
 ```javascript
 var print = function x(){
   console.log(typeof x);
 };
 
 x
 // ReferenceError: x is not defined
 
 print()
 // function
 ```
 When to give a name to the function expression? 
    * Invoke the function itself inside the function. 
    * Easy to debug
    
### Function Constructor
```javascript
var add = new Function(
  'x',
  'y',
  'return x + y'
);

// The same as

function add(x, y) {
  return x + y;
}
```
NOTE: not suggested using this way to create a function

## The invocation of the function
The function can be invoked this way by `()` with argument inside it. `
```javascript
function add(x, y) {
  return x + y;
}

add(1, 1) // 2
```
If there is a `return`, the JavasScript engine will return the expression after the `return` immediately no matter if there are still statements after the `return`.

The function can also call itself which is called recursion. 
```javascript
function fib(num) {
  if (num === 0) return 0;
  if (num === 1) return 1;
  return fib(num - 2) + fib(num - 1);
}

fib(6) // 8
```

## Function is first-class citizen
As function is also treated as an value the same as other values(Number, String, Boolean), so it is the first-class citizen in JavaScript world. 
```javascript
function add(x, y) {
  return x + y;
}

// assign a function to an variable
var operator = add;

// a function as returned value
function a(op){
  return op;
}
a(add)(1, 1)
// 2
```

## Hoisting
As all you know that all variables declaration will be hoisted to the top of the code, which is called hoisting. As function name is also treated as an variable name, so the whole function will be hoisted to the top when using function declaration to declare a function. 
```javascript
f();

function f() {}
```
As function was hoisted to the top, so the snippet of code above would not throw any error. But if using function expression to create a function below would get an error. 
```javascript
f();
var f = function (){};
// TypeError: undefined is not a function
```
The code is the same as below
```javascript
var f;
f();
f = function () {};
```

Consider:
```javascript
var f = function() {
  console.log('1');
}

function f() {
  console.log('2');
}

f() // 1
```

## Cannot declare a function in condition block statement
For example in if/try statement. 
```javascript
if (foo) {
  function x() {}
}

try {
  function x() {}
} catch(e) {
  console.log(e);
}
```
But most of browser didn't follow this rule/specification so it probably would not throw any error in the console. 

## Function's properties and methods
### name 
```javasceript
function f1() {}
f1.name // 'f1'

var f2 = function () {};
f2.name // ''

var f3 = function myName() {};
f3.name // 'myName'
```

the name property of function has been written in the standard since ES6. 
```javascript
function foo() {}
foo.name // "foo"
```

```javascript
var f = function () {};

// ES5
f.name // ""

// ES6
f.name // "f"
```
```javascript
const bar = function baz() {};

// ES5
bar.name // "baz"

// ES6
bar.name // "baz"
```

```javascript
(new Function).name // "anonymous"
```

```javascript
function foo() {};
foo.bind({}).name // "bound foo"

(function(){}).bind({}).name // "bound "
```

### length
```javascript
function f(a, b) {}
f.length // 2
```
The length is the amount of the arguments when the function is defined. It will not be changed no matter how many arguments are passed when invoking it. 

Since ES6 introducing the default value for parameters, the `length` of function would be distortion. Consider:
```javascript
(function (a) {}).length // 1
(function (a = 5) {}).length // 0
(function (a, b, c = 5) {}).length // 2

(function(...args) {}).length // 0

(function (a = 0, b, c) {}).length // 0
(function (a, b = 1, c) {}).length // 1
````


### toString
`toString` function is overrided by function. It returns the source code of it.
```javascript
function f() {
  a();
  b();
  c();
}

f.toString()
// function f() {
//  a();
//  b();
//  c();
// }
```
Even with comments
```javascript
function f() {/*
  这是一个
  多行注释
*/}

f.toString()
// "function f(){/*
//   这是一个
//   多行注释
// */}"
```

## The scope of function
### The definition
There are two types of scopes in JavaScript. 
   * Global scope - the variable defined in this scope can be accessed any time and any where
   * Function scope - the variable defined in this scope can accessed inside the scope

See examples: 
```javascript
var v = 1;

function f(){
  console.log(v);
}

f()
// 1
````

```javascript
function f(){
  var v = 1;
}

v // ReferenceError: v is not defined
````

```javascript
var v = 1;

function f(){
  var v = 2;
  console.log(v);
}

f() // 2
v // 1
````
Consider the below example: 
```javascript
if (true) {
  var x = 5;
}
console.log(x);  // 5
````
The x actually is defined in global scope as there is no block scope in JavaScript. 

### The hoisting inside function
The same as global scope, the variable defined in function would be hoisted to the top no matter where the variable is defined.
```javascript
function foo(x) {
  if (x > 100) {
    var tmp = x - 100;
  }
}
````
The same as 
```javascript
function foo(x) {
  var tmp;
  if (x > 100) {
    tmp = x - 100;
  };
}
````

### The scope of function itself
As function itself is also a value(object), so it is the same as other variable that its scope is the one where it is defined., 
See an example:
```javascript
var a = 1;
var x = function () {
  console.log(a);
};

function f() {
  var a = 2;
  x();
}

f() // 1
````

Consider another example:
```javascript
function foo() {
  var x = 1;
  function bar() {
    console.log(x); 
  }
  return bar;
}

var x = 2;
var f = foo();
f() // 1
````

## Arguments
### Arguments can be ignored when invoking
```javascript
function f(a, b) {
  return a;
}

f(1, 2, 3) // 1
f(1) // 1
f() // undefined

f.length // 2
````
More examples: 
```javascript
function f(a, b) {
  return a;
}

f( , 1) // SyntaxError: Unexpected token ,(…)
f(undefined, 1) // undefined
````

### Default value
Before ES6, you can assign a default value this way:
```javascript
function f(a){
  a = a || 1;
  return a;
}

f('') // 1
f(0) // 1
````
Since ES6, you can do in a better way:
```javasscript
function f(a = 1){
  return a;
}

f('') // 1
```
The default arguments are declared by default, it is not allowed to declare them again by `let` or `const`
```javascript
function foo(x = 5) {
  let x = 1; // error
  const x = 2; // error
}
````
Also duplicate parameters/arguments not allowed:
```javascript
function foo(x, x, y = 1) {
  // ...
}
// SyntaxError: Duplicate parameter name not allowed in this context
````
NOTE: If the default value is also an variable/expression, then it will be evaluated again when invoking the function. On the other hand default value is lazy evaluated.
```javascript
let x = 99;
function foo(p = x + 1) {
  console.log(p);
}

foo() // 100

x = 100;
foo() // 101
````

#### Default argument value working with destructuring assignment 
See an example:
```javascript
function foo({x, y = 5}) {
  console.log(x, y);
}

foo({}) // undefined, 5
foo({x: 1}) // 1, 5
foo({x: 1, y: 2}) // 1, 2
foo() // TypeError: Cannot read property 'x' of undefined
````
See another example:
```javascript
function fetch(url, { body = '', method = 'GET', headers = {} }) {
  console.log(method);
}

fetch('http://example.com', {})
// "GET"

fetch('http://example.com')
// Throw error
````
Why it throws an error if the second argument is not given? How about this? 
```javascript
function fetch(url, { method = 'GET' } = {}) {
  console.log(method);
}

fetch('http://example.com')
// "GET"
````
Why it works?  As there is a default value for second argument, if the second one is not given then the default value will be valid and then it triggers the destructuring assignment to make the method to be "GET". 

How about below examples? What are the differences?
```javascript
//approach #1
function m1({x = 0, y = 0} = {}) {
  return [x, y];
}

//approach #2
function m2({x, y} = { x: 0, y: 0 }) {
  return [x, y];
}
````
The differences are
   * approach #1 has a default value empty object with destructuring assignment with default values
   * approach #2 has a concrete object with destructuring assignment without default values

See the different results below, it is interesting, isn't it?
```javascript
// no argument
m1() // [0, 0]
m2() // [0, 0]

// both x and y have values
m1({x: 3, y: 8}) // [3, 8]
m2({x: 3, y: 8}) // [3, 8]

// only x has value
m1({x: 3}) // [3, 0]
m2({x: 3}) // [3, undefined]

// both x and y have no value
m1({}) // [0, 0];
m2({}) // [undefined, undefined]

m1({z: 3}) // [0, 0]
m2({z: 3}) // [undefined, undefined]
````

#### the location of arguments default value
Usually the argument with default value should be put to the end of the arguments, if it is not, actually the parameter cannot be ignored. 
```javascript
// example 1
function f(x = 1, y) {
  return [x, y];
}

f() // [1, undefined]
f(2) // [2, undefined])
f(, 1) // error
f(undefined, 1) // [1, 1]

// example 2
function f(x, y = 5, z) {
  return [x, y, z];
}

f() // [undefined, 5, undefined]
f(1) // [1, 5, undefined]
f(1, ,2) // error
f(1, undefined, 2) // [1, 5, 2]

````

NOTE: if you passing `null` value will not trigger the default value, but `undefined` could. 
```javascript
function foo(x = 5, y = 6) {
  console.log(x, y);
}

foo(undefined, null)
// 5 null
````

#### Context 
Once the default value is set, during the initialization of function, the arguments will form a dedicated context. After the initialization, the context will be disappeared. 
```javascript
var x = 1;

function f(x, y = x) {
  console.log(y);
}

f(2) // 2
````

See another example:
```javascript
let x = 1;

function f(y = x) {  // this time the x points to the global x
  let x = 2;
  console.log(y);
}

f() // 1
````
If the global x is not presented.
```javascript
function f(y = x) {
  let x = 2;
  console.log(y);
}

f() // ReferenceError: x is not defined
````

```javascript
var x = 1;

function foo(x = x) {  // it does "let x = x". 
  // ...
}

foo() // ReferenceError: x is not defined
````
Due to the temporary dead zone, the x is not defined. 

If the default value is a function, it also follows the same rule:
```javascript
let foo = 'outer';

function bar(func = x => foo) {
  let foo = 'inner';
  console.log(func()); 
}

bar(); // outer
````

See a complex case:
```javascript
var x = 1;
function foo(x, y = function() { x = 2; }) {
  var x = 3;
  y();
  console.log(x);
}

foo() // 3
x // 1
````
If the `var` of `var x = 3` is removed, then the output is 2 as the x is actually pointing to the first parameter x
```javascript
var x = 1;
function foo(x, y = function() { x = 2; }) {
  x = 3;
  y();
  console.log(x);
}

foo() // 2
x // 1
````

#### the application of default value
To utilize the default value, we check whether the parameters are given or not easily. 
```javascript
function throwIfMissing() {
  throw new Error('Missing parameter');
}

function foo(mustBeProvided = throwIfMissing()) {
  return mustBeProvided;
}

foo()
// Error: Missing parameter
````

Also you can set the default value to be `undefined` to indicate that the parameter is optional. 
```javascript
function foo(optional = undefined) { ··· }
````


### Arguments passing way
If the arguments are primitive values. The arguments changes would not affect the values passed from outside. 
```javascript
var p = 2;

function f(p) {  // passes by value
  p = 3;
}
f(p);

p // 2
````
But if the argument is composed value(object, array and etc.), if the arguments are chagned inside the function, the value outside would be changed as well.
```javascript
var obj = {p: 1};

function f(o) { // pases by reference
  o.p = 2;
}
f(obj);

obj.p // 2
```

But consider:
```javascript
var obj = [1, 2, 3];

function f(o){
  o = [2, 3, 4];  // if you change the reference totally, it would not affect the argument passed
}
f(obj);

obj // [1, 2, 3]
````

### Arguments with same name
```javascript
function f(a, a) {
  console.log(a);
}

f(1, 2) // 2   //NOTE: the last one argument will be used
```


### arguments object
As JavaScript allows pass any number of arguments to function no matter how many arguments were defined beforehand. So JavaScript needs a way to read all passed arguments, this is why the object arguments comes from. 
As we have already mentioned in `Array` section that arguments is an Array-like object. You can see more information about array-like(TODO, add link here!) object in that section.`
```javascripot
var f = function(one) {
  console.log(arguments[0]);
  console.log(arguments[1]);
  console.log(arguments[2]);
}

f(1, 2, 3)
// 1
// 2
// 3
```

arguments object also has a property called `callee` which is used to return the original function. `
```javascript
var f = function(one) {
  console.log(arguments.callee === f);
}

f() // true
```
NOTE: but it is forbidden in strict mode so it is not suggested to use. 

## Closure 
Closure is a very important and difficult concept/feature in JavaScript. 
Consider the code snippet below:
```javascript
function f1() {
  var n = 999;
  function f2() {
　　console.log(n); // 999
  }
}
```
Above, a function was defined inside another function, then the inner function can access the variables defined in outer function(also the variables defined in outer function will not be GCed even if its invocation has finished ). This is closure. 
See another example:
```javascript
function createIncrementor(start) {
  return function () {
    return start++;
  };
}

var inc = createIncrementor(5);

inc() // 5
inc() // 6
inc() // 7
```
Another useful purpose to use closure is to encapsulate object's property and its private method. 
```javascript
function Person(name) {
  var _age;
  function setAge(n) {
    _age = n;
  }
  function getAge() {
    return _age;
  }

  return {
    name: name,
    getAge: getAge,
    setAge: setAge
  };
}

var p1 = Person('张三');
p1.setAge(25);
p1.getAge() // 25
```

### the application of closure
   * setTimeout
   * curry
   * module

NOTE: As closure would remain the variables created in outer function, so it would consume more memory. So if it is used incorrect way, it will result in performance issues. 

## IIFE (Immediately Invoked Function Expression)
In JavaScript, `()` is the operator to invoke a function. Sometimes, it is needed to invoke the function immediately when defining the function. But if we do this like below:
```javascript
function(){ /* code */ }();
// SyntaxError: Unexpected token (
```
You will get an error above. This is because if `function` starts at the beginning of the line, it is a statement. In JavaScript, the statement cannot end with `()`.  What you need to correct it is to:
```javascript
(function(){ /* code */ }());
// OR
(function(){ /* code */ })();
```

More examples:
```javascript
var i = function(){ return 10; }(); 
true && function(){ /* code */ }();
0, function(){ /* code */ }();
```
As they are expression so it is ok to end with `()` operator. 
Even more example: 
```javascript
!function(){ /* code */ }();
~function(){ /* code */ }();
-function(){ /* code */ }();
+function(){ /* code */ }();
```
The operator `new` can also achieve it:
```javascript
new function(){ /* code */ }

new function(){ /* code */ }()
// The () is needed only when passing arguments is needed
```

The advantage of using IIFE are:
   * Avoid pollute global namespace as no need to name the function
   * IIFE can create a dedicated scope, so it is able to encapsulate private variables to prevent from accessing them from outside
   
```javascript
// example 1
var tmp = newData;  // pollute the global namespace
processData(tmp);
storeData(tmp);

// example 3
(function (){
  var tmp = newData;
  processData(tmp);
  storeData(tmp);
}());
```

## eval command
`eval` is to execute a passed string as statement. 
```javascript
eval('var a = 1;');
a // 1
```
`eval` doesn't have its own scope, but it can update the variables values of current scope, which may result security issue. 
```javascript
var a = 1;
eval('a = 2');

a // 2
```
Because of this, in strict mode, the variable declared in `eval` would not affect the scope outside. 
```javascript
(function f() {
  'use strict';
  eval('var foo = 123');
  console.log(foo);  // ReferenceError: foo is not defined
})()
```
But it can still read the variable of current scope. 
```javascript
(function f() {
  'use strict';
  var foo = 1;
  eval('foo = 2');
  console.log(foo);  // 2
})()
```

Also `eval` cannot get the optimization from the engine, this is also another reason not to use it. 

More complicated is that indirect invoking `eval` will be run in global scope, but direct invoking `eval` will be run in current scope, consider:
```javascripot
var a = 1;

function f() {
  var a = 2;
  var e = eval;
  e('console.log(a)');
}

f() // 1
```
Below are all "indirect invoking":
```javascript
eval.call(null, '...')
window.eval('...')
(1, eval)('...')
(eval, eval)('...')
```

Similarly the `Function` constructor can also do the same thing as `eval`. 
```javascript
var jsonp = 'foo({"id": 42})';

var f = new Function( "foo", jsonp );
// it is the same as:
// function f(foo) {
//   foo({"id":42});
// }

f(function(json){
  console.log( json.id ); // 42
})
```
As `Function` has the same disadvantages as `eval`, *it is not suggested to use*. 

## .call(), .apply() and .bind()
JavaScript also provides three important methods to set and fix the `this` when invoking one function. 
### function.prototype.call()
See an example:
```javascript
var obj = {};

var f = function () {
  return this;
};

f() === this // true
f.call(obj) === obj // true
```
If the argument of `call` is not passed or passed with `null` or`undefined`, then by default the global object will be passed. 
```javascript
var n = 123;
var obj = { n: 456 };

function a() {
  console.log(this.n);
}

a.call() // 123
a.call(null) // 123
a.call(undefined) // 123
a.call(window) // 123
a.call(obj) // 456
```

If the passed argument is a primitive value, then this primitive value will be wrapped as a wrapped object. 
```javascript
var f = function () {
  return this;
};

f.call(5)
// Number {[[PrimitiveValue]]: 5}
```

`call` can also accept multiple arguments. 
```javascript
function add(a, b) {
  return a + b;
}

add.call(this, 1, 2) // 3
```

One of usage for `call` is to invoke original method especially when the original one was override. 
```javascript
 var obj = {};
 obj.hasOwnProperty('toString') // false
 
 // override the inherited toString method
 obj.hasOwnProperty = function () {
   return true;
 };
 obj.hasOwnProperty('toString') // true
 
 Object.prototype.hasOwnProperty.call(obj, 'toString') // false
```

### function.prototype.apply
`apply` is very similar with `call`, the only difference is it accepts an Array as the arguments that the function needs. 
```javascript
func.apply(thisValue, [arg1, arg2, ...]);
````
See the example:
```javascript
function f(x,y){
  console.log(x+y);
}

f.call(null,1,1) // 2
f.apply(null,[1,1]) // 2
```

There are several interesting applications when taking `apply` into use. 
   * find the maximum value of an Array
```javascript
var a = [10, 2, 4, 15, 9];

Math.max.apply(null, a)
// 15
```
   * change the empty slot of Array to undefined
```javascript
Array.apply(null, ["a",,"b"])
// [ 'a', undefined, 'b' ]
```
   * already mentioned that convert array-like object to an Array
```javascript
Array.prototype.slice.apply({0:1,length:1})
// [1]

Array.prototype.slice.apply({0:1})
// []

Array.prototype.slice.apply({0:1,length:2})
// [1, undefined]

Array.prototype.slice.apply({length:1})
// [undefined]
```
   * bind an object for callback function
```javascript
var o = new Object();

o.f = function () {
  console.log(this === o);
}

var f = function (){
  o.f.apply(o); // the more better way is to use .bind(). 
  // or o.f.call(o);
};

$('#button').on('click', f);
```

### function.prototype.bind()
`bind` is used to bind `this` to a certain object and then returns a new function. 
```javascript
var d = new Date();
d.getTime() // 1481869925657

var print = d.getTime;
print() // Uncaught TypeError: this is not a Date object.
```
The reason why it throws an error in above code is because the `this` inside the `getTime` function is an instance of `Date` object. But the `this` inside the print has not been the instance of `Date` anymore. 
`bind` to rescue, see example below:
```javascript
var print = d.getTime.bind(d);
print() // 1481869925657
```
Consider:
```javascript
var counter = {
  count: 0,
  inc: function () {
    this.count++;
  }
};

var func = counter.inc;
func();
counter.count // 0
count // NaN
```
As the `func` is running in global environment so that the `this` is not pointing to the counter object anymore. so the `counter.count` will not be increased. 
In order to fix it, `bind` can be used. 
```javascript
var func = counter.inc.bind(counter);
func();
counter.count // 1
```

`this` also can be bound to another object. E.g. 
```javascript
var obj = {
  count: 100
};
var func = counter.inc.bind(obj);
func();
obj.count // 101
```

Beside binding `this`, `bind` can also bind arguments for the original function.
```javascript
var add = function (x, y) {
  return x * this.m + y * this.n;
}

var obj = {
  m: 2,
  n: 2
};

var newAdd = add.bind(obj, 5); // this is bound to obj and x is bound to 5

newAdd(5) // 5 is y now
// 20
```
If the first argument of `bind` is `null` or `undefined`, the `this` will be bound to global object. 
```javascript
function add(x, y) {
  return x + y;
}

var plus5 = add.bind(null, 5);
plus5(10) // 15
```

The `bind` can be polyfilled in below way if old browsers didn't support it. 
```javascript
if(!('bind' in Function.prototype)){
  Function.prototype.bind = function(){
    var fn = this;
    var context = arguments[0];
    var args = Array.prototype.slice.call(arguments, 1);
    return function(){
      return fn.apply(context, args);
    }
  }
}
```

When you use `bind`, you must know some points below:
   * it returns a new function every time
As it will return a new function every time, it may cause problem e.g. adding event listener, you cannot do this
```javascript
element.addEventListener('click', o.m.bind(o));
```
because the listener is anonymous, which would result the listener cannot be removed. 
```javascript
element.removeEventListener('click', o.m.bind(o));
```
The correct way is to do this way
```javascript
var listener = o.m.bind(o);
element.addEventListener('click', listener);
//  ...
element.removeEventListener('click', listener);
```

   * can be utilized with callback
```javascript
var obj = {
  name: 'Zack',
  times: [1, 2, 3],
  print: function () {
    this.times.forEach(function (n) {
      console.log(this.name);
    });
  }
};

obj.print()
// nothing to output. 
```
`bind` to rescue
```javascript
obj.print = function () {
  this.times.forEach(function (n) {
    console.log(this.name);
  }.bind(this));
};

obj.print()
// Zack 
// Zack
// Zack
```

   * utilize it with `call` method
```javascript
[1, 2, 3].slice(0, 1)
// [1]

// the same as

Array.prototype.slice.call([1, 2, 3], 0, 1)
// [1]

//the same as

var slice = Function.prototype.call.bind(Array.prototype.slice);

slice([1, 2, 3], 0, 1) // [1]

```
And more method of Array can be written, e.g. 
```javascript
var push = Function.prototype.call.bind(Array.prototype.push);
var pop = Function.prototype.call.bind(Array.prototype.pop);

var a = [1 ,2 ,3];
push(a, 4)
a // [1, 2, 3, 4]

pop(a)
a // [1, 2, 3]
```
Furthermore, bind `Function.prototype.call` to `Function.prototype.bind` means that the `bind` invocation can be changed this way:
```javascript
function f() {
  console.log(this.v);
}


var o = { v: 123 };

var bind = Function.prototype.call.bind(Function.prototype.bind);

bind(f, o)() // 123   it was changed from f.bind(o) to bind(f, o) :)
```

## rest arguments
Since ES6 introduces `...` rest parameters which is used to replace `arguments` object. 
```javascript
// arguments
function sortNumbers() {
  return Array.prototype.slice.call(arguments).sort();
}

// rest parameters
const sortNumbers = (...numbers) => numbers.sort();
```

NOTE: rest parameters must be the last one parameter, otherwise an error will thrown. 
```javascript
// error
function f(a, ...b, c) {
  // ...
}
```

## Spread operator ...
Spread operator also use `...` for it. It is like to do an opposite way to spread an array to a sequence. 
```javascript
console.log(...[1, 2, 3])
// 1 2 3

console.log(1, ...[2, 3, 4], 5)
// 1 2 3 4 5

[...document.querySelectorAll('div')]
// [<div>, <div>, <div>]
```

#### replace .apply() method
As it can spread an array, it can replace `.apply()` to spread an array. 
```javascript
// ES5
function f(x, y, z) {
  // ...
}
var args = [0, 1, 2];
f.apply(null, args);

// ES6
function f(x, y, z) {
  // ...
}
var args = [0, 1, 2];
f(...args);
```

An example on `Math.max`:
```javascript
// ES5
Math.max.apply(null, [14, 3, 77])

// ES
Math.max(...[14, 3, 77])

//the same as
Math.max(14, 3, 77);
```

#### the application of spread operator
   * concat two array
```javascript
// ES5
[1, 2].concat(more)
// ES6
[1, 2, ...more]

var arr1 = ['a', 'b'];
var arr2 = ['c'];
var arr3 = ['d', 'e'];

// ES5
arr1.concat(arr2, arr3);
// [ 'a', 'b', 'c', 'd', 'e' ]

// ES6
[...arr1, ...arr2, ...arr3]
// [ 'a', 'b', 'c', 'd', 'e' ]
```

   * working with destructuring assignment
```javascript
// ES5
a = list[0], rest = list.slice(1)
// ES6
[a, ...rest] = list
```

NOTE: the spread parameters must be put at the last one when using array destructuring assignment. 
```javascript
const [...butLast, last] = [1, 2, 3, 4, 5];
// error

const [first, ...middle, last] = [1, 2, 3, 4, 5];
// error

```
   * returning a collection rather than a single value
```javascript
var dateFields = readDateFields(database);
var d = new Date(...dateFields);
```

   * string
```javascript
[...'hello']
// [ "h", "e", "l", "l", "o" ]
```
The same as `Array.from`, the spread operator can identify the 32 bit Unicode characters correctly. 
```javascript
'x\uD83D\uDE80y'.length // 4
[...'x\uD83D\uDE80y'].length // 3
```
So getting the length of string can be done like below. 
```javascript
function length(str) {
  return [...str].length;
}

length('x\uD83D\uDE80y') // 3
```
So it is better to use spread operator to manipulate string if it contains 32 bit characters. 
```javascript
let str = 'x\uD83D\uDE80y';

str.split('').reverse().join('')
// 'y\uDE80\uD83Dx'

[...str].reverse().join('')
// 'y\uD83D\uDE80x'
```

   * Any object implementing iterator interface can use spread operator
```javascript
var nodeList = document.querySelectorAll('div');
var array = [...nodeList];
```
It works because `NodeList` implements `Iterator` interface. 
To array-object which doesn't implements `Iterator` interface, the spread operator cannot convert it to `Array`
```javascript
let arrayLike = {
  '0': 'a',
  '1': 'b',
  '2': 'c',
  length: 3
};

// TypeError: Cannot spread non-iterable object.
let arr = [...arrayLike];
```

As `Map`, `Set` and `Generator` function also implements `Iterator` interface, so they all can use spread operator.
```javascript
Map:
let map = new Map([
  [1, 'one'],
  [2, 'two'],
  [3, 'three'],
]);

let arr = [...map.keys()]; // [1, 2, 3]
```
Generator function:
```javascript
var go = function*(){
  yield 1;
  yield 2;
  yield 3;
};

[...go()] // [1, 2, 3]
```

## Strict Mode
Since ES6 if the function parameters use *default value, destructing assignment or spread operator*, then inside the function, it is not allowed to set it to "Strict Mode" explicitly. 

## Arrow Function
Since ES6, JavaScript allows to use "Arrow" `=>`  to define a function.
```javascript
var f = v => v;
```
It is the same as:
```javascript
var f = function(v) {
  return v;
};
```
If arrow function has no argument or multiple arguments, `()` is used for it. 
```javascript
var f = () => 5;
// the same as
var f = function () { return 5 };

var sum = (num1, num2) => num1 + num2;
// the same as
var sum = function(num1, num2) {
  return num1 + num2;
};
```
If there are multiple line and need returning value, then you need to use `{}` to include them. 
```javascript
var sum = (num1, num2) => { return num1 + num2; }
```

If returning a object, you have to use `()` to wrap the object. 
```javascript
var getTempItem = id => ({ id: id, name: "Temp" });
```

One of purpose of arrow function is to simplify the callback function. 
```javascript
// normal way
[1,2,3].map(function (x) {
  return x * x;
});

// arrow function 
[1,2,3].map(x => x * x);
```
More examples with rest parameters. 
```javascript
const numbers = (...nums) => nums;

numbers(1, 2, 3, 4, 5)
// [1,2,3,4,5]

const headAndTail = (head, ...tail) => [head, tail];

headAndTail(1, 2, 3, 4, 5)
// [1,[2,3,4,5]]
```

### NOTES
When using arrow function, you must be care of the following points:
   1. The `this` is the object when it is define, not the one when use it(runtime).
   2. Cannot use `new` operator to invoke it.
   3. Cannot use `arguments` object, but use rest parameters
   4. Cannot use `yield` operator thus arrow function cannot use as Generator function. 

Among 4 notes, you must be pay more attention to the first one as it is error prone. 
```javascript
function foo() {
  setTimeout(() => {
    console.log('id:', this.id);
  }, 100);
}

var id = 21;

foo.call({ id: 42 });
// id: 42
```
See another example:
```javascript
function Timer() {
  this.s1 = 0;
  this.s2 = 0;
  // arrow function
  setInterval(() => this.s1++, 1000);
  // normal function
  setInterval(function () {
    this.s2++;
  }, 1000);
}

var timer = new Timer();

setTimeout(() => console.log('s1: ', timer.s1), 3100);
setTimeout(() => console.log('s2: ', timer.s2), 3100);
// s1: 3
// s2: 0
```

The factor of `this` can be fixed is quite useful for encapsulating callback function. 
```javascript
var handler = {
  id: '123456',

  init: function() {
    document.addEventListener('click',
      event => this.doSomething(event.type), false);
  },

  doSomething: function(type) {
    console.log('Handling ' + type  + ' for ' + this.id);
  }
};
```

*The reason why the this can be fixed in arrow function is actually that there is no `this` inside the arrow function, it actually points to its outers function's `this`. This is also why it cannot be used as constructor.*

See an interesting example below:
```javascript
function foo() {
  return () => {
    return () => {
      return () => {
        console.log('id:', this.id);
      };
    };
  };
}

var f = foo.call({id: 1});

var t1 = f.call({id: 2})()(); // id: 1
var t2 = f().call({id: 3})(); // id: 1
var t3 = f()().call({id: 4}); // id: 1
```

*Besides `this`, the following three variables don't exist either, they all point to outer function*
   * arguments
   * super
   * new.target
   
```javascript
function foo() {
  setTimeout(() => {
    console.log('args:', arguments);
  }, 100);
}

foo(2, 4, 6, 8)
// args: [2, 4, 6, 8]
```
As arrow function doens't have `this`, so it cannot use `call()`, `appy()` and `bind()` to change its this. 
```javascript
(function() {
  return [
    (() => this.x).bind({ x: 'inner' })()
  ];
}).call({ x: 'outer' });
// ['outer']
```

Consider a complex example below
```javascript
var obj = {
	count: 0,
	cool: function coolFn() {
		if (this.count < 1) {
			setTimeout( () => { // arrow-function ftw?
				this.count++;
				console.log( "awesome?" );
			}, 100 );
		}
	}
};

obj.cool(); // awesome?
````
TODO: what is the count value? 


### nested array function
See the nested function which is written in ES5 way
```javascript
function insert(value) {
  return {into: function (array) {
    return {after: function (afterValue) {
      array.splice(array.indexOf(afterValue) + 1, 0, value);
      return array;
    }};
  }};
}

insert(2).into([1, 3]).after(1); //[1, 2, 3]
```
Change it in ES6 arrow function way
```javascript
let insert = (value) => ({into: (array) => ({after: (afterValue) => {
  array.splice(array.indexOf(afterValue) + 1, 0, value);
  return array;
}})});

insert(2).into([1, 3]).after(1); //[1, 2, 3]
```

See a "pipeline" example:
```javascript
const pipeline = (...funcs) =>
  val => funcs.reduce((a, b) => b(a), val);

const plus1 = a => a + 1;
const mult2 = a => a * 2;
const addThenMult = pipeline(plus1, mult2);

addThenMult(5)
// 12
```
To simplicity it can be re-written like below:
```javascript
const plus1 = a => a + 1;
const mult2 = a => a * 2;

mult2(plus1(5))
// 12
```
The arrow function can easily calculate λ
```javascript
// λ's algorithm 
fix = λf.(λx.f(λv.x(x)(v)))(λx.f(λv.x(x)(v)))

// Use ES6 arrow function to implement it
var fix = f => (x => f(v => x(x)(v)))
               (x => f(v => x(x)(v)));
```


## binding this
Arrow function cannot bind `this` by `(call, apply, bind)`. So ES7 raises a proposal - "function bind" operator (`::`) to achieve it. 
See example:
```javascript
foo::bar;
// the same as
bar.bind(foo);

foo::bar(...arguments);
// the same as
bar.apply(foo, arguments);

const hasOwnProperty = Object.prototype.hasOwnProperty;
function hasOwn(obj, key) {
  return obj::hasOwnProperty(key);
}
```

## Optimization of tail call
TODO

## Trailing function comma
This is also a proposal on ES2017 that the comma is not allow for the last parameter. 
```javascript
function clownsEverywhere(
  param1,
  param2,
) { /* ... */ }

clownsEverywhere(
  'foo',
  'bar',
);
```

TODO: to be updated for this part. 


# References
   * http://javascript.ruanyifeng.com/grammar/function.html# 
   * http://javascript.ruanyifeng.com/oop/this.html#toc3 
   * http://es6.ruanyifeng.com/#docs/function -  ES6
   * https://github.com/getify/You-Dont-Know-JS/blob/master/scope%20&%20closures/README.md#you-dont-know-js-scope--closures 

# Exercise
Try [Function_Scope_Closure Exercise](Medium/Exercise/Function_Scope_Closure.js) here to grab all key points. 

# Presentation & Video
See [Function_Scope_Closure  presentation](https://sharenet-ims.int.net.nokia.com/livelink/livelink?func=ll&objaction=overview&objid=555473979) for the course presentation. 
See [Function_Scope_Closure_video](https://sharenet-ims.int.net.nokia.com/livelink/livelink?func=ll&objaction=overview&objid=555473981) for the course video. 

