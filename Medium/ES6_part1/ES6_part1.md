# Summary of ES6 part1
This part will cover the following points:
   * Let & Const operator
   * Destructuring Assignment for variables
   * New features for string
   * New features for object
   * Symbol
   * Set and Map data structure
   
# let & const operator
## let
Since ES6, `let` operator is introduced to declare variables. The variables declared by `let` is only valid in its block. 
```javascript
{
  let a = 10;
  var b = 1;
}

a // ReferenceError: a is not defined.
b // 1
```

Using it in loop is quite useful:
```javascript
for (let i = 0; i < 10; i++) {}

console.log(i);
//ReferenceError: i is not defined
```
See an interesting example:
```javascript
var a = [];
for (var i = 0; i < 10; i++) {
  a[i] = function () {
    console.log(i);
  };
}
a[6](); // 10
```
The output usually is not the expected result. By using `let` can easy fix this problem.
```javascript
var a = [];
for (var i = 0; i < 10; i++) {
  a[i] = function () {
    console.log(i);
  };
}
a[6](); // 10
```

*Another note you must be aware is that the for loop would form a parent scope and the body of the loop is a dedicated child scope. *
```javascript
for (let i = 0; i < 3; i++) {
  let i = 'abc';
  console.log(i);
}
// abc
// abc
// abc
```

### No hoisting
Unlike the `var`, the `let` would not do hoisting. 
```javascript
// var 的情况
console.log(foo); // 输出undefined
var foo = 2;

// let 的情况
console.log(bar); // 报错ReferenceError
let bar = 2;
```

### Temporal dead zone (TDZ)
As long as a block has a `let` operator, the variable declaration will be bound to this block. It would not be impact from outside. 
```javascript
var tmp = 123;

if (true) {
  tmp = 'abc'; // ReferenceError
  let tmp;
}
```
ES6 specification says if a block has `let` or `const` operator, referring the variable before declaring the variable in the block is forbidden. Otherwise an error would be thrown. 
In short, the variable cannot be used before the `let` or `const`. It is called temporal dead zone, TDZ. 

Because of TDZ, the `typeof` is also not safe for checking whether variables are declared. 
```javascript
typeof x; // ReferenceError
let x;
```

Some TDZ is very not easy to find. e.g. 
```javascript
function bar(x = y, y = 2) { // it is  similar to do as "let x = y; let y = 2"
  return [x, y];
}

bar(); // Error: y is not defined
```
This is because the default value "y" is in a TDZ. 
Consider:
```javascript
// working
var x = x;

// error
let x = x;
// ReferenceError: x is not defined
```
As long as the declaration is not finished, it is still in the TDZ. 

### Duplicated declaration is not allowed
```javascript
// error
function () {
  let a = 10;
  var a = 1;
}

// error
function () {
  let a = 10;
  let a = 1;
}
```

### Block Scope
`let` actually bring block scope to JavaScript. 
```javascript
function f1() {
  let n = 5;
  if (true) { // a block here
    let n = 10;
  }
  console.log(n); // 5
}
```
If changing the `let` to be `var` you will see the result of 10. 

The block scope can be nested. And the inner scope can define variables with same name as outer scope. 
```javascript
{{{{
  let insane = 'Hello World';
  {let insane = 'Hello World'}
}}}};
```

Because of the introduced block scope by `let` and `const` the `IIFE` is not that necessary anymore. 
```javascript
// IIFE 
(function () {
  var tmp = ...;
  ...
}());

// block scope
{
  let tmp = ...;
  ...
}
```

### Block Scope and Function Declaration
ES5 spec does not allow declare function in block scope, but since ES6, *the function declaration in block is the same as `let`, which means the function declared in block cannot be accessed/referred from outside of the block.*
```javascript
function f() { console.log('I am outside!'); }

(function () {
  if (false) {
    // declare the f function again. 
    function f() { console.log('I am inside!'); }
  }

  f();
}());
```
In ES5 browsers, you wil get 'I am inside!' as the f function will be hoisted. 
But in ES6 browsers, according to the ES6 spec, it should be 'I am outside!' in theory. But it would impact too many legacy codes which make them working incorrectly for legacy projects/products. 
So in order to mitigate the compatibility problem, in ES6 appendix B, it shows that browsers cannot follow this rule with their own exceptional behaviors:
* Allow function declaration in block scope
* Function declaration can be hoisted to the head of global scope or function scope
* At the meantime, function declaration will be hoisted to the head of the block scope 

NOTE: this exceptional rules are for browsers, for other environment, they are invalid. 

So based on those exceptional rules, the code will be compiled to:
```javascript
// ES6 browsers:
function f() { console.log('I am outside!'); }
(function () {
  var f = undefined;
  if (false) {
    function f() { console.log('I am inside!'); }
  }

  f();
}());
// Uncaught TypeError: f is not a function
```

Because of this inconsistence, please **DO NOT ** declare function in block, but using function expression instead if you really do so. 


## const
`const` is used to declare a readonly constant. The constant cannot be changed once it was declared. 
```javascript
const PI = 3.1415;
PI // 3.1415

PI = 3;
// TypeError: Assignment to constant variable.
```

The usage of `const` is similar as `let`, e.g. TDZ, only valid in its block where declare it....

As the `const` can only make sure the memory address pointed by variables not be changed, but the value of the variables also can be changed, e.g. objects.
```javascript
const foo = {};

foo.prop = 123;
foo.prop // 123

foo = {}; // TypeError: "foo" is read-only
```  
If it is expected to freeze a object, the method `Object.freeze` can be used. 
```javascript
onst foo = Object.freeze({});

// in normal mode, the line below does nothing(won't work)
// in strict mode, an error will be got
foo.prop = 123;
```

## 6 ways to delcare variables in ES6
 * var
 * function
 * let
 * const
 * import
 * class

 for `import` and `class`, we will talk them later. 

## Global object and its properties
As we have already known that in ES5, the global variables are the same as the properties of global object. 
```javascript
window.a = 1;
a // 1

a = 2;
window.a // 2
```

Since ES6, it will be changed. For compatibility issue, the variables declared by `var` and `function` will still be the properties of global object. But on the other side, the variables declared by `let`, `const`, `class` DO NOT belong to global object. 
That is to say starting from ES6, the global variables will have no releationship with properties of global object. 
```javascript
var a = 1;
window.a // 1

let b = 1;
window.b // undefined
```

