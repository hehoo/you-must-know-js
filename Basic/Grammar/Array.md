# The definition of Array
Array is just a special object which can contain any type of value with order. 
```javascript
var arr = ['a', 'b', 'c'];

var arr1 = [];

arr1[0] = 'a';
arr1[1] = 'b';
arr1[2] = 'c';

var arr2 = [
  {a: 1},
  [1, 2, 3],
  function() {return true;}
];

```
```javascript
typeof [1, 2, 3] // "object"  essentially array is just an object

var arr = ['a', 'b', 'c'];

Object.keys(arr)
// ["0", "1", "2"]

var a = [];

a['1000'] = 'abc';
a[1000] // 'abc'

a[1.00] = 6;
a[1] // 6
```

## the length of Array
JavaScript uses 32 bit interger to express the length, so the maximum value is `2^32 - ` which is 4294967295. Length is an dynamic value which value is the max key value plus 1. 
```javascript
var arr = ['a', 'b'];
arr.length // 2

arr[2] = 'c';
arr.length // 3

arr[9] = 'd';
arr.length // 10

arr[1000] = 'e';
arr.length // 1001
````
`length` is also can be written. 
```javascript
var arr = [ 'a', 'b', 'c' ];
arr.length // 3

arr.length = 2;
arr // ["a", "b"]

var a = ['a'];

a.length = 3;
a[1] // undefined
```

As `array` is just an object, so you can assign any property to it just like you did normally for an object, but it would not impact the `length`. 
```javascript
var a = [];

a['p'] = 'abc';
a.length // 0

a[2.1] = 'abc';
a.length // 0
```
Generally, it's not a great idea to add string keys/properties to `array`s. Use `object`s for holding values in keys/properties, and save `array`s for strictly numerically indexed values.

## Array-like object
What is array-like object? It looks similar as array, there is also a property called `length`, but they are not real `array`. So you cannot utilize the plenty of functions provided by `array`
```javascript
var obj = {
  0: 'a',
  1: 'b',
  2: 'c',
  length: 3
};

obj[0] // 'a'
obj[2] // 'c'
obj.length // 3
obj.push('d') // TypeError: obj.push is not a function
```
Here, the `length` here is not dynamic, but static value. `
```javascript
var obj = {
  length: 0
};
obj[3] = 'd';
obj.length // 0
```

The typical array-like objects are `arguments` , most of DOM collection(e.g. NodeList) and string. 
```javascript
// arguments object
function args() { return arguments }
var arrayLike = args('a', 'b');

arrayLike[0] // 'a'
arrayLike.length // 2
arrayLike instanceof Array // false

// DOM collection
var elts = document.getElementsByTagName('h3');
elts.length // 3
elts instanceof Array // false

// string
'abc'[1] // 'b'
'abc'.length // 3
'abc' instanceof Array // false
```
Usually array's `slice` function can be used to convert array-like object to a real array. 
```javascript
var arr = Array.prototype.slice.call(arrayLike);
```
Since ES6, there is a better way to do it. 
```javascript
var arr = Array.from( arguments );
````
Note: Array.from(..) has several powerful capabilities, and will be covered later in this section. 

Also you can iterate the array-like object by using `for` operator as well as `forEach` method of array. 
```javascript
// for
function logArgs() {
  for (var i = 0; i < arguments.length; i++) {
    console.log(i + '. ' + arguments[i]);
  }
}

// forEach
function logArgs() {
  Array.prototype.forEach.call(arguments, function (elem, i) {
    console.log(i+'. '+elem);
  });
}
```

## `in` operator
The operator `in` is used for checking whether the key of object is existed. So it can also be used for `array`.
```javascript
var arr = [ 'a', 'b', 'c' ];
2 in arr  // true
'2' in arr // true
4 in arr // false
```

## for...in loop and the loop of array
As `for...in` loop can also iterate the non-number keys, so it is not suggested to use for loop array. 
```javascript 
var a = [1, 2, 3];
a.foo = true;

for (var key in a) {
  console.log(key);
}
// 0
// 1
// 2
// foo
```
Usually the `forEach` is suggested for iterate array, we will talk about it later in this section. 

## the hole of the array
What is the hole (empty slot) of the array? 
```javascript
var a = [1, , 1];

