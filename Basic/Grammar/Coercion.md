# Abstract Value Operations - internal only operations
## ToString
### Primitive converting rules
   * number: the corresponding string
   * string: the original string
   * boolean: `true` -> "true", `false` -> "false"
   * undefined: "undefined"
   * null: "null"

For very small or very large `numbers` are represented in exponent form: 
```javascript
// multiplying `1.07` by `1000`, seven times over
var a = 1.07 * 1000 * 1000 * 1000 * 1000 * 1000 * 1000 * 1000;

// seven times three digits => 21 digits
a.toString(); // "1.07e21"
```
### Object converting rules
   * Regular Object: toString() or Object.prototype.toString() will return [[class]], e.g. "[object Object]"
   * Array: concatenation of all its values with "," between each value
```javascript
({a: 1}).toString() // "[object Object]"
([1, 2, 3]).toString() // "1,2,3"
```

But actually the converting rules under the hood are complex inside the JS: 
   > Invoke `toString()`. If returned value is primitive, then invoke `String()`
   > If returned value from `toString()` is still object, then invoke `valueOf()`, if returned value is primitive, then invoke `String()`
   > If returned value is still object from `valueOf`, then throw Error. 

### JSON Stringification
Please be aware of that that this stringification is not exactly the same thing as coercion. But since it's related to the ToString rules above, we'll take a slight diversion to cover JSON stringification behaviors here.
Consider:
```javascript
JSON.stringify( 42 );   // "42"
JSON.stringify( "42" ); // ""42"" (a string with a quoted string value in it)
JSON.stringify( null ); // "null"
JSON.stringify( true ); // "true"
```
As you can see any JSON-safe can be stringified by JSON.stringify(). But what's non-JSON-safe? e.g. 
   * undefineds, 
   * functions, 
   * (ES6+) symbols
   * objects with circular references
   * illegal values for a standard JSON structure
Consider: 
```javascript
JSON.stringify( undefined );                    // undefined
JSON.stringify( function(){} );                 // undefined

JSON.stringify( [1,undefined,function(){},4] ); // "[1,null,null,4]"
JSON.stringify( { a:2, b:function(){} } );      // "{"a":2}"
````
Note: If such non-JSON-safe value is found in an array, that value is replaced by null. 

JSON stringification has the special behavior that if an object value has a toJSON() method defined, this method will be called first to get a value to use for serialization.
```javascript
var o = { };

var a = {
    b: 42,
    c: o,
    d: function(){}
};

// create a circular reference inside `a`
o.e = a;

// would throw an error on the circular reference
// JSON.stringify( a );

// define a custom JSON value serialization
a.toJSON = function() {
    // only include the `b` property for serialization
    return { b: this.b };
};

JSON.stringify( a ); // "{"b":42}"
```

While we're talking about JSON.stringify(..), let's discuss some lesser-known functionalities that can still be very useful - the optional second argument and third argument can be passed in `JSON.stringify()`
```javascript
var a = {
    b: 42,
    c: "42",
    d: [1,2,3]
};

JSON.stringify( a, ["b","c"] ); // "{"b":42,"c":"42"}"  as you can see the 'd' property is skipped. 

JSON.stringify( a, function(k,v){
    if (k !== "c") return v;
} );
// "{"b":42,"d":[1,2,3]}"
```

A third optional argument can also be passed to JSON.stringify(..), called space, which is used as indentation for prettier human-friendly output.
```javascript
var a = {
    b: 42,
    c: "42",
    d: [1,2,3]
};

JSON.stringify( a, null, 3 );
// "{
//    "b": 42,
//    "c": "42",
//    "d": [
//       1,
//       2,
//       3
//    ]
// }"

JSON.stringify( a, null, "-----" );
// "{
// -----"b": 42,
// -----"c": "42",
// -----"d": [
// ----------1,
// ----------2,
// ----------3
// -----]
// }"
```

## ToNumber
### Primitive converting rules
   * number: original number
   * string: corresponding number of the string or NaN, empty string '' -> 0
   * boolean: `true` -> 1, `false` -> 0
   * undefined: NaN
   * null: 0
The different between `Number()` and `parseInt()`
```javascript
parseInt('42 cats') // 42
Number('42 cats') // NaN
```
Furthermore, Number() would filter out the pre and post empty spaces. 
```javascript
Number('\t\v\r12.34\n') // 12.34
```

### Object converting rules
   * object: NaN

The converting rules under the hood are actual complex inside the JS: 
   > Invoke `valueOf`. If returned value is primitive, then invoke `Number()`
   > If returned value from `valueOf` is still object, then invoke `toString()`, if returned value is primitive, then invoke `Number()`
   > If returned value is still object from `toString`, then throw Error. 
```javascript
var obj = {
  valueOf: function () {
    return {};
  },
  toString: function () {
    return {};
  }
};

