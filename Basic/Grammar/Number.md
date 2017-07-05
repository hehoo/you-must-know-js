# Numbers

JavaScript has just one numeric type: number. This type includes both "integer" values and fractional decimal numbers. I say "integer" in quotes because it's long been a criticism of JS that there are not true integers, as there are in other languages. That may change at some point in the future, but for now, we just have numbers for everything.

So in JS, `1` is the same as `1.0`
```javascript
1 === 1.0 // true
```
## Numeric Syntax
There are so many ways to express `numbers`. For example:
```javascript
//base-10 decimal literals
var a = 42;
var b = 42.3;

//leading 0 is optional
var a = 0.42;
var b = .42;

//the trailing 0 is also optional
var a = 42.0;
var b = 42.; // NOTE: it is pretty uncommon, not a good idea to do it this way
```
The trailing fractional `0` will be removed by default. 
```javascript
var a = 42.300;
var b = 42.0;

a; // 42.3
b; // 42
```
`numbers` can also be expressed in exponent form, and usually very large or very small numbers will by default be outputted in exponent form, the same as the output of the toExponential() method, like:
```javascript
123e3 // 123000
123e-3 // 0.123
-3.1E+12
.1e-23

var a = 5E10;
a;					// 50000000000
a.toExponential();	// "5e+10"

var b = a * a;
b;					// 2.5e+21

var c = 1 / a;
c;					// 2e-11
```

For the following two cases, JavaScript would transform `numbers` to be exponent form from literal expression.
   1. When there are more than 21 digital before `.`
```javascript
1234567890123456789012
// 1.2345678901234568e+21

123456789012345678901
// 123456789012345680000
```
   2. When there are more than 5 digital after `.`
```javascript
0.0000003 // 3e-7

0.000003 // 0.000003
```

Besides decimal, `numbers` also can be expressed in other bases, like binary, octal and hexadecimal
   > decimal: without prefix 0
   > octal: with prefix `0o` or `0O`, or with prefix 0 with rest numbers only having 0-7 digital(but this was deprecated in strict mode and ES6)
   > hexadecimal: with prefix `0x` or `0X`
   > binary: with prefix `0b` or `0B`
   
By default, JavaScript would convert binary, octal, hexadecimal to decimal automatically. For example: 
```javascript
0xff // 255
0o377 // 255
0b11 // 3
```
If there are invalid numbers containing in binary, octal or hexadecimal, an error will be thrown. Consider: 
```javascript
0xzz // SyntaxError
0o88 // SyntaxError
0b22 // SyntaxError
```
Also consider: 
```javascript
0888 // 888  decimal
0777 // 511  octal
```

## Special Numnbers
### +0 and -0
Consider the interesting code below. It lies. 
```javascript
-0 === +0 // true
0 === -0 // true
0 === +0 // true

-0 == 0 //true

0 > -0;  // false
```
In most cases, they will be treated as the same 
```javascript
+0 // 0
-0 // 0
(-0).toString() // '0'
(+0).toString() // '0'
JSON.stringify( -0 );		// "0"
```

Interestingly, the reverse operations (going from string to number) don't lie:
```javascript
+"-0";				// -0
Number( "-0" );		// -0
JSON.parse( "-0" );	// -0
````

It behaves differently when they are used as denominator
```javascript
(1 / +0) === (1 / -0) // false

1 / +0 // +Infinity
1 / -0 // -Infinity
```
So it can utilize this point to create a function to check the negative zero this way: 
```javascript
function isNegZero(n) {
	n = Number( n );
	return (n === 0) && (1 / n === -Infinity);
}

isNegZero( -0 );		// true
isNegZero( 0 / -3 );	// true
isNegZero( 0 );			// false
````

### NaN
NaN stands for "not a number", usually it is used to indicate that there is something wrong when converting string to number. 
```javascript
5 - 'x' // NaN
0 / 0 // NaN
```
Note that NaN is not a type, but a special value, its  type is still `Numnber`, consider:
```javascript
typeof NaN // 'number'
```
The most important thing you must know is `NaN` is not itself either. 
```javascript
NaN === NaN // false
```
Consider: 