var b = [, , ,];
b[1] // undefined

var c = [1, 2, 3];
delete c[1];

c[1] // undefined
c.length // 3
```

Note: Be careful of the hole of array, because `forEach`, `for...in` and `Object.keys` would skip the holes. 
```javascript
var a = [, , ,];

a.forEach(function (x, i) {
  console.log(i + '. ' + x);
})
// no output

for (var i in a) {
  console.log(i);
}
// no output

Object.keys(a)
// []
```
If there is an undefined instead of a 'hole' in the array, the iteration would not skip it. 
```javascript
var a = [undefined, undefined, undefined];

a.forEach(function (x, i) {
  console.log(i + '. ' + x);
});
// 0. undefined
// 1. undefined
// 2. undefined

for (var i in a) {
  console.log(i);
}
// 0
// 1
// 2

Object.keys(a)
// ['0', '1', '2']
```

ES6 ************ for the hole of Array.................. talk more here....

## API of Array
Please refer to the links http://javascript.ruanyifeng.com/stdlib/array.html and http://es6.ruanyifeng.com/#docs/array for more details. Only some highlights will be listed below in this section. 
### the constructor of Array
```javascript
var arr = new Array(2);
// 等同于
var arr = Array(2);
````
The problem of Array constructor is the result is different with different type of arguments. 
```javascript
new Array() // []

new Array(1) // [ undefined ]
new Array(2) // [ undefined x 2 ]

new Array('abc') // ['abc']
new Array([1]) // [Array[1]]

new Array(1, 2) // [1, 2]
new Array('a', 'b', 'c') // ['a', 'b', 'c']
````
Because of this, it is not suggested to use the constructor to create an Array, but use the array literal 
```javascript
// bad
var arr = new Array(1, 2);

// good
var arr = [1, 2];
//or
var arr = Array.of(1, 2); // since ES6
````

### Array.isArray()
This is the best way to check the given value is an array or not. Do not use `typeof` anymore to check array anymore. 

#### Array.from()
Convert an array-like object and iterable object(Array, Set and Map...) to an array.  
```javascript
let arrayLike = {
    '0': 'a',
    '1': 'b',
    '2': 'c',
    length: 3
};

// ES5
var arr1 = [].slice.call(arrayLike); // ['a', 'b', 'c']

// ES6
let arr2 = Array.from(arrayLike); // ['a', 'b', 'c']

//string is also array-like object
Array.from('hello')
// ['h', 'e', 'l', 'l', 'o']

//Set is iterable object
let namesSet = new Set(['a', 'b'])
Array.from(namesSet) // ['a', 'b']
````
Note: the operator `...` can also be used to convert iterable object to array, but cannot for array-like object. 
```javascript
// arguments对象
function foo() {
  var args = [...arguments];
}

// NodeList对象
[...document.querySelectorAll('div')]
````

`Array.from` can also accept the second argument and third argument (for binding the `this` object).
```javascript
Array.from(arrayLike, x => x * x);
// the same as
Array.from(arrayLike).map(x => x * x);

````
`Array.from` can also correctly deal with all Unicode characters to avoid the bug that the character with char code bigger than `\uFFFF` is recognized to two chars.
```javascript
Array.from('ABC吉祥'); // ['A', 'B', 'C', '吉', '祥']
````

#### Array.of()
Already mentioned above. It is used to replace the constructor of Array. 

### Array's instance methods
#### valueOf(), toString()
```javascript
var a = [1, 2, 3];
a.valueOf() // [1, 2, 3]

var a = [1, 2, 3];
a.toString() // "1,2,3"

var a = [1, 2, 3, [4, 5, 6]];
a.toString() // "1,2,3,4,5,6"
````

#### push()
`push` is used to add one or more items to the tail of array and its returned value is the new length of the array after the push. 
```javascript
var a = [];

a.push(1) // 1
a.push('a') // 2
a.push(true, {}) // 4
a // [1, 'a', true, {}]

var b = [1,2,3];
a.push(b); // 5
a // [1, 'a', true, {}, Array(3)]
````