## Global object
There are some problems for global object of ES5. The implementation for it is inconsistent in different environment. 
* `window` is the global object in browser, but there is no `window` in Node and Web Worker
* In browser and Web Worker, `self` is pointing to the global object, but Node does not have it
* In Node, the global object is `global`, other environments do not support it

Then how to solve the inconsistence? Here are very good solutions:
```javascript
// approach #1
(typeof window !== 'undefined'
   ? window
   : (typeof process === 'object' &&
      typeof require === 'function' &&
      typeof global === 'object')
     ? global
     : this);

// approach #2
var getGlobal = function () {
  if (typeof self !== 'undefined') { return self; }
  if (typeof window !== 'undefined') { return window; }
  if (typeof global !== 'undefined') { return global; }
  throw new Error('unable to locate global object');
};
```

There was a proposal raised that introducing `global` object as the global object. 
The polyfill library `system.global` simulates this proposal:
```javascript
// CommonJS
require('system.global/shim')();

// ES6 module
import shim from 'system.global/shim'; shim();
```
The `global` can also be got like this:
```javascript
// CommonJS
var global = require('system.global')();

// ES6 module
import getGlobal from 'system.global';
const global = getGlobal();
```


# Destructuring Assignment for variables
## Array destructuring assignment
See an example: 
```javascript
let [a, b, c] = [1, 2, 3];
```

Essentially, the destructuring is actually doing the pattern maching.  
```javascript
let [foo, [[bar], baz]] = [1, [[2], 3]];
foo // 1
bar // 2
baz // 3

let [ , , third] = ["foo", "bar", "baz"];
third // "baz"

let [x, , y] = [1, 2, 3];
x // 1
y // 3

let [head, ...tail] = [1, 2, 3, 4];
head // 1
tail // [2, 3, 4]

let [x, y, ...z] = ['a'];
x // "a"
y // undefined
z // []
```

Unsuccessfully destructuring would get `undefined`. 
Incomplete destructuring: 
```javascript
let [x, y] = [1, 2, 3];  //incomplet destructuring
x // 1
y // 2

let [a, [b], d] = [1, [2, 3], 4];
a // 1
b // 2
d // 4
```

The following destructuring would fail. 
```javascript
// error
let [foo] = 1;
let [foo] = false;
let [foo] = NaN;
let [foo] = undefined;
let [foo] = null;
let [foo] = {};
```
Why they are failed?  The hood of under destructuring is `Iteraor` (will be talked later), so the right side of `=` is not an `Iterator` would fail. 
Thus, for any object which implements `Iterator` interface can be destructuring assignment. 
```javascript
let [x, y, z] = new Set(['a', 'b', 'c']);
x // "a"
```

### default value
Destructuring assignment allows to specify default value. See the example below:
```javascript
let [foo = true] = [];
foo // true

let [x, y = 'b'] = ['a']; // x='a', y='b'
let [x, y = 'b'] = ['a', undefined]; // x='a', y='b'
```
The same as default value for function parameter, only `undefined` can trigger the default value. 
```javascript
let [x = 1] = [undefined];
x // 1

let [x = 1] = [null];
x // null
```
If the default value is an expression, the value is evaluated lazily. 
```javascript
function f() {
  console.log('aaa'); //would not log to the console.
}

let [x = f()] = [1];
```


## Object destructuring assignment
```javascript
let { foo, bar } = { foo: "aaa", bar: "bbb" };
foo // "aaa"
bar // "bbb"
```

If the variable name is different with property name of object, you must write it like below:
```javascript
var { foo: baz } = { foo: 'aaa', bar: 'bbb' };
baz // "aaa"

let obj = { first: 'hello', last: 'world' };
let { first: f, last: l } = obj;
f // 'hello'
l // 'world'
```

As array, the destructuring can be used for nested objects. 
```javascript
let obj = {
  p: [
    'Hello',
    { y: 'World' }
  ]
};

let { p: [x, { y }] } = obj;
x // "Hello"
y // "World"
```
NOTE: the p here is pattern actually, not the variable. 

Another example for nested structure:
```javascript
let obj = {};
let arr = [];

({ foo: obj.prop, bar: arr[0] } = { foo: 123, bar: true });

obj // {prop:123}
arr // [true]
```

The same as array destructuring assignment, the default value is also can be specified. 
```javascript
var {x = 3} = {};
x // 3

var {x, y = 5} = {x: 1};
x // 1
y // 5

var {x:y = 3} = {};
y // 3

var {x:y = 3} = {x: 5};
y // 5

var { message: msg = 'Something went wrong' } = {};
msg // "Something went wrong"
```

If destructuring is failed, the value of variable will be `undefined`. 
```javascript
let {foo} = {bar: 'baz'};
foo // undefined
```

Consider:
```javascript
let {foo} = {bar: 'baz'};
foo // undefined


// error
let {foo: {bar}} = {baz: 'baz'};
```

The application of object destructuring assignment:
```javascript
let { log, sin, cos } = Math;
```

As Array is a special object, thus it is ok to use object's property to destructuring an array. 
```javascript
let arr = [1, 2, 3];
let {0 : first, [arr.length - 1] : last} = arr;
first // 1
last // 3
```


## String's destructuring assignment
```javascript
const [a, b, c, d, e] = 'hello';
a // "h"
b // "e"
c // "l"
d // "l"
e // "o"
```

## number and boolean's destructuring assignment
For number and boolean value, the value will be converted to object before destructuring assignment. 
```javascript
let {toString: s} = 123;
s === Number.prototype.toString // true

let {toString: s} = true;
s === Boolean.prototype.toString // true
```

Because `undefined` and `null` cannot be converted to an object, so it throws an error if do destructuring assignment for them.
```javascript
let { prop: x } = undefined; // TypeError
let { prop: y } = null; // TypeError
```

## function parameters' destructuring assignment
```javascript
function add([x, y]){
  return x + y;
}

add([1, 2]); // 3
```
Another useful example:
```javascript
[[1, 2], [3, 4]].map(([a, b]) => a + b);
// [ 3, 7 ]
```

