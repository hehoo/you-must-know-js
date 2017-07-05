# Iterator
Iterator is to provide a mechanism to access/iterate members/data from different data structures. Any data structure can iterate all its members in order if `Iterator` interface is deployed. 
The main purposes/usages of Iterator:
1. Providing an unique interface for accessing members
2. Members can be sorted in certain order
3. The basis of `for...of` loop command

The implementation of Iterator can be simulated as following:
1. Creating a pointer which points to the start position of the data structure
2. The pointer would point to the first member when calling `next` method firstly
3. The pointer would point to the second member when calling `next` method secondly
4. Repeat calling `next` to point to next member until ending with the end position. 

See an example which simulates the implementation of Iterator
```javascript
var it = makeIterator(['a', 'b']);

it.next() // { value: "a", done: false }
it.next() // { value: "b", done: false }
it.next() // { value: undefined, done: true }

function makeIterator(array) {
  var nextIndex = 0;
  return {
    next: function() {
      return nextIndex < array.length ?
        {value: array[nextIndex++], done: false} :
        {value: undefined, done: true};
    }
  };
}
```

`next` returns an object representing the information of members, it contains `value` and `done` properties which `value` represents the current member and `done` represents whether it is able to iterate to next member. 

In ES6, some of native data structures(e.g. array) have implemented Iterator interface. In other words, those data structures can be iterated by `for...of`.  The native implementation of Iterator is deployed at `Symbol.iterator` property which would return a iterator object when calling it.

Here is the specification for Iterable, Iterator and next in TypeScript
```javascript
interface Iterable {
  [Symbol.iterator]() : Iterator,
}

interface Iterator {
  next(value?: any) : IterationResult,
}

interface IterationResult {
  value: any,
  done: boolean,
}
```

## The default iterator interface - Symbol.iterator
ES6 specifies that the default Iterator interface deploys at the property `Symbol.iterator`. 
```javascript
const obj = {
  [Symbol.iterator] : function () {
    return {
      next: function () {
        return {
          value: 1,
          done: true
        };
      }
    };
  }
};
```

In ES6, there are three data structures having Iterator interface
* Array
* Some of array-like objects
* Set and Map

```javascript
let arr = ['a', 'b', 'c'];
let iter = arr[Symbol.iterator]();

iter.next() // { value: 'a', done: false }
iter.next() // { value: 'b', done: false }
iter.next() // { value: 'c', done: false }
iter.next() // { value: undefined, done: true }
```

If a object needs to be iterated by `for...of`, the object needs to deploy its iterator implementation in `Symbol.iterator` property(Deploying in prototype is also OK).
```javascript
class RangeIterator {
  constructor(start, stop) {
    this.value = start;
    this.stop = stop;
  }

  [Symbol.iterator]() { return this; }

  next() {
    var value = this.value;
    if (value < this.stop) {
      this.value++;
      return {done: false, value: value};
    }
    return {done: true, value: undefined};
  }
}

function range(start, stop) {
  return new RangeIterator(start, stop);
}

for (var value of range(0, 3)) {
  console.log(value);
}
```

Another example to simulate pointer structure
```javascript
function Obj(value) {
  this.value = value;
  this.next = null;
}

Obj.prototype[Symbol.iterator] = function() {
  var iterator = {
    next: next
  };

  var current = this;

  function next() {
    if (current) {
      var value = current.value;
      current = current.next;
      return {
        done: false,
        value: value
      };
    } else {
      return {
        done: true
      };
    }
  }
  return iterator;
}

var one = new Obj(1);
var two = new Obj(2);
var three = new Obj(3);

one.next = two;
two.next = three;

for (var i of one){
  console.log(i);
}
// 1
// 2
// 3
```

For array-like object, there is an easy way to implement it is to refer to the `Symbol.iterator` of Array directly. 
```javascript
NodeList.prototype[Symbol.iterator] = Array.prototype[Symbol.iterator];
// OR
NodeList.prototype[Symbol.iterator] = [][Symbol.iterator];

[...document.querySelectorAll('div')] // can be iterated by spread operator now...
```
Another example:
```javascript
let iterable = {
  0: 'a',
  1: 'b',
  2: 'c',
  length: 3,
  [Symbol.iterator]: Array.prototype[Symbol.iterator]
};
for (let item of iterable) {
  console.log(item); // 'a', 'b', 'c'
}
```

## the scenarios of invoking Iterator interface
Besides `for...of` there are still some scenarios would invoke `Symbol.iterato` implicitly. 
1. Destructuring Assignment
```javascript
let set = new Set().add('a').add('b').add('c');

let [x,y] = set;
// x='a'; y='b'

let [first, ...rest] = set;
// first='a'; rest=['b','c'];
```

2. Spread operator
```javascript
// example 1
var str = 'hello';
[...str] //  ['h','e','l','l','o']

// example 2
let arr = ['b', 'c'];
['a', ...arr, 'd']
// ['a', 'b', 'c', 'd']
```

Indeed, any data structure implementing Iterator interface can be transformed into an array y spread operator 
```javascript
let arr = [...iterable];
```

3. yield*
yield* is followed by an iterable data structure, it would call Iterator interface automatically. 
```javascript
let generator = function* () {
  yield 1;
  yield* [2,3,4];
  yield 5;
};

var iterator = generator();

iterator.next() // { value: 1, done: false }
iterator.next() // { value: 2, done: false }
iterator.next() // { value: 3, done: false }
iterator.next() // { value: 4, done: false }
iterator.next() // { value: 5, done: false }
iterator.next() // { value: undefined, done: true }
```

4. Other scenarios
* `for...of`
* `Array.from`
* `Map(), Set(), WeakMap, WeakSet() (e.g. new Map([['a', 1], ['b', 2]]))`
* `Promise.all()`
* `Promise.race()`

## string's Iterator interface
String has native Iterator interface .
```javascript
var someString = "hi";
typeof someString[Symbol.iterator]
// "function"

var iterator = someString[Symbol.iterator]();

iterator.next()  // { value: "h", done: false }
iterator.next()  // { value: "i", done: false }
iterator.next()  // { value: undefined, done: true }
```

Of course, you can override native `Symbol.iterator` in order to update the behaviors of the iterator
```javascript
var str = new String("hi");

[...str] // ["h", "i"]

str[Symbol.iterator] = function() {
  return {
    next: function() {
      if (this._first) {
        this._first = false;
        return { value: "bye", done: false };
      } else {
        return { done: true };
      }
    },
    _first: true
  };
};

[...str] // ["bye"]
str // "hi"
```