#### pop()
`pop` is used to delete the last item of array. 
```javascript
var a = ['a', 'b', 'c'];

a.pop() // 'c'
a // ['a', 'b']
````

#### join()
`join` is used to combine each item to a string with the separator given from the argument. 
```javascript
var a = [1, 2, 3, 4];

a.join(' ') // '1 2 3 4'
a.join(' | ') // "1 | 2 | 3 | 4"
a.join() // "1,2,3,4"
````
`undefined` and `null` and the hole(empty slot) will be changed into empty string. 
```javascript
[undefined, null].join('#')
// '#'

['a',, 'b'].join('-')
// 'a--b'
````

`join` can be also applied to array-like object. 
```javascript
Array.prototype.join.call('hello', '-')
// "h-e-l-l-o"

var obj = { 0: 'a', 1: 'b', length: 2 };
Array.prototype.join.call(obj, '-')
// 'a-b'
````

#### concat()
`concat` is used to combine two or more arrays and return a new array. 
```javascript
['hello'].concat(['world'])
// ["hello", "world"]

['hello'].concat(['world'], ['!'])
// ["hello", "world", "!"]

[1, 2, 3].concat(4, 5, 6)
// [1, 2, 3, 4, 5, 6]

//the same as
[1, 2, 3].concat(4, [5, 6])
[1, 2, 3].concat([4], [5, 6])
````

#### shift()
`shift` is used to delete the first item of array. 
```javascript
var a = ['a', 'b', 'c'];

a.shift() // 'a'
a // ['b', 'c']
```
`push` with `shift` can make a "FIFO" queue. 

#### unshift()
`unshift` is used to add an item at the first position of array. It returns the new lenght of the unshifted array.
```javascript
var a = ['a', 'b', 'c'];

a.unshift('x'); // 4
a // ['x', 'a', 'b', 'c']

var arr = [ 'c', 'd' ];
arr.unshift('a', 'b') // 4
arr // [ 'a', 'b', 'c', 'd' ]
````

#### reverse()
`reverse` is used to reverse the order of the items in array. 
```javascript
var a = ['a', 'b', 'c'];

a.reverse() // ["c", "b", "a"]
a // ["c", "b", "a"]
````

#### slice()
`slice` is used to slice an array and return the new one. 
```javascript
// API
arr.slice(start_index, upto_index);

var a = ['a', 'b', 'c'];

a.slice(0) // ["a", "b", "c"]
a.slice(1) // ["b", "c"]
a.slice(1, 2) // ["b"]
a.slice(2, 6) // ["c"]
a.slice() // ["a", "b", "c"]
```

The most of important usage for `slice` is to convert array-like object to a real array. But since ES6, it has been replaced by `Array.from`
 
#### splice()
`splice` is used to delete items from array and meanwhile new items can be added from the position where items to be deleted. 
```javascript
// API
arr.splice(index, count_to_remove, addElement1, addElement2, ...);

// 
var a = ['a', 'b', 'c', 'd', 'e', 'f'];
a.splice(4, 2) // ["e", "f"]
a // ["a", "b", "c", "d"]

var a = ['a', 'b', 'c', 'd', 'e', 'f'];
a.splice(-4, 2) // ["c", "d"]

var a = [1, 2, 3, 4];
a.splice(2) // [3, 4]
a // [1, 2]
````

#### sort()
`sort` is used to sort items in array. The default sort algorithm is alphabetically. You can specify the sor algorithm as second argument. 
```javascript
['d', 'c', 'b', 'a'].sort()
// ['a', 'b', 'c', 'd']

[10111, 1101, 111].sort(function (a, b) {
  return a - b;
})
// [111, 1101, 10111]
````


#### map()
`map` is used to iterate each item of array and return a new array. 
```javascript
var numbers = [1, 2, 3];

numbers.map(function (n) {
  return n + 1;
});
// [2, 3, 4]

numbers
// [1, 2, 3]
````
It can also be applied to array-like object, e.g. string. 
```javascript
var upper = function (x) {
  return x.toUpperCase();
};

[].map.call('abc', upper)
// [ 'A', 'B', 'C' ]

// OR
'abc'.split('').map(upper)
// [ 'A', 'B', 'C' ]
````
The second argument of `map` is for binding the `this` object. 

#### forEach()
`forEach` is similar as `map`, it iterate array but not return a new array. 
```javascript
var out = [];