Number(obj)
// TypeError: Cannot convert object to primitive value
````
More examples: 
```javascript
var a = {
    valueOf: function(){
        return "42";
    }
};

var b = {
    toString: function(){
        return "42";
    }
};

var c = [4,2];
c.toString = function(){
    return this.join( "" ); // "42"
};

Number( a );            // 42
Number( b );            // 42
Number( c );            // 42
Number( "" );           // 0
Number( [] );           // 0
Number( [ "abc" ] );    // NaN
````

## ToBoolean
### Primitive converting rules
As already mentioned in Types chapter, the following six values are `false`, *all others are `true`* ? (really? we will talk about it)
   * `undefined`
   * `null`
   * `false`
   * `0`
   * `+0,` `-0,` `NaN`
   * `""` or `''` (empty string)
 `Note:` all objects convert to `true` even `new Boolean(false)` converts to `true`. 
 ```javascript
 Boolean({}) // true
 Boolean([]) // true
 Boolean(new Boolean(false)) // true
 ```
Try the code below in your browser console
```javascript
Boolean(document.all);  // false
````
What!? `document.all` is a array-like object here why it returns `false`? It is the IE story, you can google it by yourself. It is just FYI, you will and should not meet it. 

## Explicit Coercion
You can use well-known coercion function below as you may have already noticed the code examples above. 
    * `Number()`
    * `String()`
    * `Boolean()`

### Strings <---> Numbers
Besides `String()` and `Number()`, there are other ways to "explicitly" convert these values between `string` and `number`:
```javascript
var a = 42;
var b = a.toString();

var c = "3.14";
var d = +c;
var e = - -c;

b; // "42"
d; // 3.14
e; // 3.14
```
As you can `.toString()` and the unary operation `+`. For `-` you have to use two `--` with a space in between as `--` is decrement operator. But you should strongly consider avoiding unary `+`(or `-`) coercion when it's immediately adjacent to other operators.
Remember, we're trying to be explicit and reduce confusion, not make it much worse!

### Date To number
Another common usage of the unary + operator is to coerce a Date object into a number. 
```javascript
var d = new Date( "Mon, 18 Aug 2014 08:53:06 CDT" );

+d; // 1408369986000

var timestamp = +new Date();
```
But a noncoercion approach is perhaps even preferable, as it's even more explicit: 
```javascript
var timestamp = new Date().getTime();
// var timestamp = (new Date()).getTime();
// var timestamp = (new Date).getTime();
```
even more preferable option is to use the ES5 added `Date.now()` static function: 
```javascript
var timestamp = Date.now();
```
### Bitwise operators (like ~ or |)
To be continued for this part. See memo. 

### Parsing Numeric Strings
A similar outcome to coercing a `string` to a `number` can be achieved by parsing a `number` out of a string's character contents.

Consider:
```javascript
var a = "42";
var b = "42px";

Number( a );    // 42
parseInt( a );  // 42

Number( b );    // NaN
parseInt( b );  // 42
```
parseInt would stop parsing left-to-right when encountered -- whereas coercion is not tolerant and fails resulting in the NaN value. 
Parsing should not be seen as a substitute for coercion. These two tasks, while similar, have different purposes. Also never use `parseInt` with a non-string value. 

Tip: parseInt(..) has a twin, parseFloat(..), which (as it sounds) pulls out a floating-point number from a string.

Prior to ES5, another gotcha existed with parseInt(..), which was the source of many JS programs' bugs. If you didn't pass a second argument to indicate which numeric base (aka radix) to use for interpreting the numeric string contents, parseInt(..) would look at the beginning character(s) to make a guess.
```javascript
var hour = parseInt( selectedHour.value );
var minute = parseInt( selectedMinute.value );

console.log( "The time you selected was: " + hour + ":" + minute); // if selectedHour = 08, selectedMinute = 09, the result would be 0:0
```
The pre-ES5 fix was simple, but so easy to forget: always pass 10 as the second argument. This was totally safe:
```javascript
var hour = parseInt( selectedHour.value, 10 );
var minute = parseInt( selectedMiniute.value, 10 );
```
As of ES5, parseInt(..) no longer guesses octal. Unless you say otherwise, it assumes base-10 (or base-16 for "0x" prefixes). That's much nicer. Just be careful if your code has to run in pre-ES5 environments, in which case you still need to pass 10 for the radix.