## the () issue
ES6 spec says the anything would result in an ambiguity during the destructuring assignment, the `()` cannot be used. 
The following cases cannot use `()`;
1. () cannot be used in variable declaration statement 
```javascript
// all error
let [(a)] = [1];

let {x: (c)} = {};
let ({x: c}) = {};
let {(x: c)} = {};
let {(x): c} = {};

let { o: ({ p: p }) } = { o: { p: 2 } };
```

2. the pattern of function parameters cannot contain ()
```javascript
// error
function f([(z)]) { return z; }
```

3. Cannot put the whole pattern into a () or the nested one.  
```javascript
// all error
({ p: a }) = { p: 42 };
([a]) = [5];
```

```javascript
// error
[({ p: a }), { x: c }] = [{}, {}];
```

The only case that the `()` can be used: The `()` can be used in the non-pattern part of assignment statement. 
```javascript
[(b)] = [3]; // correct
({ p: (d) } = {}); // correct
[(parseInt.prop)] = [3]; // correct
```

## the application of destructuring assignment
1. swap varaibles
```javascript
let x = 1;
let y = 2;

[x, y] = [y, x];
```

2. return multiple values from function
```javascript
// 

function example() {
  return [1, 2, 3];
}
let [a, b, c] = example();

// 

function example() {
  return {
    foo: 1,
    bar: 2
  };
}
let { foo, bar } = example();
```

3. The definition of function parameters
```javascript
function f([x, y, z]) { ... }
f([1, 2, 3]);


function f({x, y, z}) { ... }
f({z: 3, y: 2, x: 1});
```

4. Extract JSON data
```javascript
let jsonData = {
  id: 42,
  status: "OK",
  data: [867, 5309]
};

let { id, status, data: number } = jsonData;

console.log(id, status, number);
// 42, "OK", [867, 5309]
```

5. functin parameters' default value

6. Iterating Map structure
```javascript
var map = new Map();
map.set('first', 'hello');
map.set('second', 'world');

for (let [key, value] of map) {
  console.log(key + " is " + value);
}
// first is hello
// second is world
```

```javascript
// 
for (let [key] of map) {
  // ...
}

// 
for (let [,value] of map) {
  // ...
}
```

7. import module's specified methods
```javascript
const { SourceMapConsumer, SourceNode } = require("source-map");
```

# new features of ES6 string
## Unicode expression for character
JavaScript allows to use `\uxxxx` to express a character in which `xxxx` is its Unicode code points. 
```javascript
'\u0061'
// 'a'
```
But it can only express the character which Unicode code point is between `\u0000` and `\uFFFF`. The character must use two bytes to express it if the code point is out of the range. 
```javascript
"\uD842\uDFB7"
// "𠮷"

"\u20BB7"
// " 7"
```

ES6 improves it by include the code point in a `{}`, then the character can be recognized correctly. 
```javascript
"\u{20BB7}"
// "𠮷"

"\u{41}\u{42}\u{43}"
// "ABC"

let hello = 123;
hell\u{6F} // 123

'\u{1F680}' === '\uD83D\uDE80'
// true
```

With this, there are 6 ways to express a character:
```javascript
'\z' === 'z'  // true
'\172' === 'z' // true
'\x7A' === 'z' // true
'\u007A' === 'z' // true
'\u{7A}' === 'z' // true
```

## codePointAt()
Inside JavaScript, it uses UTF-16 format to store character. Every character's length fixs with 2 bytes. For the character which must use 4 bytes to express, JavaScript recognize them as 2 characters. 
```javascript
var s = "𠮷";

s.length // 2
s.charAt(0) // ''
s.charAt(1) // ''
s.charCodeAt(0) // 55362
s.charCodeAt(1) // 57271
```
As you can see the "𠮷" was recognized as 2 character(the length is 2). 

ES6 provides a new method `codePointAt` which can deal with 4-bytes characters and returns its code point. 
```javascript
var s = '𠮷a';

s.codePointAt(0) // 134071
s.codePointAt(1) // 57271

s.codePointAt(2) // 97 // 'a'
```

You also can convert the code point from decimal to hexadecimal. 
```javascript
var s = '𠮷a';

s.codePointAt(0).toString(16) // "20bb7"
s.codePointAt(2).toString(16) // "61"
```
As you may have seen that in order to get the code point for character "a", you have to pass 2 to the parameter. To fix it, you can use for...of loop which can identify 32 bit UTF-16 character correctly. 
```javascript
var s = '𠮷a';
for (let ch of s) {
  console.log(ch.codePointAt(0).toString(16));
}
// 20bb7
// 61
```

## String.fromCodePoint()
ES5 provides `String.fromCharCode` which can return the corresponding character from the given code point. But this method cannot identify 32 bit UTF-16 character correctly(Unicode code point > 0xFFFF).
```javascript
String.fromCharCode(0x20BB7)
// "ஷ"  // U+0bb7
``` 

ES6's `String.fromCodePoint()` to rescue. 
```javascript
String.fromCodePoint(0x20BB7)
// "𠮷"
String.fromCodePoint(0x78, 0x1f680, 0x79) === 'x\uD83D\uDE80y'
// true
```

## String's iterator interface
ES6 assign `iterator` interface to string thus string can be iterated by `for...of`. As we have already mentioned that `for...of` can also identify 32-bit UTF-16 character correctly. 
```javascript
var text = String.fromCodePoint(0x20BB7);

for (let i = 0; i < text.length; i++) {
  console.log(text[i]);
}
// " "
// " "

for (let i of text) {
  console.log(i);
}
// "𠮷"
```

## at()
ES5 provides `charAt` can return the character with given position of a string. But it cannot identify the 32-bit character correctly either. 
```javascript
'abc'.charAt(0) // "a"
'𠮷'.charAt(0) // "\uD842"
```
There is a **proposal** to provide a new method `at` to rescue it. 
```javascript
'abc'.at(0) // "a"
'𠮷'.at(0) // "𠮷"
```

## normalize()
Please refer to http://es6.ruanyifeng.com/#docs/string#normalize for more information. 

## includes(), startsWith(), endsWith()
Let's see examples directly. 
```javascript
var s = 'Hello world!';

s.startsWith('Hello') // true
s.endsWith('!') // true
s.includes('o') // true
```
It also accepts second parameter:
```javascript
var s = 'Hello world!';

s.startsWith('world', 6) // true
s.endsWith('Hello', 5) // true
s.includes('Hello', 6) // false
```