```javascript
[NaN].indexOf(NaN) // -1
Boolean(NaN) // false
NaN + 32 // NaN
NaN - 32 // NaN
NaN * 32 // NaN
NaN / 32 // NaN

```
`isNaN` function can be used to check if an value is `NaN`. 
```javascript
isNaN(NaN) // true
isNaN(123) // false
```
But how about passing a non-number value to this function? 
```javascript
isNaN('Hello') // true
// equals
isNaN(Number('Hello')) // true
```
But consider the following cases:
```javascript
isNaN([]) // false as Number([]) is 0
isNaN([123]) // false as Number([123]) is 123
isNaN(['123']) // false as Number(['123`]) is 123
```
So the better way to use `isNaN` is:
```javascript
function myIsNaN(value) {
  return typeof value === 'number' && isNaN(value);
}
```
Or
```javascript
function myIsNaN(value) {
  return value !== value;
}
```
Or the best way is to use Number.isNaN which is introduced since ES6
```javascript
Number.isNaN(NaN) // true
Number.isNaN(15) // false
Number.isNaN('15') // false
Number.isNaN(true) // false
Number.isNaN(9/NaN) // true
Number.isNaN('true'/0) // true
Number.isNaN('true'/'true') // true
````

### Special Equality
As we saw above, the NaN value and the -0 value have special behavior when it comes to equality comparison.

As of ES6, there's a new utility that can be used to test two values for absolute equality, without any of these exceptions. It's called Object.is(..):
```javascript
var a = 2 / "foo";
var b = -3 * 0;

Object.is( a, NaN );	// true
Object.is( b, -0 );		// true

Object.is( b, 0 );		// false
````
Object.is(..) probably shouldn't be used in cases where == or === are known to be safe (see Chapter 4 "Coercion"), as the operators are likely much more efficient and certainly are more idiomatic/common. Object.is(..) is mostly for these special cases of equality.

### Small Decimal Values
The most (in)famous side effect of using binary floating-point numbers (which, remember, is true of all languages that use IEEE 754 -- not just JavaScript as many assume/pretend) is:
```javascript
0.1 + 0.2 === 0.3; // false
```
The result of `0.1 + 0.2` is not exactly `0.3`. It is really close:`0.30000000000000004`. 

Now, the question is, if some numbers can't be trusted to be exact, does that mean we can't use numbers at all? Of course not.

What if we did need to compare two numbers, like 0.1 + 0.2 to 0.3, knowing that the simple equality test fails?

The most commonly accepted practice is to use a tiny "rounding error" value as the tolerance for comparison. This tiny value is often called "machine epsilon," which is commonly 2^-52 (2.220446049250313e-16) for the kind of numbers in JavaScript.

As of ES6, Number.EPSILON is predefined with this tolerance value, so you'd want to use it, but you can safely polyfill the definition for pre-ES6:
```javascript
if (!Number.EPSILON) {
	Number.EPSILON = Math.pow(2,-52);
}
```
You can use `Number.EPSILON` to compare two `number`s for "equality":
```javascript
function numbersCloseEnoughToEqual(n1,n2) {
	return Math.abs( n1 - n2 ) < Number.EPSILON;
}

var a = 0.1 + 0.2;
var b = 0.3;