Let's take a look at the below code:
```javascript
parseInt( 1/0, 19 ); // 18
```
Why it results 18? Think about it for one minute :)
   > It's essentially parseInt( "Infinity", 19 ) as the `Infinity`'s `string` representation is `Infinity`. How does it parse? The first character is "I", which is value 18 in the silly base-19.

Other examples of this behavior with `parseInt(..)` that may be surprising but are quite sensible include: 
```javascript
parseInt( 0.000008 );       // 0   ("0" from "0.000008")
parseInt( 0.0000008 );      // 8   ("8" from "8e-7")
parseInt( false, 16 );      // 250 ("fa" from "false")
parseInt( parseInt, 16 );   // 15  ("f" from "function..")

parseInt( "0x10" );         // 16
parseInt( "103", 2 );       // 2
```

### * --> Boolean
Just like with String(..) and Number(..) above, Boolean(..) (without the new, of course!) is an explicit way of forcing the ToBoolean coercion. 
Just like the unary `+` operator coerces a value to a `number` (see above), the unary `!` negate operator explicitly coerces a value to a `boolean`
```javascript
var a = "0";
var b = [];
var c = {};

var d = "";
var e = 0;
var f = null;
var g;

!!a;    // true
!!b;    // true
!!c;    // true

!!d;    // false
!!e;    // false
!!f;    // false
!!g;    // false
```

The ? : ternary operator will test a for truthiness, and based on that test will either assign true or false to b, accordingly.
```javascript
var a = 42;

var b = a ? true : false;
```
However, there's a hidden implicit coercion, in that the a expression has to first be coerced to boolean to perform the truthiness test. I'd call this idiom "explicitly implicit." Furthermore, I'd suggest you should avoid this idiom completely in JavaScript. It offers no real benefit, and worse, masquerades as something it's not.

Boolean(a) and !!a are far better as explicit coercion options.

## Implicit Coercion
Implicit coercion refers to type conversions that are hidden, with non-obvious side-effects that implicitly occur from other actions. In other words, implicit coercions are any type conversions that aren't obvious (to you).

### Strings <--> Numbers
The + operator is overloaded to serve the purposes of both number addition and string concatenation. So how does JS know which type of operation you want to use? Consider:
```javascript
var a = "42";
var b = "0";

var c = 42;
var d = 0;

a + b; // "420"
c + d; // 42
```
and 
```javascript
var a = [1,2];
var b = [3,4];

a + b; // "1,23,4"
```
The Simplified explanation is: if either operand to `+` is a string (or becomes one with the above steps!), the operation will be string concatenation. Otherwise, it's always numeric addition.

Thinking about the following code:
```javascript
[] + {}   // [object Object]
{} + []  // 0
```
Why? 

On the first line, {} appears in the + operator's expression, and is therefore interpreted as an actual value (an empty object). Chapter 4 explained that [] is coerced to "" and thus {} is coerced to a string value as well: "[object Object]".

But on the second line, {} is interpreted as a standalone {} empty block (which does nothing). Blocks don't need semicolons to terminate them, so the lack of one here isn't a problem. Finally, + [] is an expression that explicitly coerces (see Chapter 4) the [] to a number, which is the 0 value.

Comparing this implicit coercion of a + "" to our earlier example of String(a) explicit coercion, there's one additional quirk to be aware of.  Because of how the ToPrimitive abstract operation works, a + "" invokes valueOf() on the a value, whose return value is then finally converted to a string via the internal ToString abstract operation. But String(a) just invokes toString() directly.

Consider: 
```javascript
var a = {
    valueOf: function() { return 42; },
    toString: function() { return 4; }
};

a + "";         // "42"

String( a ) + "";    // "4"
```

What about the other direction? How can we implicitly coerce from `string` to `number`?
```javascript
var a = "3.14";
var b = a - 0;

b; // 3.14
```

The `-` operator is defined only for numeric subtraction, so `a - 0` forces a's value to be coerced to a `number`. While far less common, `a * 1` or `a / 1` would accomplish the same result, as those operators are also only defined for numeric operations.

What about `object` values with `-` operator? 
```javascript
var a = [3];
var b = [1];

a - b; // 2
```

### Booleans --> Numbers
I think a case where implicit coercion can really shine is in simplifying certain types of complicated boolean logic into simple numeric addition. Of course, this is not a general-purpose technique, but a specific solution for specific cases.