## repeat()
```javascript
'x'.repeat(3) // "xxx"
'hello'.repeat(2) // "hellohello"
'na'.repeat(0) // ""

'na'.repeat(2.9) // "nana"

'na'.repeat(Infinity)
// RangeError
'na'.repeat(-1)
// RangeError

'na'.repeat(-0.9) // ""

'na'.repeat(NaN) // ""

'na'.repeat('na') // ""
'na'.repeat('3') // "nanana"
```

## padStart(), padEnd()
Those two methods were proposed in ES2017, which are used to complete/complement string. 
```javascript
'x'.padStart(5, 'ab') // 'ababx'
'x'.padStart(4, 'ab') // 'abax'

'x'.padEnd(5, 'ab') // 'xabab'
'x'.padEnd(4, 'ab') // 'xaba'

'xxx'.padStart(2, 'ab') // 'xxx'
'xxx'.padEnd(2, 'ab') // 'xxx'

'abc'.padStart(10, '0123456789')
// '0123456abc'


'x'.padStart(4) // '   x'
'x'.padEnd(4) // 'x   '

'1'.padStart(10, '0') // "0000000001"
'12'.padStart(10, '0') // "0000000012"
'123456'.padStart(10, '0') // "0000123456"


'12'.padStart(10, 'YYYY-MM-DD') // "YYYY-MM-12"
'09-12'.padStart(10, 'YYYY-MM-DD') // "YYYY-09-12"
```

## template string
In ES5, usually `+` is used to concat strings to output a template, which is very inconvenient.
Since ES6, template string was introduced to solve such issue. 
```javascript
// normal string
`In JavaScript '\n' is a line-feed.`

// multiple lines string
`In JavaScript this is
 not legal.`

console.log(`string text line 1
string text line 2`);

// using variables in template string
var name = "Bob", time = "today";
`Hello ${name}, how are you ${time}?`
```

```javascript
var greeting = `\`Yo\` World!`;
```

NOTE: All spaces and indents will be retained. 

The variables in template string must be wrapped by `${}`, actually you can put any **valid expressio**n in it. See examples:
```javascript
var x = 1;
var y = 2;

`${x} + ${y} = ${x + y}`
// "1 + 2 = 3"

`${x} + ${y * 2} = ${x + y * 2}`
// "1 + 4 = 5"

var obj = {x: 1, y: 2};
`${obj.x + obj.y}`
// 3
```

In template string, it is also allowed to invoke a function. 
```javascript
function fn() {
  return "Hello World";
}

`foo ${fn()} bar`
// foo Hello World bar
```

Template string can also be nested:
```javascript
const tmpl = addrs => `
  <table>
  ${addrs.map(addr => `
    <tr><td>${addr.first}</td></tr>
    <tr><td>${addr.last}</td></tr>
  `).join('')}
  </table>
`;
```

If you want to refer the tempalte string iteself and invoke it when needed, you can do:
```javascript
// approach #1
let str = 'return ' + '`Hello ${name}!`';
let func = new Function('name', str);
func('Jack') // "Hello Jack!"

// approach #2
let str = '(name) => `Hello ${name}!`';
let func = eval.call(null, str);
func('Jack') // "Hello Jack!"
```

## tagged template
template string can be used to follow with a function which is used to handle the given tempalte string. This is called tagged template.
```javascript
alert`123`
// the same as
alert(123)
```

Tagged template is actually not a tempalte, but a special form of function invocation. But if template string contain variables, the template string will be split to multiple parameters for the function to be invoked. 
```javascript
var a = 5;
var b = 10;

tag`Hello ${ a + b } world ${ a * b }`;
// the same as
tag(['Hello ', ' world ', ''], 15, 50);
``` 

The signature of function tag may look like:
```javascript
function tag(stringArr, value1, value2){
  // ...
}

// the same as

function tag(stringArr, ...values){
  // ...
}
```

Here is an example of the implementation of tag:
```javascript
var a = 5;
var b = 10;

function tag(s, v1, v2) {
  console.log(s[0]);
  console.log(s[1]);
  console.log(s[2]);
  console.log(v1);
  console.log(v2);

  return "OK";
}

tag`Hello ${ a + b } world ${ a * b}`;
// "Hello "
// " world "
// ""
// 15
// 50
// "OK"
```

See a complex example:
```javascript
var total = 30;
var msg = passthru`The total is ${total} (${total*1.05} with tax)`;

function passthru(literals) {
  var result = '';
  var i = 0;

  while (i < literals.length) {
    result += literals[i++];
    if (i < arguments.length) {
      result += arguments[i];
    }
  }

  return result;
}

msg // "The total is 30 (31.5 with tax)"
```

Another version with rest parameters:
```javascript
function passthru(literals, ...values) {
  var output = "";
  for (var index = 0; index < values.length; index++) {
    output += literals[index] + values[index];
  }

  output += literals[index]
  return output;
}
```

One important usage of tagged template is to filter HTML string to prevent user from inputing illegal characters. 
```javascript
var message =
  SaferHTML`<p>${sender} has sent you a message.</p>`;

function SaferHTML(templateData) {
  var s = templateData[0];
  for (var i = 1; i < arguments.length; i++) {
    var arg = String(arguments[i]);

    // Escape special characters in the substitution.
    s += arg.replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;");

    // Don't escape special characters in the template.
    s += templateData[i];
  }
  return s;
}
```

Another useful application for tagged template is for i18n. 
```javascript
i18n`Welcome to ${siteName}, you are visitor number ${visitorNumber}!`
// "欢迎访问xxx，您是第xxxx位访问者！"
```

As template string does not have condition statement and loop statement, but through tagged template, you can add your own features/functionalites on for template string. 
```javascript
var libraryHtml = hashTemplate`
  <ul>
    #for book in ${myBooks}
      <li><i>#{book.title}</i> by #{book.author}</li>
    #end
  </ul>
`;
```

The first argument for tagged template function is an array, this array also has a property `raw` which stores escaped original string.
```javascript
console.log`123`
// ["123", raw: Array[1]]
``` 
See an example:
```javascript
tag`First line\nSecond line`