numbersCloseEnoughToEqual( a, b );					// true
numbersCloseEnoughToEqual( 0.0000001, 0.0000002 );	// false
```

### Safe Integer Ranges
The maximum integer that can "safely" be represented is `2^53 - 1`, which is `9007199254740991`. This value is actually automatically predefined in ES6: `Number.MAX_SAFE_INTEGER`. Also the minimum value: `-9007199254740991` which is defined in ES6 as: `Number. MIN_SAFE_INTEGER`. 

#### Testing for Integers
To test if a value is an integer, you can use the ES6-specified Number.isInteger(..):
```javascript
Number.isInteger( 42 );		// true
Number.isInteger( 42.000 );	// true
Number.isInteger( 42.3 );	// false
```

To test if a value is a safe integer, use the ES6-specified Number.isSafeInteger(..):
```javascript
Number.isSafeInteger( Number.MAX_SAFE_INTEGER );	// true
Number.isSafeInteger( Math.pow( 2, 53 ) );			// false
Number.isSafeInteger( Math.pow( 2, 53 ) - 1 );		// true
```

### 32-bit(Signed) Integers
There are some numeric operations (like the bitwise operators) that are only defined for 32-bit numbers, so the "safe range" for numbers used in that way must be much smaller.

The range then is `Math.pow(-2,31)` (-2147483648, about -2.1 billion) up to `Math.pow(2,31)-1` (2147483647, about +2.1 billion).

To force a number value in a to a 32-bit signed integer value, use `a | 0`. This works because the | bitwise operator only works for 32-bit integer values.

## Number API
Please refer to http://javascript.ruanyifeng.com/stdlib/number.html to see the details. 
Some highlights here: 
`Number` can be used as utility function to convert to `number` as well as constructor function. For example: 
```javascript
var n = new Number(1);
typeof n // "object"

Number(true) // 1
```

### Number's properties
   > Number.POSITIVE_INFINITY: Infinity
   > Number.NEGATIVE_INFINITY: -Infinity
   > Number.NaN
   > Number.MAX_VALUE
   > Number.MIN_VALUE: 5e-324
   > Number.MAX_SAFE_INTEGER：9007199254740991。
   > Number.MIN_SAFE_INTEGER：-9007199254740991。
   
### Number instance functions
#### Number.prototype.toString()
```javascript
(10).toString() // "10"
(10).toString(2) // "1010"
(10).toString(8) // "12"
(10).toString(16) // "a"

10.toString(2)
// SyntaxError: Unexpected token ILLEGAL

10..toString(2)
// "1010"
Or
10 .toString(2) // "1010"
10.0.toString(2) // "1010"
````
#### Number.prototype.toFixed()
The range of the argument is 0 - 20. 
```javascript
(10).toFixed(2) // "10.00"
10.005.toFixed(2) // "10.01"
````
#### Number.prototype.toExponential()
Range: 0 - 20
```javascript
(10).toExponential()  // "1e+1"
(10).toExponential(1) // "1.0e+1"
(10).toExponential(2) // "1.00e+1"

(1234).toExponential()  // "1.234e+3"
(1234).toExponential(1) // "1.2e+3"
(1234).toExponential(2) // "1.23e+3"
````
#### Number.prototype.toPrecision()
Range: 1 - 21
```javascript
(12.34).toPrecision(1) // "1e+1"
(12.34).toPrecision(2) // "12"
(12.34).toPrecision(3) // "12.3"
(12.34).toPrecision(4) // "12.34"
(12.34).toPrecision(5) // "12.340"
```

### Number static functions
Note: The following features were introduced since ES6.  
#### Number.isFinite
```javascript
Number.isFinite(15); // true
Number.isFinite(0.8); // true
Number.isFinite(NaN); // false
Number.isFinite(Infinity); // false
Number.isFinite(-Infinity); // false
Number.isFinite('foo'); // false
Number.isFinite('15'); // false
Number.isFinite(true); // false
````

#### Number.isNaN
Mentioned already above. 

#### Number.parseInt
Global function parseInt was moved to Number since ES6 with the same features/behaviors. 
```javascript
// ES5
parseInt('12.34') // 12
parseFloat('123.45#') // 123.45