Consider:
```javascript
function onlyOne(a,b,c) {
    return !!((a && !b && !c) ||
        (!a && b && !c) || (!a && !b && c));
}

var a = true;
var b = false;

onlyOne( a, b, b ); // true
onlyOne( b, a, b ); // true

onlyOne( a, b, a ); // false
```
What if we needed that utility to be able to handle four, five, or twenty flags in the same way? It's pretty difficult to imagine implementing code that would handle all those permutations of comparisons.

But here's where coercing the boolean values to numbers (0 or 1, obviously) can greatly help:
```javascript
function onlyOne() {
    var sum = 0;
    for (var i=0; i < arguments.length; i++) {
        // skip falsy values. same as treating
        // them as 0's, but avoids NaN's.
        if (arguments[i]) {
            sum += arguments[i];
        }
    }
    return sum == 1;
}

var a = true;
var b = false;

onlyOne( b, a );                // true
onlyOne( b, a, b, b, b );       // true

onlyOne( b, b );                // false
onlyOne( b, a, b, b, b, a );    // false
```
*Note:* Of course you can do it with ES5 `reduce()` utility, please try to do it by yourself. 

### * --> Boolean
What sort of expression operations require/force (implicitly) a `boolean` coercion? 
   * The test expression in an `if (..)` statement.
   * The test expression (second clause) in a `for (..; ..; ..)` header.
   * The test expression in `while (..)` and `do..while(..)` loops.
   * The test expression(first clause) in `? :` ternary expressions. 
   * The left-hand operand (which serves as a test expression -- see below!) to the || ("logical or") and && ("logical and") operators.
   
Let's look at some examples: 
```javascript
var a = 42;
var b = "abc";
var c;
var d = null;

if (a) {
    console.log( "yep" );       // yep
}

while (c) {
    console.log( "nope, never runs" );
}

c = d ? a : b;
c;                              // "abc"

if ((a && d) || c) {
    console.log( "yep" );       // yep
}
````
#### || and &&
Let's take a look at the code below and what do they result in? 
```javascript
var a = 42;
var b = "abc";
var c = null;

a || b;     // 42
a && b;     // "abc"

c || b;     // "abc"
c && b;     // null
````
Wait, what!? the result comes from the values themselves rather than `true` or `false`...

Another way of thinking about these operators: 
```javascript
a || b;
// roughly equivalent to:
a ? a : b;

a && b;
// roughly equivalent to:
a ? b : a;
````
Something you need to know about `&&` - The && operator "selects" the second operand if and only if the first operand tests as truthy, and this usage is sometimes called the "guard operator". 
```javascript
function foo() {
    console.log( a );
}

var a = 42;

a && foo(); // 42
````

### Symbol Coercion
Up to this point, there's been almost no observable outcome difference between explicit and implicit coercion -- only the readability of code has been at stake.

But ES6 introduces Symbols that explicit coercion of a symbol to a string is allowed, but implicit coercion of the same is disallowed and throws an error. 

Consider: 
```javascript
var s1 = Symbol( "cool" );
String( s1 );                   // "Symbol(cool)"

var s2 = Symbol( "not cool" );
s2 + "";                        // TypeError
````

### Loose Equals vs. Strict Equals
Loose equals is the `==` operator, and strict equals is the `===` operator. And be aware of that `==` allows coercion in the equality comparison and `===` disallows coercion."

One of the biggest gotchas with the implicit coercion of == loose equality pops up when you try to compare a value directly to true or false.

Consider:
```javascript
var a = "42";
var b = true;

a == b; // false
````
Wait, what happended here? We know that "42" is a truthy value (see earlier in this chapter). So, how come it's not == loose equal to true?

The reason is both simple and deceptively tricky. Let's again quote the spec.
   > If Type(x) is Boolean, return the result of the comparison ToNumber(x) == y.
   > If Type(y) is Boolean, return the result of the comparison x == ToNumber(y).
   
Remember even "42" is indeed truthy, but "42" is not performing a boolean test/coercion at all. 
   
Comparing `null`s to `undefined`s
The "The Abstract Equality Comparison Algorithm" specify that:
   > If x is null and y is undefined, return true.
   > If x is undefined and y is null, return true.
   
Consider:
```javascript
var a = null;
var b;

a == b;     // true
a == null;  // true
b == null;  // true

a == false; // false
b == false; // false
a == "";    // false
b == "";    // false
a == 0;     // false
b == 0;     // false
```