function tag(strings) {
  console.log(strings.raw[0]);
  // "First line\\nSecond line"
}
```

## String.raw()
ES6 provides a function `raw` in String object which is used as tagged template function to return escapsed string. 
```javascript
String.raw`Hi\n${2+3}!`;
// "Hi\\n5!"

String.raw`Hi\u000A!`;
// 'Hi\\u000A!'
```

`String.raw` can also be used as a normal function, but the first argument must have a property `raw` and its value must an array. 
```javascript
String.raw({ raw: 'test' }, 0, 1, 2);
// 't0e1s2t'

// the same as
String.raw({ raw: ['t','e','s','t'] }, 0, 1, 2);
```

## the limitation of template string
As template string will escapse string, so it results that it is impossible to embed other languages. 
@TODO more information needed here....


# ES6 new features on object
## Concise expression for properties
```javascript
var foo = 'bar';
var baz = {foo};
baz // {foo: "bar"}

// the same as
var baz = {foo: foo};
```

Besides properties, the methods also can be concise. 
```javascript
var o = {
  method() {
    return "Hello!";
  }
};

// the same as

var o = {
  method: function() {
    return "Hello!";
  }
};
```
For Generator function, you have to add `*` before the function name:
```javascript
var obj = {
  * m(){
    yield 'hello world';
  }
};
```

## Properties name expression
See an example:
```
let propKey = 'foo';

let obj = {
  [propKey]: true,
  ['a' + 'bc']: 123
};
```

The expression can also be used on methods:
```javascript
let obj = {
  ['h' + 'ello']() {
    return 'hi';
  }
};

obj.hello() // hi
```

NOTE: If the property name expression is an object, the object will be converted to a string(`[object Object]`) by default.
```javascript
const keyA = {a: 1};
const keyB = {b: 2};

const myObject = {
  [keyA]: 'valueA',
  [keyB]: 'valueB'
};

myObject // Object {[object Object]: "valueB"}
```

## method's name property
As object's method is also a function, so it also has a `name` property. 
```javascript
const person = {
  sayName() {
    console.log('hello!');
  },
};

person.sayName.name   // "sayName"
```

For `getter` and `setter` the `name` property is not on the property, but on the its property descriptor. 
```javascript
const obj = {
  get foo() {},
  set foo(x) {}
};

obj.foo.name
// TypeError: Cannot read property 'name' of undefined

const descriptor = Object.getOwnPropertyDescriptor(obj, 'foo');

descriptor.get.name // "get foo"
descriptor.set.name // "set foo"
```

More exceptional cases:
```javascript
(new Function()).name // "anonymous"

var doSomething = function() {
  // ...
};
doSomething.bind().name // "bound doSomething"
```
and for Symbol:
```javascript
const key1 = Symbol('description');
const key2 = Symbol();
let obj = {
  [key1]() {},
  [key2]() {},
};
obj[key1].name // "[description]"
obj[key2].name // ""
```

## Object.is()
In ES5, there are two exceptional cases for equality.
* `NaN` does not equal `NaN`
* `+0` equals `-0`

ES6 raise "Same-value equality" principle to solve the problems above. `Object.is` is introduced for that. It is almost the same as `===`, but can deal with the exceptional cases mentioned above.
```javascript
Object.is('foo', 'foo')
// true
Object.is({}, {})
// false

+0 === -0 //true
NaN === NaN // false

Object.is(+0, -0) // false
Object.is(NaN, NaN) // true
```

## Object.assign
This is used to combine two objects, it copies all enumerable properties from source object to target object. 
```javascript
var target = { a: 1 };

var source1 = { b: 2 };
var source2 = { c: 3 };

Object.assign(target, source1, source2);
target // {a:1, b:2, c:3}
```

More cases:
```javascript
var target = { a: 1, b: 1 };

var source1 = { b: 2, c: 2 };
var source2 = { c: 3 };

Object.assign(target, source1, source2);
target // {a:1, b:2, c:3}  // latter properties in source object will override the former ones.
```

```javascript
var obj = {a: 1};
Object.assign(obj) === obj; // true
```


```javascript
typeof Object.assign(2) // "object" // primitive value will be converted to object firstly 
```
`null` and `undefined` cannot be converted to an object.
```javascript
Object.assign(undefined) // Error
Object.assign(null) // Error
```

```javascript
let obj = {a: 1};
Object.assign(obj, undefined) === obj // true
Object.assign(obj, null) === obj // true
```

As only string can be converted to an object having enumerable properties, so only the string will be copied to new object, boolean and number are ignored. 
```javascript
var v1 = 'abc';
var v2 = true;
var v3 = 10;

var obj = Object.assign({}, v1, v2, v3);
console.log(obj); // { "0": "a", "1": "b", "2": "c" }
```

The Symbol property will also be copied:
```javascript
Object.assign({ a: 'b' }, { [Symbol('c')]: 'd' })
// { a: 'b', Symbol(c): 'd' }
```

NOTE: **`Object.assign` is shadow copy not deep copy. **, so you must be careful of it when you want to deep copy some properties from source objects. 

NOTE: **As Array is also an object, so `Object.assign` can also be used on an array. **
```javascript
Object.assign([1, 2, 3], [4, 5])
// [4, 5, 3]
```

### the usage of `Object.assign`
1. Assign properties for objects
```javascript
class Point {
  constructor(x, y) {
    Object.assign(this, {x, y});
  }
}
```

2. Assign methods for objects
```javascript
Object.assign(SomeClass.prototype, {
  someMethod(arg1, arg2) {
    ···
  },
  anotherMethod() {
    ···
  }
});

// The same as:
SomeClass.prototype.someMethod = function (arg1, arg2) {
  ···
};
SomeClass.prototype.anotherMethod = function () {
  ···
};
```

3. Clone objects
```javascript
function clone(origin) {
  return Object.assign({}, origin);
}
```
But it cannot clone its parent(prototype) object which extends from. If you want to do so, you can do this:
```javascript
function clone(origin) {
  let originProto = Object.getPrototypeOf(origin);
  return Object.assign(Object.create(originProto), origin);
}
```

4. Combine multiple objects
```javascript
const merge =
  (target, ...sources) => Object.assign(target, ...sources);
