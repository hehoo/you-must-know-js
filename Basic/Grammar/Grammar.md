# Statements & Expressions
See the code below: 
```javascript
var a = 1 + 2;
var b = a;
b
```
In this snippet, `1 + 2` is an expression, `a` on the second line is also an expression as well as `b` on the third line. 
```javascript
var a = 3 * 6; var b = a * 2;
```
Multiple statements can be in one line. 
```javascript
var a = 3; 
```
What's the return value for the statement above? `undefined`
```javascript
var a, b, c;

a = b = c = 42;
```
Here, c = 42 is evaluated to 42 (with the side effect of assigning 42 to c), then b = 42 is evaluated to 42 (with the side effect of assigning 42 to b), and finally a = 42 is evaluated (with the side effect of assigning 42 to a).

# Variables
```javascript
var a = 1;
```
equals
```javascript
var a;
a = 1;
```
If an variable is not defined, you will get reference error. 
```javascript
x
// ReferenceError: x is not defined
```
You can declare more than one variables in one line. 
```javascript
var a, b, c;
```
As Javascript is not a dynamic language, so you can assign any value with any type later on. 
```javascript
var a = 1;
a = 'Javascript';  // number -> string
```
## Hoisting
In Javascript, all variables declaration statement will be hoisted to the top, which is called hoisting. 
```javascript
console.log(a);
var a = 10;
```
equals
```javascript
var a;
console.log(a); // undefined
a = 10;
```
if an variable is not declared by `var`, then this variable will not be hoisted. 
```javascript
console.log(b);  
b = 1;
```
In this snippet, `ReferenceError: b is not defined` will be indicated. 
More information you can refer to http://www.adequatelygood.com/JavaScript-Scoping-and-Hoisting.html for more detailed information.
# Identifier
The rules for identifier are:
   * The first character can be any Unicode character or $ and _
   * The second character and the rests can be 0-9 besides Unicode character, & and _

Invalid identifier:
```javascript
 var 1a  // The first char is a number
 var 23  // same as above
 var ***  // * is not allowed
 var a+b  // + is not allowed
 var -d  // - is not allowed
```
Chinese characters are valid for identifiers as well.
```javascript
var 临时变量 = 1; 
```
Also reserved keywords of Javascript cannot be identifier, e.g. arguments, break, case, catch....
Also the following keywords which are not reserved by Javascript having special meaning, which cannot be identifier: `Infinity, NaN, undefined`

# if and if...else
```javascript
if(expression)
    statement;
    
// OR

if(expression) statement;
```
For example: 
```javascript
if(m === 3)
    m += 1;

if(m === 3) {
    m += 1;
}
```
How about below code? what will be printed in the console? 
```javascript
var x = 1;
var y = 2;
if(x = 2) {           // not === or ==
    console.log(x);
}
// "2"
```
```javascript
if (m !== 1) {
  if (n === 2) {
    console.log('hello');	
  } else {
    console.log('world');
  }
}
```
## Ternary Operator ? :
The ternary operator can be used to replace simple if...else. 
```javascript
(condition) ? expr1 : expr2
```
```javascript
var even = (n % 2 === 0) ? true : false;
```
equals
```javascript
var even;
if (n % 2 === 0) {
  even = true;
} else {
  even = false;
}
```
In general, operators are either left-associative or right-associative, referring to whether grouping happens from the left or from the right.
It's important to note that associativity is not the same thing as left-to-right or right-to-left processing.
Consider the `? :` ("ternary" or "conditional") operator:
```javascript
a ? b : c ? d : e;
```
`? :` is right-associative, so which grouping represents how it will be processed?
```javascript
a ? b : (c ? d : e)
(a ? b : c) ? d : e
````
The anwser is the first one. The right-associativity here actually matters. 
See more examples: 
```javascript
true ? false : true ? true : true;      // false

true ? false : (true ? true : true);    // false
(true ? false : true) ? true : true;    // true
````
# Switch
`switch` statement can be used to replace if...else if...else statement chain, it is a sort-of syntactic shorthand. 
```javascript
switch (a) {
    case 2:
        // do something
        break;
    case 42:
        // do another thing
        break;
    default:
        // fallback to here
}
```
It may not surprise you, but there are several quirks about `switch` you may not have noticed before. 
First, the matching that occurs between the a expression and each case expression is identical to the === algorithm. 
Often times `switch`es are used with absolute values in case statements, as shown above, so strict matching is appropriate.

However, you may wish to allow coercive equality (aka ==, see Chapter 4), and to do so you'll need to sort of "hack" the switch statement a bit:
```javascript
var a = "42";

switch (true) {
    case a == 10:
        console.log( "10 or '10'" );
        break;
    case a == 42:
        console.log( "42 or '42'" );
        break;
    default:
        // never gets here
}
// 42 or '42'
```
Can you see why the result is Oops in the below snippet? 
```javascript
var a = "hello world";
var b = 10;

switch (true) {
    case (a || b == 10):
        // never gets here
        break;
    default:
        console.log( "Oops" );
}
// Oops
```
Have you got the point? That's because the expression `a || b == 10` returns "hello world". 
Lastly, the default clause is optional, and it doesn't necessarily have to come at the end (although that's the strong convention). 
Even in the default clause, the same rules apply about encountering a break or not:
```javascript
var a = 10;

switch (a) {
    case 1:
    case 2:
        // never gets here
    default:
        console.log( "default" );
    case 3:
        console.log( "3" );
        break;
    case 4:
        console.log( "4" );
}
// default
// 3
```

# Loops
## while
```javascript
while (expression)
  statement;

// OR

while (expression) statement;

// OR

while (expression) {
  statement;
}
````

```javascript
var i = 0;

while (i < 100) {
  console.log('i is：' + i);
  i += 1;
}
````
## for
```javascript
for (initialize; test; increment)
  statement

// 或者

for (initialize; test; increment) {
  statement
}
````

```javascript
var x = 3;
for (var i = 0; i < x; i++) {
  console.log(i);
}
// 0
// 1
// 2
````
Either of initialize，test or increment can be unspecified, or all of them can be not unspecified. E.g. 
```javascript
for ( ; ; ){
  console.log('Hello World');
}
````
This results an infinitive loop. 
## do while
```javascript
do
  statement
while (expression);

// OR

do {
  statement
} while (expression);
```
No matter the expression returns `true` or `false`, do...while would run at least once. 
Example: 
```javascript
var x = 3;
var i = 0;

do {
  console.log(i);
  i++;
} while(i < x);
```
# break and continue statement
```javascript
var i = 0;

while(i < 100) {
  console.log('i is：' + i);
  i++;
  if (i === 10) break;
}
```
```javascript
for (var i = 0; i < 5; i++) {
  console.log(i);
  if (i === 3)
    break;
}
// 0
// 1
// 2
// 3
```
```javascript
var i = 0;

while (i < 100){
  i++;
  if (i%2 === 0) continue;
  console.log('i is：' + i);
}
```