// ES6
Number.parseInt('12.34') // 12
Number.parseFloat('123.45#') // 123.45
````
More examples: 
```javascript
Number.parseInt('8a') // 8
Number.parseInt('12**') // 12
Number.parseInt('12.34') // 12
Number.parseInt('15e2') // 15
Number.parseInt('15px') // 15

Number.parseInt('abc') // NaN
Number.parseInt('.3') // NaN
Number.parseInt('') // NaN
Number.parseInt('+') // NaN
Number.parseInt('+1') // 1

//if the argument starts with 0x or 0X, parseInt would parse it as hexadecimal
Number.parseInt('0x10') // 16
//if starts with 0, to be decimal
Number.parseInt('011') // 11
````
Note: the numbers be automatically converted to exponential would be parsed with surprised result. 
```javascript
Number.parseInt(1000000000000000000000.5) // 1
// same as
Number.parseInt('1e+21') // 1

Number.parseInt(0.0000008) // 8
// same as
Number.parseInt('8e-7') // 8
````

`Number.parseInt` can also accept second argument (valid range: 2 - 36), please be always specify the second argument while using it. 
```javascript
Number.parseInt('1000', 2) // 8
Number.parseInt('1000', 6) // 216
Number.parseInt('1000', 8) // 512
````

if first argument contains invalid characters, only parse the valid parts from left to right, if no valid characters, return `NaN`
```javascript
Number.parseInt('1546', 2) // 1
Number.parseInt('546', 2) // NaN
````
if the first argument is not a string, it will be converted to string firstly which would result some weird problems. So be caution to use it. 
```javascript
Number.parseInt(0x11, 36) // 43
// same as
Number.parseInt(String(0x11), 36)
Number.parseInt('17', 36)

Number.parseInt(011, 2) // NaN
// same as
Number.parseInt(String(011), 2)

Number.parseInt('011', 2) // 3
````

#### Number.parseFloat
See some examples:
```javascript
Number.parseFloat('3.14') // 3.14

Number.parseFloat('314e-2') // 3.14
Number.parseFloat('0.0314E+2') // 3.14

Number.parseFloat('3.14more non-digit characters') // 3.14

Number.parseFloat('\t\v\r12.34\n ') // 12.34, the first prefix space will be filtered out automatically

//if the argument is not a string or the string cannot be converted
Number.parseFloat([]) // NaN
Number.parseFloat('FF2') // NaN
Number.parseFloat('') // NaN
````

The difference between `parseFloat()` and 'Number()'
```javascript
Number.parseFloat(true)  // NaN
Number(true) // 1

Number.parseFloat(null) // NaN
Number(null) // 0

Number.parseFloat('') // NaN
Number('') // 0

Number.parseFloat('123.45#') // 123.45
Number('123.45#') // NaN
````

#### Number.isInteger $ Number.isSafeInteger
JavaScript cannot express an integer precisely/accurately out of the range from `-2^53` to `2^53` (exclude the edge) 
```javascript
Math.pow(2, 53) // 9007199254740992

9007199254740992  // 9007199254740992
9007199254740993  // 9007199254740992

Math.pow(2, 53) === Math.pow(2, 53) + 1
// true
```
`isSafeInteger` is used to check if the integer is safe and between the range. 
```javascript
Number.isSafeInteger('a') // false
Number.isSafeInteger(null) // false
Number.isSafeInteger(NaN) // false
Number.isSafeInteger(Infinity) // false
Number.isSafeInteger(-Infinity) // false

Number.isSafeInteger(3) // true
Number.isSafeInteger(1.2) // false
Number.isSafeInteger(9007199254740990) // true
Number.isSafeInteger(9007199254740992) // false

Number.isSafeInteger(Number.MIN_SAFE_INTEGER - 1) // false
Number.isSafeInteger(Number.MIN_SAFE_INTEGER) // true
Number.isSafeInteger(Number.MAX_SAFE_INTEGER) // true
Number.isSafeInteger(Number.MAX_SAFE_INTEGER + 1) // false
```
Consider the case: 
```javascript
Number.isSafeInteger(9007199254740993 - 990)
// true
9007199254740993 - 990
// the result is 9007199254740002
// but the expected result should be 9007199254740003 as 9007199254740993 is not a safe integer
```