```

5. Specify default value for properties
```javascript
const DEFAULTS = {
  logLevel: 0,
  outputFormat: 'html'
};

function processContent(options) {
  options = Object.assign({}, DEFAULTS, options);
  console.log(options);
  // ...
}
```

@TODO: Add the missing parts here along with the course of object/prototype/this.  Currently skip the rest parts. 


# Symbol

## introduction
As object properties are all string in ES5, which may easily result the conflicts of the properties name. ES6 introduces `Symbol` to solve this issue. 
`Symbol` means unique value. It is the 7th data type in JavaScript. The rests are `undefined`, `null`, boolean, string, number, object. 
```javascript
let s = Symbol();

typeof s
// "symbol"
```

`Symbol` accepts a string as parameter for its description purpose. 
```javascript
var s1 = Symbol('foo');
var s2 = Symbol('bar');

s1 // Symbol(foo)
s2 // Symbol(bar)

s1.toString() // "Symbol(foo)"
s2.toString() // "Symbol(bar)"
```

The parameter is just a description, `Symbol` function returns differnt value even if with same description.
```javascript
var s1 = Symbol();
var s2 = Symbol();

s1 === s2 // false


var s1 = Symbol('foo');
var s2 = Symbol('foo');

s1 === s2 // false
```

`Symbol` value cannot compute with other data types:
```javascript
var sym = Symbol('My symbol');

"your symbol is " + sym
// TypeError: can't convert symbol to string
`your symbol is ${sym}`
// TypeError: can't convert symbol to string
```

But `Symbol` value can be converted to string explicitly. 
```javascript
var sym = Symbol('My symbol');

String(sym) // 'Symbol(My symbol)'
sym.toString() // 'Symbol(My symbol)'
```

`Symbol` value can also be converted to a boolean value, but cannot for number. 
```javascript
var sym = Symbol();
Boolean(sym) // true
!sym  // false

if (sym) {
  // ...
}

Number(sym) // TypeError
sym + 2 // TypeError
```

## Symbol as property name
The advantage of using Symbol as property name is the name cannot be conflict with existing names.
```javascript
var mySymbol = Symbol();

// approach #1
var a = {};
a[mySymbol] = 'Hello!';

// approach #2
var a = {
  [mySymbol]: 'Hello!'
};

// approach #3
var a = {};
Object.defineProperty(a, mySymbol, { value: 'Hello!' });

// the result
a[mySymbol] // "Hello!"
```

NOTE: `.` operator cannot be used for Symbol value. 
```javascript
var mySymbol = Symbol();
var a = {};

a.mySymbol = 'Hello!';
a[mySymbol] // undefined
a['mySymbol'] // "Hello!"
```

One most important usage of Symbol is to define a set of constants:
```javascript
log.levels = {
  DEBUG: Symbol('debug'),
  INFO: Symbol('info'),
  WARN: Symbol('warn')
};
log(log.levels.DEBUG, 'debug message');
log(log.levels.INFO, 'info message');
```

## Properties' name Iterating
@TODO, will talk about it along with Object/reflect/.... course. 

## Symbol.for(), Symbol.keyFor()
Sometimes, it is needed to reuse a Symbol value which is already defined. `Symbol.for` can do that. 
```javascript
var s1 = Symbol.for('foo');
var s2 = Symbol.for('foo');

s1 === s2 // true
```

`Symbol.keyFor` is used to return already registered Symbol value's key. 
```javascript
var s1 = Symbol.for("foo");
Symbol.keyFor(s1) // "foo"

var s2 = Symbol("foo");
Symbol.keyFor(s2) // undefined
```

NOTE: **the name registered by `Symbol.for` is in global environment, you can get the same value from different iframe and service worker. **
```javascript
iframe = document.createElement('iframe');
iframe.src = String(window.location);
document.body.appendChild(iframe);

iframe.contentWindow.Symbol.for('foo') === Symbol.for('foo')
// true
``` 

## Built-in Symbol value
@TODO, this part will be added more info when going to meta programming course. 
### Symbol.hasInstance

### Symbol.isConcatSpreadable

### Symbol.species

### Symbol.match

### Symbol.replace

### Symbol.search

### Symbol.split

### Symbol.iterator

### Symbol.toPrimitive


### Symbol.toStringTag


### Symbol.unscopables


# Set and Map data structure
## Set
Since ES6, JavaScript provides a new data structure Set. It is similar as Array, but its member must be unique. 
```javascript
const s = new Set();

[2, 3, 5, 4, 5, 2, 2].forEach(x => s.add(x));

for (let i of s) {
  console.log(i);
}
// 2 3 5 4
```

Set can accept an array as parameter/input to initialize it. 
```javascript
// example 1:
const set = new Set([1, 2, 3, 4, 4]);
[...set]
// [1, 2, 3, 4]

// example 2:
const items = new Set([1, 2, 3, 4, 5, 5, 5, 5]);
items.size // 5

// example 3:
function divs () {
  return [...document.querySelectorAll('div')];
}

const set = new Set(divs());
set.size // 56

// do the same thing as:
divs().forEach(div => set.add(div));
set.size // 56
```

A new way to eliminate duplicated values in an array. 
```javascript
[...new Set(array)]
```

Inside Set, it uses "Same-value equality"(Object.is()) to check if the value is the same, does not use `===`.
```javascript
let set = new Set();
let a = NaN;
let b = NaN;
set.add(a);
set.add(b);
set // Set {NaN}
```

NOTE: two objects always are different(not the same).
```javascript
let set = new Set();

set.add({});
set.size // 1

set.add({});
set.size // 2
```

### Set's instance properties and methods
* Set.prototype.constructor
* Set.prototype.size
* Set.prototype.add(value)
* Set.prototype.delete(value)
* Set.prototype.has(value)
* Set.prototype.clear()

Examples:
```javascript
s.add(1).add(2).add(2);

s.size // 2

s.has(1) // true
s.has(2) // true
s.has(3) // false

s.delete(2);
s.has(2) // false
```

### iterating methods
* keys(), values(), entries()
```javascript
let set = new Set(['red', 'green', 'blue']);

for (let item of set.keys()) {
  console.log(item);
}
// red
// green
// blue

for (let item of set.values()) {
  console.log(item);
}
// red
// green
// blue