[1, 2, 3].forEach(function(elem) {
  this.push(elem * elem);
}, out);

out // [1, 4, 9]
````
The second argument of `map` is for binding the `this` object. 
```javascript
var obj = {
  name: 'Jonathan',
  times: [1, 2, 3],
  print: function () {
    this.times.forEach(function (n) {
      console.log(this.name);
    });
  }
};

obj.print()
// no output
````
How to correct it ?
```javascript
var obj = {
  name: 'Jonathan',
  times: [1, 2, 3],
  print: function () {
    this.times.forEach(function (n) {
      console.log(this.name);
    }, this);
  }
};

obj.print()
// Jonathan
// Jonathan
// Jonathan
```

#### filter()
`filter` is used return a new array which filter out some items by the given filter function. 
```javascript
[1, 2, 3, 4, 5].filter(function (elem) {
  return (elem > 3);
})
// [4, 5]
````
The same as `forEach` and `map`, the second argument accepts the `this` object. 


#### some() & every()
`some` is used to assert if the given function called with one of item in array returns `true`, then it returns `true`, otherwise `false`. 
```javascript
var arr = [1, 2, 3, 4, 5];
arr.some(function (elem, index, arr) {
  return elem >= 3;
});
// true
````
`every` is opposite with `some`, only when all items return `true`, it returns `true`, otherwise `false`. 
```javascript
var arr = [1, 2, 3, 4, 5];
arr.every(function (elem, index, arr) {
  return elem >= 3;
});
// false
````

NOTE: for empty array, `some` returns `false`, `every` returns `true` without invoking the callback(first argument). 

Also the second argument is for binding `this` object. 


#### reduce(), reduceRight()
`reduce` and `reduceRight` are to process each item in order and aggregate to one value. `reduce` is from left to right to process items, but `reduceRight` is from right to left. 
The first argument is a function which API is:
   > 1. aggregated value - default value is the first item of array
   > 2. current value - default value is the second item of array
   > 3. current position - from 0
   > 4. original array

```javascript
[1, 2, 3, 4, 5].reduce(function(x, y){
  console.log(x, y)
  return x + y;
});
````
The second argument can be used to specify the initial/base value. 
```javascript
[1, 2, 3, 4, 5].reduce(function(x, y){
  return x + y;
}, 10);
// 25

function add(prev, cur) {
  return prev + cur;
}

[].reduce(add)
// TypeError: Reduce of empty array with no initial value
[].reduce(add, 1)
// 1
````

Consider `reduceRight`
```javascript
function substract(prev, cur) {
  return prev - cur;
}

[3, 2, 1].reduce(substract) // 0
[3, 2, 1].reduceRight(substract) // -4
````

TIPS: `reduce` and `reduceRight` is also can be used for searching certain item in an array. For example: 
```javascript
function findLongest(entries) {
  return entries.reduce(function (longest, entry) {
    return entry.length > longest.length ? entry : longest;
  }, '');
}

findLongest(['aaa', 'bb', 'c']) // "aaa"
```


#### indexOf(), lastIndexOf()
`indexOf` is used to return the first index where the given item found, if no one found, returns `-1`. 
```javascript
var a = ['a', 'b', 'c'];

a.indexOf('b') // 1
a.indexOf('y') // -1

['a', 'b', 'c'].indexOf('a', 1) // -1
````
If you don't care about the returned index, actually `includes` introduced since ES6 can replace `indexOf`. 

`lastIndexOf` is used to return the last index where the given item found, if no one found, returns `-1`.
```javascript
var a = [2, 5, 9, 2];
a.lastIndexOf(2) // 3
a.lastIndexOf(7) // -1
````
Because under the hood those two method use `===` to compare items, so 
```javascript
[NaN].indexOf(NaN) // -1
[NaN].lastIndexOf(NaN) // -1
````