Comparing `object`s to non-`objects`s
The spec says:
   > If Type(x) is either String or Number and Type(y) is Object, return the result of the comparison x == ToPrimitive(y).
   > If Type(x) is Object and Type(y) is either String or Number, return the result of the comparison ToPrimitive(x) == y.

Consider:
```javascript
var a = 42;
var b = [ 42 ];

a == b; // true
```
and
```javascript
var a = "abc";
var b = Object( a );    // same as `new String( a )`

a === b;                // false
a == b;                 // true
```

There are some values where this is not the case, though, because of other overriding rules in the == algorithm. Consider:
```javascript
var a = null;
var b = Object( a );    // same as `Object()`
a == b;                 // false

var c = undefined;
var d = Object( c );    // same as `Object()`
c == d;                 // false

var e = NaN;
var f = Object( e );    // same as `new Number( e )`
e == f;                 // false
```

False-y Comparisons
```javascript
"0" == null;            // false
"0" == undefined;       // false
"0" == false;           // true -- UH OH!
"0" == NaN;             // false
"0" == 0;               // true
"0" == "";              // false

false == null;          // false
false == undefined;     // false
false == NaN;           // false
false == 0;             // true -- UH OH!
false == "";            // true -- UH OH!
false == [];            // true -- UH OH!
false == {};            // false

"" == null;             // false
"" == undefined;        // false
"" == NaN;              // false
"" == 0;                // true -- UH OH!
"" == [];               // true -- UH OH!
"" == {};               // false

0 == null;              // false
0 == undefined;         // false
0 == NaN;               // false
0 == [];                // true -- UH OH!
0 == {};                // false
```

The Crazy Ones

Consider:
```javascript
[] == ![];      // true
```
Ooooo, crazy, right? Why? It actually compare `[] == false` as `!` explicitly coerces to a `boolean`. 

How about other corner cases? 
```javascript
2 == [2];       // true
"" == [null];   // true
```
`[2]` will become "2", which then is `ToNumber` coerced to `2` for the right-hand side value in the first comparison. `[null]` just straight becomes "".

So, `2 == 2` and `"" == ""` are completely understandable.

Another famously cited gotcha:
```javascript
0 == "\n";      // true
```
As we discussed earlier with empty `""`, `"\n"` (or `" "` or any other whitespace combination) is coerced via `ToNumber`, and the result is `0`

Bottom line: almost any crazy coercion between normal values that you're likely to run into (aside from intentionally tricky valueOf() or toString() hacks as earlier) will boil down to the short seven-item list of gotcha coercions we've identified above.

To contrast against these 24 likely suspects for coercion gotchas, consider another list like this:
```javascript
42 == "43";                         // false
"foo" == 42;                        // false
"true" == true;                     // false

42 == "42";                         // true
"foo" == [ "foo" ];                 // true
```

Is implicit coercion evil and dangerous? In a few cases, yes, but overwhelmingly, no.

Be a responsible and mature developer. Learn how to use the power of coercion (both explicit and implicit) effectively and safely. And teach those around you to do the same.

Here's a handy table made by Alex Dorey (@dorey on GitHub) to visualize a variety of comparisons:
Source: https://github.com/dorey/JavaScript-Equality-Table

### Abstract Relational Comparison
While this part of implicit coercion often gets a lot less attention, it's important nonetheless to think about what happens with a < b comparisons (similar to how we just examined a == b in depth).

The algorithm is: first calls ToPrimitive coercion on both values, and if the return result of either call is not a string, then both values are coerced to number values using the ToNumber operation rules, and compared numerically.

For example: 
```javascript
var a = [ 42 ];
var b = [ "43" ];

a < b;	// true
b < a;	// false
```
Above, the comparision would be converted to `42 < 43`
```javascript
var a = [ "42" ];
var b = [ "043" ];

a < b;	// false
```
Above, the comparision would be converted to `"42" < "043" `. Since `"0"` is lexicographically less than `"4"`, the result is `false`.

How about these below? 
```javascript
var a = [ 4, 2 ];
var b = [ 0, 4, 3 ];

a < b;	// false
```
and
```javascript
var a = { b: 42 };
var b = { b: 43 };

a < b;	// ??
```
Think about the result for 1 minute.  It is also `false`.

But strangely:
```javascript
var a = { b: 42 };
var b = { b: 43 };

a < b;	// false
a == b;	// false
a > b;	// false

a <= b;	// true
a >= b;	// true
```
For the last two comparision, spec says for `a <= b`, it will actually evaluate `b < a` first, and then negate that result. Since `b < a` is also `false`, the result of `a <= b` is `true`. 