for (let item of set.entries()) {
  console.log(item);
}
// ["red", "red"]
// ["green", "green"]
// ["blue", "blue"]
```

Set's default iterator is its values function actually. 
```javascript
Set.prototype[Symbol.iterator] === Set.prototype.values
// true
```

* forEach()
```javascript
let set = new Set([1, 2, 3]);
set.forEach((value, key) => console.log(value * 2) )
// 2
// 4
// 6
```

* iterating on Set
```javascript
let set = new Set(['red', 'green', 'blue']);
let arr = [...set];
// ['red', 'green', 'blue']
```

By using Set, it is very easy to implement collections union, collections intersect and collections difference. 
```javascript
let a = new Set([1, 2, 3]);
let b = new Set([4, 3, 2]);

// union
let union = new Set([...a, ...b]);
// Set {1, 2, 3, 4}

// intersect
let intersect = new Set([...a].filter(x => b.has(x)));
// set {2, 3}

// difference
let difference = new Set([...a].filter(x => !b.has(x)));
// Set {1}
``` 

Updating the set itesef during the interating:
```javascript
// approach #1
let set = new Set([1, 2, 3]);
set = new Set([...set].map(val => val * 2));
// set的值是2, 4, 6

// approach #2
let set = new Set([1, 2, 3]);
set = new Set(Array.from(set, val => val * 2));
// set的值是2, 4, 6
```

## WeakSet
WeakSet is similar as Set, but having two differences:
1. WeakSet can only contain objects
```javascript
const b = [3, 4];
const ws = new WeakSet(b);
// Uncaught TypeError: Invalid value used in weak set(…)
```

2. the members(objects) in WeakSet are all weak references. In other words, GC would not consider the reference between WeakSet and its memebers. Because of this, WeakSet cannot be iterated as you never know how many members it has during the iterating(some member may be GCed). 

### syntax
```javascript
const a = [[1, 2], [3, 4]];
const ws = new WeakSet(a);
// WeakSet {[1, 2], [3, 4]}
```

It has following instance methods:
* WeakSet.prototype.add(value)
* WeakSet.prototype.delete(value)
* WeakSet.prototype.has(value)

```javascript
const ws = new WeakSet();
const obj = {};
const foo = {};

ws.add(window);
ws.add(obj);

ws.has(window); // true
ws.has(foo);    // false

ws.delete(window);
ws.has(window);    // false
```

WeakSet does not have `size` property and cannot be iterated. 
```javascript
ws.size // undefined
ws.forEach // undefined

ws.forEach(function(item){ console.log('WeakSet has ' + item)})
// TypeError: undefined is not a function
```

One usage of WeakSet is to store DOM nodes which can be removed from the document later on. 

Another example:
```javascript
const foos = new WeakSet()
class Foo {
  constructor() {
    foos.add(this)
  }
  method () {
    if (!foos.has(this)) {
      throw new TypeError('Foo.prototype.method can only be invoked in its instance！');
    }
  }
}
```

## Map
### introduction
Essentially, Map is collection for pairs of key and value(Hash structure).  Normally in object, only the string can be used as key, but Map can accept any type of value as key to store any value. 
* Object: string - value
* Map: value - value

```javascript
const m = new Map();
const o = {p: 'Hello World'};

m.set(o, 'content')
m.get(o) // "content"

m.has(o) // true
m.delete(o) // true
m.has(o) // false
```

Map can also accept an Array as parameter, but the array's member should be an key-value array. 
```javascript
const map = new Map([
  ['name', '张三'],
  ['title', 'Author']
]);

map.size // 2
map.has('name') // true
map.get('name') // "张三"
map.has('title') // true
map.get('title') // "Author"
```

Actually, not only array, but also any data structure implementing iterator interface can be parameters. 
```javascript
const set = new Set([
  ['foo', 1],
  ['bar', 2]
]);
const m1 = new Map(set);
m1.get('foo') // 1

const m2 = new Map([['baz', 3]]);
const m3 = new Map(m2);
m3.get('baz') // 3
```

NOTE: different object references will be recognized different key in Map. Indeed, the key is binding to the memory address, as long as the memory addresses are different, they will be treated as two keys. 
```javascript
const map = new Map();

const k1 = ['a'];
const k2 = ['a'];

map
.set(k1, 111)
.set(k2, 222);

map.get(k1) // 111
map.get(k2) // 222
```

If key is primitive value (number, string, boolean), as long as two values are strictly equal(`===`), they are same key.  So +0 and -0 are same key. 
NOTE: boolean `true` and string "true" are differnt key. `undefined` and `null` are different keys.  NaN is not equal NaN but Map treat NaN as one key. 
```javascript
let map = new Map();

map.set(-0, 123);
map.get(+0) // 123

map.set(true, 1);
map.set('true', 2);
map.get(true) // 1

map.set(undefined, 3);
map.set(null, 4);
map.get(undefined) // 3

map.set(NaN, 123);
map.get(NaN) // 123
```

### Instance methods and properties
1. size property
```javascript
const map = new Map();
map.set('foo', true);
map.set('bar', false);

map.size // 2
```

2. set(key, value)
```javascript
const m = new Map();

m.set('edition', 6)        // key is a string
m.set(262, 'standard')     // key is number
m.set(undefined, 'nah')    // key is undefined
```
`set(key, value)` return set itself so it can be chained invocation. 

3. get(key)
```javascript
const m = new Map();

const hello = function() {console.log('hello');};
m.set(hello, 'Hello ES6!') // key is a function

m.get(hello)  // Hello ES6!
```

4. has(key)
```javascript
const m = new Map();

m.set('edition', 6);
m.set(262, 'standard');
m.set(undefined, 'nah');

m.has('edition')     // true
m.has('years')       // false
m.has(262)           // true
m.has(undefined)     // true
```

5. delete(key)
```javascript
const m = new Map();
m.set(undefined, 'nah');
m.has(undefined)     // true

m.delete(undefined)
m.has(undefined)       // false
```

6. clear()
```javascript
let map = new Map();
map.set('foo', true);
map.set('bar', false);

map.size // 2
map.clear()
map.size // 0
```

### Interating methods
* keys()
* values()
* entries()
* forEach()

NOTE: Map's iterator interface is deployed on `entries` method. 
```javascript
map[Symbol.iterator] === map.entries
// true
```
Map -> Array:
```javascript
const map = new Map([
  [1, 'one'],
  [2, 'two'],
  [3, 'three'],
]);