#### copyWithin(target, start = 0, end = this.length)
`copyWithin` is used to copy specified a range of items to replace certain items. 
 ```javascript
 [1, 2, 3, 4, 5].copyWithin(0, 3)
 // [4, 5, 3, 4, 5]
 
 // copy 3-index item to 0-index
 [1, 2, 3, 4, 5].copyWithin(0, 3, 4)
 // [4, 2, 3, 4, 5]
 
 // -2 = 3, -1 = 4
 [1, 2, 3, 4, 5].copyWithin(0, -2, -1)
 // [4, 2, 3, 4, 5]
 
 [].copyWithin.call({length: 5, 3: 1}, 0, 3)
 // {0: 1, 3: 1, length: 5}
 
 var i32a = new Int32Array([1, 2, 3, 4, 5]);
 i32a.copyWithin(0, 2);
 // Int32Array [3, 4, 5, 4, 5]
 
 // TypedArray doesn't have the function of copyWithin
 [].copyWithin.call(new Int32Array([1, 2, 3, 4, 5]), 0, 3, 4);
 // Int32Array [4, 2, 3, 4, 5]
 ````

#### find(), findIndex()
`find` is to return the first item which meets the search function. If no items found, returns `undefined`.
```javascript
[1, 4, -5, 10].find((n) => n < 0)
// -5

[1, 5, 10, 15].find(function(value, index, arr) {
  return value > 9;
}) // 10
````

`findIndex` is to return the index of first found item. If no items found, returns `-1`. 

The second argument of these two method is for binding `this` object. 

NOTE: `findIndex` and `find` can recognize `NaN` which is different with `indexOf` and `lastIndexOf`. 
```javascript
[NaN].indexOf(NaN)
// -1

[NaN].findIndex(y => Object.is(NaN, y))  // as it can use Object.is...
// 0
````


#### fill(filledValue, start = 0, end = this.length)
`fill` is to fill the array with given value. 
```javascript
['a', 'b', 'c'].fill(7)
// [7, 7, 7]

['a', 'b', 'c'].fill(7, 1, 2)
// ['a', 7, 'c']
````

#### entries(), keys() and values()
Those three methods are used to iterate array. They all return a iterator which can be used for iterating by `for...of` loop.(`Iterator` will be covered in another section)
 ```javascript
for (let index of ['a', 'b'].keys()) {
  console.log(index);
}
// 0
// 1

for (let elem of ['a', 'b'].values()) {
  console.log(elem);
}
// 'a'
// 'b'

for (let [index, elem] of ['a', 'b'].entries()) {
  console.log(index, elem);
}
// 0 "a"
// 1 "b"
 ````
OR, you can use `.next` to iterate all items. 
```javascript
let letter = ['a', 'b', 'c'];
let entries = letter.entries();
console.log(entries.next().value); // [0, 'a']
console.log(entries.next().value); // [1, 'b']
console.log(entries.next().value); // [2, 'c']
````

#### includes()  - ES7
`includes` returns a boolean to check if the array includes the given value. It is designed to replace `indexOf`
```javascript
[1, 2, 3].includes(2);     // true
[1, 2, 3].includes(4);     // false
[1, 2, NaN].includes(NaN); // true

[1, 2, 3].includes(3, 3);  // false
[1, 2, 3].includes(3, -1); // true

[NaN].indexOf(NaN)
// -1

[NaN].includes(NaN)
// true
```

#### invoking as chain
As some of functions still return array, so you can call them as a chain. 
```javascript
var users = [
  {name: 'tom', email: 'tom@example.com'},
  {name: 'peter', email: 'peter@example.com'}
];

users
.map(function (user) {
  return user.email;
})
.filter(function (email) {
  return /^t/.test(email);
})
.forEach(alert);
````

# References
   * http://javascript.ruanyifeng.com/grammar/array.html 
   * http://javascript.ruanyifeng.com/stdlib/array.html 
   * http://es6.ruanyifeng.com/#docs/array 

# Exercise
Try [Array exercise](Basic/Exercise/Array.js) here to grab all key points. 

# Presentation & Video
See [Array presentation](https://sharenet-ims.int.net.nokia.com/livelink/livelink?func=ll&objaction=overview&objid=554990033) for the course presentation. 
See [Array_video](https://sharenet-ims.int.net.nokia.com/livelink/livelink?func=ll&objaction=overview&objid=554977797) for the course video. 