## Iterator and Generator
The easiest way to implement `Symbol.iterator` is to use Generator function. This will be covered in later. 
```javascript
var myIterable = {};

myIterable[Symbol.iterator] = function* () {
  yield 1;
  yield 2;
  yield 3;
};
[...myIterable] // [1, 2, 3]

// OR

let obj = {
  * [Symbol.iterator]() {
    yield 'hello';
    yield 'world';
  }
};

for (let x of obj) {
  console.log(x);
}
// hello
// world
```

## Iterator's return() and throw()
There are two optional methods can be implemented in iterator object. 
`return` is used to quit the loop in advance due to error or `break`, `continue` statement. 
 ```javascript
 function readLinesSync(file) {
   return {
     next() {
       if (file.isAtEndOfFile()) {
         file.close();
         return { done: true };
       }
     },
     return() {
       file.close();
       return { done: true };
     },
   };
 }
 ```

`throw` is usually used in Generator function. Will be talked later. 

## for...of loop
`for...of` can be used for any data structure which deploys `Symbol.iterator` property. 

### Array
```javascript
const arr = ['red', 'green', 'blue'];

for(let v of arr) {
  console.log(v); // red green blue
}

const obj = {};
obj[Symbol.iterator] = arr[Symbol.iterator].bind(arr);

for(let v of obj) {
  console.log(v); // red green blue
}
````
Consider the difference with `for...in`. 
```javascript
let arr = [3, 5, 7];
arr.foo = 'hello';

for (let i in arr) {
  console.log(i); // "0", "1", "2", "foo"
}

for (let i of arr) {
  console.log(i); //  "3", "5", "7"
}
````

### Set and Map
```javascript
var engines = new Set(["Gecko", "Trident", "Webkit", "Webkit"]);
for (var e of engines) {
  console.log(e);
}
// Gecko
// Trident
// Webkit

var es6 = new Map();
es6.set("edition", 6);
es6.set("committee", "TC39");
es6.set("standard", "ECMA-262");
for (var [name, value] of es6) {
  console.log(name + ": " + value);
}
// edition: 6
// committee: TC39
// standard: ECMA-262
```

### entries(), keys(), values()
Like ES6's Array, Set and Map, they deploy three methods can return a new iterator object. 
```javascript
let arr = ['a', 'b', 'c'];
for (let pair of arr.entries()) {
  console.log(pair);
}
// [0, 'a']
// [1, 'b']
// [2, 'c']
```


### array-like object
```javascript
// 字符串
let str = "hello";

for (let s of str) {
  console.log(s); // h e l l o
}

// DOM NodeList对象
let paras = document.querySelectorAll("p");

for (let p of paras) {
  p.classList.add("test");
}

// arguments对象
function printArgs() {
  for (let x of arguments) {
    console.log(x);
  }
}
printArgs('a', 'b');
// 'a'
// 'b'
```
NOTE: For string, `for...of` can identify 32 bit UTF-16 character. 

### object
For normal object, `for...of` cannot be used, you have to deploy your own Iterator interface before using it. 
In order to solve it, one solution is to use `Object.keys` method. 
```javascript
for (var key of Object.keys(someObject)) {
  console.log(key + ': ' + someObject[key]);
}
```

Another solution is to use Generator to wrap the object again. 
```javascript
function* entries(obj) {
  for (let key of Object.keys(obj)) {
    yield [key, obj[key]];
  }
}

for (let [key, value] of entries(obj)) {
  console.log(key, '->', value);
}
```

### Compare with other iterating ways
The advantages of `for...of` are:
1. Concise as `for...in`, but without disadvantages of it 
2. Different with `forEach`, it can be used with `break`, `continue` and `return`
3. Providing unique interface for all data structures


# Generator



# Decorator
Decorate is actually a function to modify class or class's methods. Decorate was introduced since ES2017. 

## Class's Decorator
See an example:
```javascript
@testable
class MyTestableClass {
  // ...
}

function testable(target) {
  target.isTestable = true;
}

MyTestableClass.isTestable // true
```

It actually does:
```javascript
@decorator
class A {}

// the same as

class A {}
A = decorator(A) || A;
```
But be noted that it happened during compiling, not during execution. In other words, the decorator is a function could be run in compile period.

The first argument is `target` which is the class to be modified. 
```javascript
function testable(target) {
  // ...
}
```

Of course, you can wrap the function with given additional parameters. 
```javascript
function testable(isTestable) {
  return function(target) {
    target.isTestable = isTestable;
  }
}

@testable(true)
class MyTestableClass {}
MyTestableClass.isTestable // true

@testable(false)
class MyClass {}
MyClass.isTestable // false
```

If you want to modify instance, you can do it through `prototype` object. 
```javascript
function testable(target) {
  target.prototype.isTestable = true;
}

@testable
class MyTestableClass {}

let obj = new MyTestableClass();
obj.isTestable // true
```

Take a look at another example:
```javascript
// mixins.js
export function mixins(...list) {
  return function (target) {
    Object.assign(target.prototype, ...list)
  }
}

// main.js
import { mixins } from './mixins'

const Foo = {
  foo() { console.log('foo') }
};

@mixins(Foo)
class MyClass {}

let obj = new MyClass();
obj.foo() // 'foo'
```

You achieve it by only using `Object.assign()` of course. 
```javascript
const Foo = {
  foo() { console.log('foo') }
};

class MyClass {}

Object.assign(MyClass.prototype, Foo);

let obj = new MyClass();
obj.foo() // 'foo'
```

## Method's Decorator
Decorator can also modify methods of class. 
```javascript
class Person {
  @readonly
  name() { return `${this.first} ${this.last}` }
}
```

In this case, decorator accepts three parameters: `target`, the property to be modified and the property's descriptor object. 
```javascript
function readonly(target, name, descriptor){
  // descriptor original values are:
  // {
  //   value: specifiedFunction,
  //   enumerable: false,
  //   configurable: true,
  //   writable: true
  // };
  descriptor.writable = false;
  return descriptor;
}

readonly(Person.prototype, 'name', descriptor);
// similiar as:
Object.defineProperty(Person.prototype, 'name', descriptor);
```

See another example:
```javascript
class Person {
  @nonenumerable
  get kidCount() { return this.children.length; }
}

function nonenumerable(target, name, descriptor) {
  descriptor.enumerable = false;
  return descriptor;
}
```

The below example `@log` can output logs:
```javascript
class Math {
  @log
  add(a, b) {
    return a + b;
  }
}

function log(target, name, descriptor) {
  var oldValue = descriptor.value;

  descriptor.value = function() {
    console.log(`Calling "${name}" with`, arguments);
    return oldValue.apply(null, arguments);
  };

  return descriptor;
}

const math = new Math();

// passed parameters should get logged now
math.add(2, 4);
```

As decorator can be self-explained, so it is so easy to know what the class does or what the property does. For example:
```javascript
@testable
class Person {
  @readonly
  @nonenumerable
  name() { return `${this.first} ${this.last}` }
}
```