[...map.keys()]
// [1, 2, 3]

[...map.values()]
// ['one', 'two', 'three']

[...map.entries()]
// [[1,'one'], [2, 'two'], [3, 'three']]

[...map]
// [[1,'one'], [2, 'two'], [3, 'three']]
```

Map's iterating by `forEach`
```javascript
map.forEach(function(value, key, map) {
  console.log("Key: %s, Value: %s", key, value);
});
```

### Conversion among differnt data structures
1. Map -> Array
```javascript
const myMap = new Map()
  .set(true, 7)
  .set({foo: 3}, ['abc']);
[...myMap]
// [ [ true, 7 ], [ { foo: 3 }, [ 'abc' ] ] ]
```

2. Array -> Map
```javascript
new Map([
  [true, 7],
  [{foo: 3}, ['abc']]
])
// Map {
//   true => 7,
//   Object {foo: 3} => ['abc']
// }
```

3. Map -> Object
If all keys are string in Map, then it can be converted to object. 
```javascript
function strMapToObj(strMap) {
  let obj = Object.create(null);
  for (let [k,v] of strMap) {
    obj[k] = v;
  }
  return obj;
}

const myMap = new Map()
  .set('yes', true)
  .set('no', false);
strMapToObj(myMap)
// { yes: true, no: false }
```

4. Object -> Map
```javascript
function objToStrMap(obj) {
  let strMap = new Map();
  for (let k of Object.keys(obj)) {
    strMap.set(k, obj[k]);
  }
  return strMap;
}

objToStrMap({yes: true, no: false})
// Map {"yes" => true, "no" => false}
```

5. Map -> JSON
If keys are all string, then 
```javascript
function strMapToJson(strMap) {
  return JSON.stringify(strMapToObj(strMap));
}

let myMap = new Map().set('yes', true).set('no', false);
strMapToJson(myMap)
// '{"yes":true,"no":false}'
```

If Map has non-string keys, then:
```javascript
function mapToArrayJson(map) {
  return JSON.stringify([...map]);
}

let myMap = new Map().set(true, 7).set({foo: 3}, ['abc']);
mapToArrayJson(myMap)
// '[[true,7],[{"foo":3},["abc"]]]'
```

6. JSON -> Map
Normally, all keys are string in JSON:
```javascript
function jsonToStrMap(jsonStr) {
  return objToStrMap(JSON.parse(jsonStr));
}

jsonToStrMap('{"yes": true, "no": false}')
// Map {'yes' => true, 'no' => false}
```

One exceptional case is the JSON is an Array and its member is also an Array with two members:
```javascript
function jsonToMap(jsonStr) {
  return new Map(JSON.parse(jsonStr));
}

jsonToMap('[[true,7],[{"foo":3},["abc"]]]')
// Map {true => 7, Object {foo: 3} => ['abc']}
```

## WeakMap
WeakMap is the simiar as Map, but with two differences:
1. It only accepts object as key (except null). 
```javascript
const map = new WeakMap();
map.set(1, 2)
// TypeError: 1 is not an object!
map.set(Symbol(), 2)
// TypeError: Invalid value used as weak map key
map.set(null, 2)
// TypeError: Invalid value used as weak map key
```

2. The keys pointing to the objects can be collected by GC. 
One usage of WeakMap is to store DOM nodes and do not need to care about clear them to avoid memory leak. 
```javascript
const wm = new WeakMap();

const element = document.getElementById('example');

wm.set(element, 'some information');
wm.get(element) // "some information"
```

NOTE: the weak reference is for key, not for the value. 
```javascript
const wm = new WeakMap();
let key = {};
let obj = {foo: 1};

wm.set(key, obj);
obj = null;
wm.get(key)
// Object {foo: 1}
```

### WeakMap syntax
The same as WeakSet, WeakMap does not have `size` property, `clear` method and iterating methods. 
```javascript
const wm = new WeakMap();

// no size、forEach、clear 
wm.size // undefined
wm.forEach // undefined
wm.clear // undefined
```

### the usage of WeakMap
Storing DOM as keys:
```javascript
let myElement = document.getElementById('logo');
let myWeakmap = new WeakMap();

myWeakmap.set(myElement, {timesClicked: 0});

myElement.addEventListener('click', function() {
  let logoData = myWeakmap.get(myElement);
  logoData.timesClicked++;
}, false);
```

Another usage is to register listener object in WeakMap. 
```javascript
const listener = new WeakMap();

listener.set(element1, handler1);
listener.set(element2, handler2);

element1.addEventListener('click', listener.get(element1), false);
element2.addEventListener('click', listener.get(element2), false);
```
Once the DOM elements disappeared, the bound listeners are gone as well. 

WeakMap is also can be used to deploy private properties.
```javascript
const _counter = new WeakMap();
const _action = new WeakMap();

class Countdown {
  constructor(counter, action) {
    _counter.set(this, counter);
    _action.set(this, action);
  }
  dec() {
    let counter = _counter.get(this);
    if (counter < 1) return;
    counter--;
    _counter.set(this, counter);
    if (counter === 0) {
      _action.get(this)();
    }
  }
}

const c = new Countdown(2, () => console.log('DONE'));

c.dec()
c.dec()
// DONE
```
@TODO to be continued



# References
* http://es6.ruanyifeng.com/#docs/let
* http://es6.ruanyifeng.com/#docs/destructuring
* http://es6.ruanyifeng.com/#docs/string
* http://es6.ruanyifeng.com/#docs/object
* http://es6.ruanyifeng.com/#docs/symbol
* http://es6.ruanyifeng.com/#docs/set-map


# Exercise
Try [ES6_part1 Exercise](Medium/Exercise/ES6_part1.js) here to grab all key points. 

# Presentation & Video
See [ES6_part1  presentation](https://sharenet-ims.int.net.nokia.com/livelink/livelink?func=ll&objaction=overview&objid=555732978) for the course presentation. 
See [ES6_part1 Video](https://sharenet-ims.int.net.nokia.com/livelink/livelink?func=ll&objaction=overview&objid=555734003) for the course video. 