If there are more than two decorators, the decorators will be compiled from outside to inside, but executed from inside to outside. 
```javascript
function dec(id){
    console.log('evaluated', id);
    return (target, property, descriptor) => console.log('executed', id);
}

class Example {
    @dec(1)
    @dec(2)
    method(){}
}
// evaluated 1
// evaluated 2
// executed 2
// executed 1
```

NOTE: decorator is very important tool in the future for doing static code checking. 

## Why decorator cannot be used on function
The root cause is that function declaration can be hoisted. It is also can be achieved by using advanced function. 
```javascript
function doSomething(name) {
  console.log('Hello, ' + name);
}

function loggingDecorator(wrapped) {
  return function() {
    console.log('Starting');
    const result = wrapped.apply(this, arguments);
    console.log('Finished');
    return result;
  }
}

const wrapped = loggingDecorator(doSomething);
```


## core-decorators.js
[core-decorators.js](https://github.com/jayphelps/core-decorators.js) is a third party library to provide frequent-used decorators. 
1. @autobind
```javascript
import { autobind } from 'core-decorators';

class Person {
  @autobind
  getPerson() {
    return this;
  }
}

let person = new Person();
let getPerson = person.getPerson;

getPerson() === person;
// true
```

2. @readonly
```javascript
import { readonly } from 'core-decorators';

class Meal {
  @readonly
  entree = 'steak';
}

var dinner = new Meal();
dinner.entree = 'salmon';
// Cannot assign to read only property 'entree' of [object Object]
```

3. @override
```javascript
import { override } from 'core-decorators';

class Parent {
  speak(first, second) {}
}

class Child extends Parent {
  @override
  speak() {}
  // SyntaxError: Child#speak() does not properly override Parent#speak(first, second)
}

// or

class Child extends Parent {
  @override
  speaks() {}
  // SyntaxError: No descriptor matching Child#speaks() was found on the prototype chain.
  //
  //   Did you mean "speak"?
}
```

4. @deprecated
```javascript
import { deprecate } from 'core-decorators';

class Person {
  @deprecate
  facepalm() {}

  @deprecate('We stopped facepalming')
  facepalmHard() {}

  @deprecate('We stopped facepalming', { url: 'http://knowyourmeme.com/memes/facepalm' })
  facepalmHarder() {}
}

let person = new Person();

person.facepalm();
// DEPRECATION Person#facepalm: This function will be removed in future versions.

person.facepalmHard();
// DEPRECATION Person#facepalmHard: We stopped facepalming

person.facepalmHarder();
// DEPRECATION Person#facepalmHarder: We stopped facepalming
//
//     See http://knowyourmeme.com/memes/facepalm for more details.
//
```

5. @suppressWarnings
```javascript
import { suppressWarnings } from 'core-decorators';

class Person {
  @deprecated
  facepalm() {}

  @suppressWarnings
  facepalmWithoutWarning() {
    this.facepalm();
  }
}

let person = new Person();

person.facepalmWithoutWarning();
// no warning is logged
```

## auto publish events
An useful application of decorator is to publish events automatically. 
```javascript
import postal from "postal/lib/postal.lodash";

export default function publish(topic, channel) {
  return function(target, name, descriptor) {
    const fn = descriptor.value;

    descriptor.value = function() {
      let value = fn.apply(this, arguments);
      postal.channel(channel || target.channel || "/").publish(topic, value);
    };
  };
}
```
To use it:
```javascript
import publish from "path/to/decorators/publish";

class FooComponent {
  @publish("foo.some.message", "component")
  someMethod() {
    return {
      my: "data"
    };
  }
  @publish("foo.some.other")
  anotherMethod() {
    // ...
  }
}
```

## Mixin
Below is a common mixin decorator:
```javascript
export function mixins(...list) {
  return function (target) {
    Object.assign(target.prototype, ...list);
  };
}
```
To use it:
```javascript
import { mixins } from './mixins';

const Foo = {
  foo() { console.log('foo') }
};

@mixins(Foo)
class MyClass {}

let obj = new MyClass();
obj.foo() // "foo"
```

Another approach is to create a mixin with extension between classes:
```javascript
let MyMixin = (superclass) => class extends superclass {
  foo() {
    console.log('foo from MyMixin');
  }
};
```
To use it:
```javascript
class MyClass extends MyMixin(MyBaseClass) {
  /* ... */
}

let c = new MyClass();
c.foo(); // "foo from MyMixin"
```

If you want to "mixin" multiple methods, you can create multiple mixins:
```javascript
class MyClass extends Mixin1(Mixin2(MyBaseClass)) {
  /* ... */
}
```

An example:
```javascript
let Mixin1 = (superclass) => class extends superclass {
  foo() {
    console.log('foo from Mixin1');
    if (super.foo) super.foo();
  }
};

let Mixin2 = (superclass) => class extends superclass {
  foo() {
    console.log('foo from Mixin2');
    if (super.foo) super.foo();
  }
};

class S {
  foo() {
    console.log('foo from S');
  }
}

class C extends Mixin1(Mixin2(S)) {
  foo() {
    console.log('foo from C');
    super.foo();
  }
}
```

The result to use it
```javascript
new C().foo()
// foo from C
// foo from Mixin1
// foo from Mixin2
// foo from S
```

## Trait
Trait is a decorator which is similar as mixin, but providing more functions. Below examples use [traits-decorator](https://github.com/CocktailJS/traits-decorator) as examples. It can accept objects as well as ES6 class. 
```javascript
import { traits } from 'traits-decorator';

class TFoo {
  foo() { console.log('foo') }
}

const TBar = {
  bar() { console.log('bar') }
};

@traits(TFoo, TBar)
class MyClass { }

let obj = new MyClass();
obj.foo() // foo
obj.bar() // bar
```
Trait doesn't allow to mixin methods with same names. 
```javascript
import { traits } from 'traits-decorator';

class TFoo {
  foo() { console.log('foo') }
}

const TBar = {
  bar() { console.log('bar') },
  foo() { console.log('foo') }
};

@traits(TFoo, TBar)
class MyClass { }
// 报错
// throw new Error('Method named: ' + methodName + ' is defined twice.');
//        ^
// Error: Method named: foo is defined twice.
```

An approach is to exclude the method with conflict name:
```javascript
import { traits, excludes } from 'traits-decorator';

class TFoo {
  foo() { console.log('foo') }
}

const TBar = {
  bar() { console.log('bar') },
  foo() { console.log('foo') }
};

@traits(TFoo, TBar::excludes('foo'))
class MyClass { }

let obj = new MyClass();
obj.foo() // foo
obj.bar() // bar
```

Alternatively to raise alias for the method:
```javascript
import { traits, alias } from 'traits-decorator';

class TFoo {
  foo() { console.log('foo') }
}

const TBar = {
  bar() { console.log('bar') },
  foo() { console.log('foo') }
};

@traits(TFoo, TBar::alias({foo: 'aliasFoo'}))
class MyClass { }

let obj = new MyClass();
obj.foo() // foo
obj.aliasFoo() // foo
obj.bar() // bar
```

## Babel support
Currently, Babel transpiler has already supported Decorator. 
```javascript
$ npm install babel-core babel-plugin-transform-decorators
```

There is a [online transpiler](https://babeljs.io/repl/) with tick experimental option that can support decorator transpiling. 

# Generator
Generator is a new approach to ease asynchronous programming. Its syntax is quite different with normal functions. 
The generator can be recognized as:
1. state machine as it encapsulates states internally
2. iterator as it is the function for generating iterator object

Take an example to see how the generator function looking like:
```javascript
function* helloWorldGenerator() {
  yield 'hello';
  yield 'world';
  return 'ending';
}

var hw = helloWorldGenerator();
```

The biggest difference with normal function is the generator function will not be executed, but an iterator object. 
Every time invoking `next` method, the iterator object would move to next state. When it meets `yield`, it would be paused, until `next` is called to resume it. 
```javascript
hw.next()
// { value: 'hello', done: false }

hw.next()
// { value: 'world', done: false }

hw.next()
// { value: 'ending', done: true }

hw.next()
// { value: undefined, done: true }
```

## yield expression
The `yield` represents pause which can pause the execution of the function. 

When calling `next` on iterator object, it would:
1. When meets `yield`, pausing the execution of the function and taking the expression after the `yield` as the value of `value` property of returned object
2. Calling next `next` method, continuing running until reach to next `yield`
3. If no `yield` any more, run the function till the end. if there is a `return` statement, the expression after the `return` will be taken as the value of `value` property of returned object.
4. If there is no `return` statement, the value property's value would be `undefined`

NOTE: `yield` can be ONLY used in generator function. 

```javascript
var arr = [1, [[2, 3], 4], [5, 6]];

var flat = function* (a) {
  a.forEach(function (item) {
    if (typeof item !== 'number') {
      yield* flat(item);
    } else {
      yield item;
    }
  });
};

for (var f of flat(arr)){
  console.log(f);
}
```
The above example would throw an exception as the `yield` is used in a normal function which is a parameter of `forEach`. 

NOTE: if the `yield` is used in another expression, it must be put in a parentheses. 
```javascript
function* demo() {
  console.log('Hello' + yield); // SyntaxError
  console.log('Hello' + yield 123); // SyntaxError

  console.log('Hello' + (yield)); // OK
  console.log('Hello' + (yield 123)); // OK
}
```

When the `yield` is used as parameter or the right value of assignment. the parentheses can be ignored.
```javascript
function* demo() {
  foo(yield 'a', yield 'b'); // OK
  let input = yield; // OK
}
```

## working as an iterator 
As Generator is the function for creating iterator object, so it can be used as the implementation for `Symbol.itertor` property. 
```javascript
var myIterable = {};
myIterable[Symbol.iterator] = function* () {
  yield 1;
  yield 2;
  yield 3;
};

[...myIterable] // [1, 2, 3]
```

The returned iterator object from generator function has also `Symbol.iterator` property, which returns the iterator object itself after running it. 
```javascript
function* gen(){
  // some code
}

var g = gen();

g[Symbol.iterator]() === g
// true
```

## the next method
`yield` does not have returned value or always returns `undefined`, but `next` method can have a parameter which can be used as the previous 's `yield` return value.
```javascript
function* f() {
  for(var i = 0; true; i++) {
    var reset = yield i;
    if(reset) { i = -1; }
  }
}

var g = f();

g.next() // { value: 0, done: false }
g.next() // { value: 1, done: false }
g.next(true) // { value: 0, done: false }
```

With this function, it is able to change the behavior of the function by injecting different values. 
```javascript
function* foo(x) {
  var y = 2 * (yield (x + 1));
  var z = yield (y / 3);
  return (x + y + z);
}

var a = foo(5);
a.next() // Object{value:6, done:false}
a.next() // Object{value:NaN, done:false}
a.next() // Object{value:NaN, done:true}

var b = foo(5);
b.next() // { value:6, done:false }
b.next(12) // { value:8, done:false }
b.next(13) // { value:42, done:true }
```

NOTE: the parameter cannot be given in the first time of calling `next` method. If you want to do this, an approach is to wrap the generator as below:
```javascript
function wrapper(generatorFunction) {
  return function (...args) {
    let generatorObject = generatorFunction(...args);
    generatorObject.next();
    return generatorObject;
  };
}

const wrapped = wrapper(function* () {
  console.log(`First input: ${yield}`);
  return 'DONE';
});

wrapped().next('hello!')
// First input: hello!
```

## for...of 
`for...of` is able to loop the `iterator` object that is generated by Generator function automatically without calling `next` method manually. 
```javascript
function *foo() {
  yield 1;
  yield 2;
  yield 3;
  yield 4;
  yield 5;
  return 6;
}

for (let v of foo()) {
  console.log(v);
}
// 1 2 3 4 5
```

An example to generate fibonacci sequence. 
```javascript
function* fibonacci() {
  let [prev, curr] = [0, 1];
  for (;;) {
    [prev, curr] = [curr, prev + curr];
    yield curr;
  }
}

for (let n of fibonacci()) {
  if (n > 1000) break;
  console.log(n);
}
```

Besides `for...of`, spread operator `...`, destructuring assignment and `Array.from` invoke iterator interface internally actually. 
```javascript
function* numbers () {
  yield 1
  yield 2
  return 3
  yield 4
}

// spread operator
[...numbers()] // [1, 2]

// Array.from method
Array.from(numbers()) // [1, 2]

// destructuring assignment
let [x, y] = numbers();
x // 1
y // 2

// for...of loop
for (let n of numbers()) {
  console.log(n)
}
// 1
// 2
```

## Generator.prototype.throw()
There is a `throw` method in returned iterator object from Generator function, which can throw an exception which can be caught inside the generator function. 
```javascript
var g = function* () {
  try {
    yield;
  } catch (e) {
    console.log('caught inside', e);
  }
};

var i = g();
i.next();

try {
  i.throw('a');
  i.throw('b');
} catch (e) {
  console.log('caught outside', e);
}
// caught inside a
// caught outside b
```

`throw` can also accept an argument, which can be received by `catch` statement. 
```javascript
var g = function* () {
  try {
    yield;
  } catch (e) {
    console.log(e);
  }
};

var i = g();
i.next();
i.throw(new Error('going wrong！'));
// Error: going wrong！(…)
```

If there is no `try...catch` inside the generator, the error thrown from `throw` method will be caught by `try...catch` outside. 
```javascript
var g = function* () {
  while (true) {
    yield;
    console.log('inside', e);
  }
};

var i = g();
i.next();

try {
  i.throw('a');
  i.throw('b');
} catch (e) {
  console.log('outside', e);
}
// outside a
```

The program would be terminated if there is no `try...catch` at all.
```javascript
var gen = function* gen(){
  yield console.log('hello');
  yield console.log('world');
}

var g = gen();
g.next();
g.throw();
// hello
// Uncaught undefined
```

NOTE: after the error thrown from `throw` being caught, next `yeild` will be invoked automatically. In other word, it would run `next` once. 
```javascript
var gen = function* gen(){
  try {
    yield console.log('a');
  } catch (e) {
    // ...
  }
  yield console.log('b');
  yield console.log('c');
}

var g = gen();
g.next() // a
g.throw() // b
g.next() // c
```

Of course, the error thrown from generator function inside can be caught from outside. 
```javascript
function* foo() {
  var x = yield 3;
  var y = x.toUpperCase();
  yield y;
}

var it = foo();

it.next(); // { value:3, done:false }

try {
  it.next(42);
} catch (err) {
  console.log(err);
}
```
See another complex example:
```javascript
function* g() {
  yield 1;
  console.log('throwing an exception');
  throw new Error('generator broke!');
  yield 2;
  yield 3;
}

function log(generator) {
  var v;
  console.log('starting generator');
  try {
    v = generator.next();
    console.log('1st time to run next', v);
  } catch (err) {
    console.log('caught error', v);
  }
  try {
    v = generator.next();
    console.log('2nd time to run next', v);
  } catch (err) {
    console.log('caught error', v);
  }
  try {
    v = generator.next();
    console.log('3rd time to run next', v);
  } catch (err) {
    console.log('caught error', v);
  }
  console.log('caller done');
}

log(g());
// starting generator
// 1st time to run next方法 { value: 1, done: false }
// throwing an exception
// caught error { value: 1, done: false }
// 3rd time to run next { value: undefined, done: true }
// caller done
```

## Generator.prototype.return()
There is still a `return` method similar in returned iterator object which is to terminate the loop of Generator function. 
```javascript
function* gen() {
  yield 1;
  yield 2;
  yield 3;
}

var g = gen();

g.next()        // { value: 1, done: false }
g.return('foo') // { value: "foo", done: true }
g.next()        // { value: undefined, done: true }
```

If there is `try...finally` in Generator function, the `return` method would postpone util the code inside `finally` get executed. 
```javascript
function* numbers () {
  yield 1;
  try {
    yield 2;
    yield 3;
  } finally {
    yield 4;
    yield 5;
  }
  yield 6;
}
var g = numbers();
g.next() // { value: 1, done: false }
g.next() // { value: 2, done: false }
g.return(7) // { value: 4, done: false }
g.next() // { value: 5, done: false }
g.next() // { value: 7, done: true }
```

## yield* expression
See an example:
```javascript
function* foo() {
  yield 'a';
  yield 'b';
}

function* bar() {
  yield 'x';
  foo();
  yield 'y';
}

for (let v of bar()){
  console.log(v);
}
// "x"
// "y"
```
As you can see, invoking a Generator function inside a Generator function does nothing. If you want to execute a Generator inside a Generator, you have to use `yield*` expression.
```javascript
function* bar() {
  yield 'x';
  yield* foo();
  yield 'y';
}

// the same as
function* bar() {
  yield 'x';
  yield 'a';
  yield 'b';
  yield 'y';
}

// the same as
function* bar() {
  yield 'x';
  for (let v of foo()) {
    yield v;
  }
  yield 'y';
}

for (let v of bar()){
  console.log(v);
}
// "x"
// "a"
// "b"
// "y"
```

See another example:
```javascript
function* inner() {
  yield 'hello!';
}

function* outer1() {
  yield 'open';
  yield inner();
  yield 'close';
}

var gen = outer1()
gen.next().value // "open"
gen.next().value // return an iterator object...
gen.next().value // "close"

function* outer2() {
  yield 'open'
  yield* inner()
  yield 'close'
}

var gen = outer2()
gen.next().value // "open"
gen.next().value // "hello!"
gen.next().value // "close"
```

To understand `yield *` expression
```javascript
let delegatedIterator = (function* () {
  yield 'Hello!';
  yield 'Bye!';
}());

let delegatingIterator = (function* () {
  yield 'Greetings!';
  yield* delegatedIterator;
  yield 'Ok, bye.';
}());

for(let value of delegatingIterator) {
  console.log(value);
}
// "Greetings!
// "Hello!"
// "Bye!"
// "Ok, bye."
```

```javascript
function* concat(iter1, iter2) {
  yield* iter1;
  yield* iter2;
}

// 等同于

function* concat(iter1, iter2) {
  for (var value of iter1) {
    yield value;
  }
  for (var value of iter2) {
    yield value;
  }
}
```

As array is an iterator object, thus the array following by `yield*` can be iterated. 
```javascript
function* gen(){
  yield* ["a", "b", "c"];
}

gen().next() // { value:"a", done:false }
```

string is also an iterator object. 
```javascript
let read = (function* () {
  yield 'hello';
  yield* 'hello';
})();

read.next().value // "hello"
read.next().value // "h"
```

If there is `return` statement in delegated Generator function, the returned value can be passed to the delegating function. 
```javascript
function *foo() {
  yield 2;
  yield 3;
  return "foo";
}

function *bar() {
  yield 1;
  var v = yield *foo();
  console.log( "v: " + v );
  yield 4;
}

var it = bar();

it.next()
// {value: 1, done: false}
it.next()
// {value: 2, done: false}
it.next()
// {value: 3, done: false}
it.next();
// "v: foo"
// {value: 4, done: false}
it.next()
// {value: undefined, done: true}
```

See another example:
```javascript
function* genFuncWithReturn() {
  yield 'a';
  yield 'b';
  return 'The result';
}
function* logReturned(genObj) {
  let result = yield* genObj;
  console.log(result);
}

[...logReturned(genFuncWithReturn())]
// The result
// 值为 [ 'a', 'b' ]
```

`yield*` expression can be used for fetching nested members of an array. 
```javascript
function* iterTree(tree) {
  if (Array.isArray(tree)) {
    for(let i=0; i < tree.length; i++) {
      yield* iterTree(tree[i]);
    }
  } else {
    yield tree;
  }
}

const tree = [ 'a', ['b', 'c'], ['d', 'e'] ];

for(let x of iterTree(tree)) {
  console.log(x);
}
// a
// b
// c
// d
// e
```

See another more complex example for iterate binary tree:
```javascript
function Tree(left, label, right) {
  this.left = left;
  this.label = label;
  this.right = right;
}

// iterating inorder
// recursing the left and right tree
function* inorder(t) {
  if (t) {
    yield* inorder(t.left);
    yield t.label;
    yield* inorder(t.right);
  }
}

// make a binary tree
function make(array) {
  // if a leaf.
  if (array.length == 1) return new Tree(null, array[0], null);
  return new Tree(make(array[0]), array[1], make(array[2]));
}
let tree = make([[['a'], 'b', ['c']], 'd', [['e'], 'f', ['g']]]);

// iterating the binary tree
var result = [];
for (let node of inorder(tree)) {
  result.push(node);
}

result
// ['a', 'b', 'c', 'd', 'e', 'f', 'g']
```

## Generator function as an object's property
```javascript
let obj = {
  * myGeneratorMethod() {
    ···
  }
};
```

## Generator function's `this`
Generator function returns an iterator object, ES6 specifies that this iterator object is the instance of the Generator function, so it also inherits Generator's prototype methods.
```javascript
function* g() {}

g.prototype.hello = function () {
  return 'hi!';
};

let obj = g();

obj instanceof g // true
obj.hello() // 'hi!'
```

As `g` is not a normal constructor function, it always returns iterator object rather than `this` object, any modificatin/change on `this` won't work.
```javascript
function* g() {
  this.a = 11;
}

let obj = g();
obj.a // 
```
Generator cannot be invoked by `new` operator, if do so it would throw an exception. 
```javascript
function* F() {
  yield this.x = 2;
  yield this.y = 3;
}

new F()
// TypeError: F is not a constructor
```

Is there a way to bind `this` bu also the `next` method can be used? 
```javascript
function* F() {
  this.a = 1;
  yield this.b = 2;
  yield this.c = 3;
}
var obj = {};
var f = F.call(obj);

f.next();  // Object {value: 2, done: false}
f.next();  // Object {value: 3, done: false}
f.next();  // Object {value: undefined, done: true}

obj.a // 1
obj.b // 2
obj.c // 3
```

There is a work around for that:
```javascript
function* F() {
  this.a = 1;
  yield this.b = 2;
  yield this.c = 3;
}
var obj = {};
var f = F.call(obj);

f.next();  // Object {value: 2, done: false}
f.next();  // Object {value: 3, done: false}
f.next();  // Object {value: undefined, done: true}

obj.a // 1
obj.b // 2
obj.c // 3
```

Above, the instance object and iterator object are separate. Is there an approach to combine the iterator object and the `this`?
An approach is to change the `obj` into `F.prototype`.
```javascript
function* F() {
  this.a = 1;
  yield this.b = 2;
  yield this.c = 3;
}
var f = F.call(F.prototype);

f.next();  // Object {value: 2, done: false}
f.next();  // Object {value: 3, done: false}
f.next();  // Object {value: undefined, done: true}

f.a // 1
f.b // 2
f.c // 3
```
Furthermore, the `F` can be changed into a constructor function, then the `new` operator can be used. 
```javascript
function* gen() {
  this.a = 1;
  yield this.b = 2;
  yield this.c = 3;
}

function F() {
  return gen.call(gen.prototype);
}

var f = new F();

f.next();  // Object {value: 2, done: false}
f.next();  // Object {value: 3, done: false}
f.next();  // Object {value: undefined, done: true}

f.a // 1
f.b // 2
f.c // 3
```

## Generator & State machine
Generator is the best structure to implement state machine:
ES5:
```javascript
var ticking = true;
var clock = function() {
  if (ticking)
    console.log('Tick!');
  else
    console.log('Tock!');
  ticking = !ticking;
}
```
Implemented by ES6 Generator:
```javascript
var clock = function* () {
  while (true) {
    console.log('Tick!');
    yield;
    console.log('Tock!');
    yield;
  }
};
```
As you can see, the implementation of Generator looks more concise and safe, and appeal with functional programming. 


## Generator & coroutine
To be continued...

## the application of Generator
1. Show asynchronous code in synchronous way
The most significant meaning for Generator is to deal with asynchronous operation without callback function. 
```javascript
function* loadUI() {
  showLoadingScreen();
  yield loadUIDataAsynchronously();
  hideLoadingScreen();
}
var loader = loadUI();
// loading UI
loader.next()

// unloading UI
loader.next()
```

Ajax is a classic asynchronous operation, to implement it by using Generator, it looks like:
```javascript
function* main() {
  var result = yield request("http://some.url");
  var resp = JSON.parse(result);
    console.log(resp.value);
}

function request(url) {
  makeAjaxCall(url, function(response){
    it.next(response);
  });
}

var it = main();
it.next();
```

2. flow control
See an example:
Callback version:
```javascript
step1(function (value1) {
  step2(value1, function(value2) {
    step3(value2, function(value3) {
      step4(value3, function(value4) {
        // Do something with value4
      });
    });
  });
});
```
Promise version:
```javascript
Promise.resolve(step1)
  .then(step2)
  .then(step3)
  .then(step4)
  .then(function (value4) {
    // Do something with value4
  }, function (error) {
    // Handle any error from step1 through step4
  })
  .done();
```

Generator version:
```javascript
function* longRunningTask(value1) {
  try {
    var value2 = yield step1(value1);
    var value3 = yield step2(value2);
    var value4 = yield step3(value3);
    var value5 = yield step4(value4);
    // Do something with value4
  } catch (e) {
    // Handle any error from step1 through step4
  }
}
```
As you can see it improves the execution flow. 

Then, creating a function to run those steps:
```javascript
scheduler(longRunningTask(initialValue));

function scheduler(task) {
  var taskObj = task.next(task.value);
  // 如果Generator函数未结束，就继续调用
  if (!taskObj.done) {
    task.value = taskObj.value
    scheduler(task);
  }
}
```

By using `for...of`, there is also an easy way to control the flow:
```javascript
let steps = [step1Func, step2Func, step3Func];

function *iterateSteps(steps){
  for (var i=0; i< steps.length; i++){
    var step = steps[i];
    yield step();
  }
}
```

```javascript
let jobs = [job1, job2, job3];

function* iterateJobs(jobs){
  for (var i=0; i< jobs.length; i++){
    var job = jobs[i];
    yield* iterateSteps(job.steps);
  }
}
```

```javascript
for (var step of iterateJobs(jobs)){
  console.log(step.id);
}
```

NOTE: all those jobs/steps must be synchronous operation. We will talk later if they are asynchronous ones. 

3. deploy Iterator interface
By utilizing Generator function, it is easy to deploy Iterator interface. 
```javascript
function* iterEntries(obj) {
  let keys = Object.keys(obj);
  for (let i=0; i < keys.length; i++) {
    let key = keys[i];
    yield [key, obj[key]];
  }
}

let myObj = { foo: 3, bar: 7 };

for (let [key, value] of iterEntries(myObj)) {
  console.log(key, value);
}

// foo 3
// bar 7
```

4. data structure
Generator can be taken as a data structure, to precisely, can be taken as an array structure. 
```javascript
function *doStuff() {
  yield fs.readFile.bind(null, 'hello.txt');
  yield fs.readFile.bind(null, 'world.txt');
  yield fs.readFile.bind(null, 'and-such.txt');
}
```

To use it:
```javascript
for (task of doStuff()) {
  // task是一个函数，可以像回调函数那样使用它
}
```

## Generator's asynchronous application
Since ES6, Promise improves asynchronous operation a lot, but it still has some drawbacks, e.g. too many template code/redundant code.
Generator makes the asynchronous programming in JavaScript entering to a new stage. 

### Asynchronous Jobs encapsulated in Generator
```javascript
var fetch = require('node-fetch');

function* gen(){
  var url = 'https://api.github.com/users/github';
  var result = yield fetch(url);
  console.log(result.bio);
}
```
The code above looks very similar as synchronous code except there is a `yield`. 

To execute it:
```javascript
var g = gen();
var result = g.next();

result.value.then(function(data){
  return data.json();
}).then(function(data){
  g.next(data);
});
```

As you can see, it is very concise to write asynchronous code by using Generator function, but it is not easy to control the flow(when to run the `next`)

### Thunk function
Thunk function is an approach to run Generator function automatically. 

#### What is thunk function
Normally wrapping parameters into a temporary function and passing the temporary function to main function is to implement the lazy evaluation. The temporary function is called **thunk** function.
```javascript
function f(m) {
  return m * 2;
}

f(x + 5);

// 等同于

var thunk = function () {
  return x + 5;
};

function f(thunk) {
  return thunk() * 2;
}
```

#### JavaScript's Thunk function
In JavaScript, Thunk function is not to replace expression, but multiple-parameters function, to make it the function to be a function only accepting one parameter. 
```javascript
//original version
fs.readFile(fileName, callback);

// thunk-version
var Thunk = function (fileName) {
  return function (callback) {
    return fs.readFile(fileName, callback);
  };
};

var readFileThunk = Thunk(fileName);
readFileThunk(callback);
```

Below is a simple version to implement a Thunk converter:
```javascript
// ES5
var Thunk = function(fn){
  return function (){
    var args = Array.prototype.slice.call(arguments);
    return function (callback){
      args.push(callback);
      return fn.apply(this, args);
    }
  };
};

// ES6
const Thunk = function(fn) {
  return function (...args) {
    return function (callback) {
      return fn.call(this, ...args, callback);
    }
  };
};
```

An example how to use it:
```javascript
var readFileThunk = Thunk(fs.readFile);
readFileThunk(fileA)(callback);
```

Another example:
```javascript
function f(a, cb) {
  cb(a);
}
const ft = Thunk(f);

ft(1)(console.log) // 1
```

#### Thunkify module
In production mode, the 3rd party Thunkify module. 
Install:
```javascript
$ npm install thunkify
```

To use it:
```javascript
var thunkify = require('thunkify');
var fs = require('fs');

var read = thunkify(fs.readFile);
read('package.json')(function(err, str){
  // ...
});
```

The source code of Thunkify:
```javascript
function thunkify(fn) {
  return function() {
    var args = new Array(arguments.length);
    var ctx = this;

    for (var i = 0; i < args.length; ++i) {
      args[i] = arguments[i];
    }

    return function (done) {
      var called;

      args.push(function () {
        if (called) return;
        called = true;
        done.apply(null, arguments);
      });

      try {
        fn.apply(ctx, args);
      } catch (err) {
        done(err);
      }
    }
  }
};
```

#### Generator function's flow control
Thunk function can make the Generator function to be executed automatically. 
```javascript
function* gen() {
  // ...
}

var g = gen();
var res = g.next();

while(!res.done){
  console.log(res.value);
  res = g.next();
}
```
Above code can make the `gen` executed with all steps automatically. But it can only be used for synchronous code. How to make it to be working for asynchronous code?
```javascript
var fs = require('fs');
var thunkify = require('thunkify');
var readFileThunk = thunkify(fs.readFile);

var gen = function* (){
  var r1 = yield readFileThunk('/etc/fstab');
  console.log(r1.toString());
  var r2 = yield readFileThunk('/etc/shells');
  console.log(r2.toString());
};
```

As the execution right can be released by the callback of Thunk function, so it can make the generator with asynchronous operations executed automatically. 
```javascript
var g = gen();

var r1 = g.next();
r1.value(function (err, data) {
  if (err) throw err;
  var r2 = g.next(data);
  r2.value(function (err, data) {
    if (err) throw err;
    g.next(data);
  });
});
```

#### Thunk function's auto flow control
An example of executor for Generator of Thunk function. 
```javascript
function run(fn) {
  var gen = fn();

  function next(err, data) {
    var result = gen.next(data);
    if (result.done) return;
    result.value(next);
  }

  next();
}

function* g() {
  // ...
}

run(g);
```

With this executor, the expression following `yield` must be a Thunk function. 
```javascript
var g = function* (){
  var f1 = yield readFile('fileA');
  var f2 = yield readFile('fileB');
  // ...
  var fn = yield readFile('fileN');
};

run(g);
```

#### co module
[co module](https://github.com/tj/co) is a small tool for auto running of Generator function. 

```javascript
var gen = function* () {
  var f1 = yield readFile('/etc/fstab');
  var f2 = yield readFile('/etc/shells');
  console.log(f1.toString());
  console.log(f2.toString());
};
```

To use co:
```javascript
var co = require('co');
co(gen);
```

`co` returns a Promise object, so `then` can be used for adding callback.
```javascript
co(gen).then(function (){
  console.log('Generator 函数执行完成');
});
```

@TODO: to be continued... : add more here...

## async function
ES2017 introduces async function which make the asynchronous operation more easier. What's async function? To simplify it is the syntax sugar for Generator function. 

Generator version:
```javascript
var fs = require('fs');

var readFile = function (fileName) {
  return new Promise(function (resolve, reject) {
    fs.readFile(fileName, function(error, data) {
      if (error) reject(error);
      resolve(data);
    });
  });
};

var gen = function* () {
  var f1 = yield readFile('/etc/fstab');
  var f2 = yield readFile('/etc/shells');
  console.log(f1.toString());
  console.log(f2.toString());
};
```

async function version:
```javascript
var asyncReadFile = async function () {
  var f1 = await readFile('/etc/fstab');
  var f2 = await readFile('/etc/shells');
  console.log(f1.toString());
  console.log(f2.toString());
};
```

To compare those two versions, you can see the `*` was replaced by `async`, and the `yield` was replaced by `await`. Then what improvement made by `async` based on Generator?
1. build-in executor
Unlike Generator, it doesn't need executor, like `co` module, it can be run/invoked as normal function. 
```javascript
var result = asyncReadFile();
```
2. better semantics

3. wider applicability
There can be Promise and primitive values after `await`. In `co` module, only Thunk function and promise object are allowed.

4. returned value is a Promise

### How to use async
See an example:
```javascript
async function getStockPriceByName(name) {
  var symbol = await getStockSymbol(name);
  var stockPrice = await getStockPrice(symbol);
  return stockPrice;
}

getStockPriceByName('goog').then(function (result) {
  console.log(result);
});
```

There are many ways to use/define async function. 
```javascript
// function declaration
async function foo() {}

// function expression
const foo = async function () {};

// object's method
let obj = { async foo() {} };
obj.foo().then(...)

// Class 's method
class Storage {
  constructor() {
    this.cachePromise = caches.open('avatars');
  }

  async getAvatar(name) {
    const cache = await this.cachePromise;
    return cache.match(`/avatars/${name}.jpg`);
  }
}

const storage = new Storage();
storage.getAvatar('jake').then(…);

// 箭头函数
const foo = async () => {};
```

### syntax
#### return a promise object
```javascript
async function f() {
  return 'hello world';
}

f().then(v => console.log(v))
// "hello world"
```

```javascript
async function f() {
  throw new Error('出错了');
}

f().then(
  v => console.log(v),
  e => console.log(e)
)
// Error: 出错了
```

#### States change of Promise object

```javascript
async function getTitle(url) {
  let response = await fetch(url);
  let html = await response.text();
  return html.match(/<title>([\s\S]+)<\/title>/i)[1];
}
getTitle('https://tc39.github.io/ecma262/').then(console.log)
// "ECMAScript 2017 Language Specification"
```

#### await command

```javascript
async function f() {
  return await 123; //primitive value will be wrapped as a Promise and resolve immediately. 
}

f().then(v => console.log(v))
// 123
```

if the promise following `await` changes into `reject`, the parameter of `reject` will be got by `catch` method. 
```javascript
async function f() {
  await Promise.reject('error happen');
}

f()
.then(v => console.log(v))
.catch(e => console.log(e))
// error happen
```

```javascript
async function f() {
  await Promise.reject('error happen');
  await Promise.resolve('hello world'); // not executed
}
```


```javascript
async function f() {
  try {
    await Promise.reject('出错了');
  } catch(e) {
  }
  return await Promise.resolve('hello world');
}

f()
.then(v => console.log(v))
// hello world
```
Another approach:
```javascript
async function f() {
  await Promise.reject('error happen')
    .catch(e => console.log(e));
  return await Promise.resolve('hello world');
}

f()
.then(v => console.log(v))
// error happen
// hello world
```

#### error handling
```javascript
async function f() {
  try {
    await new Promise(function (resolve, reject) {
      throw new Error('error happen');
    });
  } catch(e) {
  }
  return await('hello world');
}
```

multiple `await`:
```javascript
async function main() {
  try {
    var val1 = await firstStep();
    var val2 = await secondStep(val1);
    var val3 = await thirdStep(val1, val2);

    console.log('Final: ', val3);
  }
  catch (err) {
    console.error(err);
  }
}
```

```javascript
const superagent = require('superagent');
const NUM_RETRIES = 3;

async function test() {
  let i;
  for (i = 0; i < NUM_RETRIES; ++i) {
    try {
      await superagent.get('http://google.com/this-throws-an-error');
      break;
    } catch(err) {}
  }
  console.log(i); // 3
}

test();
```

#### NOTES
1. Putting `await` into `try...catch` as the result may be `rejected`
```javascript
async function myFunction() {
  try {
    await somethingThatReturnsAPromise();
  } catch (err) {
    console.log(err);
  }
}

// another approach

async function myFunction() {
  await somethingThatReturnsAPromise()
  .catch(function (err) {
    console.log(err);
  });
}
```

2. Run asynchronous operations in parallel if they are not serial. 
```javascript
// approach 1
let [foo, bar] = await Promise.all([getFoo(), getBar()]);

// approach 2
let fooPromise = getFoo();
let barPromise = getBar();
let foo = await fooPromise;
let bar = await barPromise;
```

3. `await` can only be used in `async` function. It would throw an error if it is used in normal function. 
```javascript
async function dbFuc(db) {
  let docs = [{}, {}, {}];

  // error
  docs.forEach(function (doc) {
    await db.post(doc);
  });
}
```

There is still a problem if change the above code as below as the three `db.post` were executed in parallel.

```javascript
function dbFuc(db) { 
  let docs = [{}, {}, {}];

  // may get unexpected result
  docs.forEach(async function (doc) {
    await db.post(doc);
  });
}
```
To correct it:
```javascript
async function dbFuc(db) {
  let docs = [{}, {}, {}];

  for (let doc of docs) {
    await db.post(doc);
  }
}
```

#### the implementation of async function. 
async = Generator + auto executor
```javascript
async function fn(args) {
  // ...
}

// the same as:

function fn(args) {
  return spawn(function* () {
    // ...
  });
}
```
The `spawn` is an auto executor which implemention can be:
```javascript
function spawn(genF) {
  return new Promise(function(resolve, reject) {
    var gen = genF();
    function step(nextF) {
      try {
        var next = nextF();
      } catch(e) {
        return reject(e);
      }
      if(next.done) {
        return resolve(next.value);
      }
      Promise.resolve(next.value).then(function(v) {
        step(function() { return gen.next(v); });
      }, function(e) {
        step(function() { return gen.throw(e); });
      });
    }
    step(function() { return gen.next(undefined); });
  });
}
```

#### the comparision among Promise, Generator and async
Promise:
```javascript
function chainAnimationsPromise(elem, animations) {

  var ret = null;

  var p = Promise.resolve();

  for(var anim of animations) {
    p = p.then(function(val) {
      ret = val;
      return anim(elem);
    });
  }

  return p.catch(function(e) {
    /* ignore error */
  }).then(function() {
    return ret;
  });

}
```

Generator:
```javascript
function chainAnimationsGenerator(elem, animations) {

  return spawn(function*() {
    var ret = null;
    try {
      for(var anim of animations) {
        ret = yield anim(elem);
      }
    } catch(e) {
      /* ignore error */
    }
    return ret;
  });

}
```

async:
```javascript
async function chainAnimationsAsync(elem, animations) {
  var ret = null;
  try {
    for(var anim of animations) {
      ret = await anim(elem);
    }
  } catch(e) {
    /* ignore error */
  }
  return ret;
}
```

#### Async Iterator

#### for await...of

#### Asynchronous Generator function