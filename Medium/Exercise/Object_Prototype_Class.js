/**
 http://javascript.ruanyifeng.com/stdlib/object.html#toc6
 http://javascript.ruanyifeng.com/stdlib/attributes.html
 http://javascript.ruanyifeng.com/oop/basic.html
 http://javascript.ruanyifeng.com/oop/prototype.html
 http://javascript.ruanyifeng.com/oop/object.html
 http://javascript.ruanyifeng.com/oop/pattern.html
 http://es6.ruanyifeng.com/#docs/class
 https://github.com/getify/You-Dont-Know-JS/tree/master/this%20%26%20object%20prototypes

 *
 */


//#0
//Please write down the steps what the `new` operator would do to invoke a constructor?
//Your answer:

//#1
//What is the result(true or false) for following checks?
new Object(123) instanceof Number //your answer:
Object(true) instanceof Boolean //your answer:
Object(null) instanceof Object //your answer:
var s = 'hello';
s instanceof String //your answer:

let obj1 = {a: 1};
let obj2 = new Object(obj1);
obj1 === obj2;  //your answer:


//#2
//What is the result would be printed out to the console?
let arr1 = ['a', 'b'];
console.log(Object.getOwnPropertyNames(a)); //your answer:



//#3
//What is the result of o.p?
var o = {};
Object.defineProperty(o, 'p', {
    value: "bar"
});
o.p = 'foobar';
o.p //your answer:


//#4
//What is the result of o.next?
var o ={
    $n : 5,
    get next() { return this.$n++ },
    set next(n) {
        if (n >= this.$n) this.$n = n;
        else throw '新的值必须大于当前值';
    }
};
o.next //your answer:
o.next = 10;
o.next //your answer:
o.next //your answer:


//#5
//What is the result?
var Vehicle = function () {
    this.price = 1000;
    return 1000;
};

(new Vehicle()) === 1000 //your answer:

var Car = function() {
    this.wheelsCount = 4;
    this.price = 100000;
    return {
        brand: 'BMW'
    };
}

console.log(new Car().price); //your answer:


//#6
//What's the result?
function Constr() {}
var x = new Constr();

var y = new x.constructor();
var z = new Constr.prototype.constructor();
y instanceof Constr //your answer:
z instanceof Constr //your answer:


//#7
//What's the result?
function A() {}
var a = new A();
a instanceof A //your answer:

function B() {}
A.prototype = B.prototype;
a instanceof A //your answer:
vr anotherA = new A();
anotherA instanceof A; //your answer
anotherA instanceof B; //your answer


//#8
//What is the result?
function C() {};
var boundC = C.bind({});
boundC instanceof C //your answer:
boundC.prototype //


//#9
//What's the result?
var anotherObject = {
    a: 2
};
var myObject = Object.create( anotherObject );
anotherObject.a; //your answer:

myObject.a++; // oops, implicit shadowing!

anotherObject.a; //your answer:


//#10
//List the prototypes for the below statements
Object.getPrototypeOf({}) //your answer:
function f() {}
Object.getPrototypeOf(f) //your answer:

var f = new F();
Object.getPrototypeOf(f) //your answer:


//#11
//what is the result?
function A() {}
var a = new A();
var b = Object.create(a);
var c = Object.create(null);
console.log(b.constructor === A); //your answer:
console.log(b instanceof A) //your answer:
Object.prototype.isPrototypeOf(c) //your answer:



//#12
//Write down your answer:
var P = function () {};
var p = new P();

var C = function () {};
C.prototype = p;
var c = new C();

console.log(c.constructor.prototype === C.prototype); //your answer:
console.log(c.constructor.prototype === p) //your answer:



//#13
//Please write a function to return an array which includes all the given object's own properties and its inherited properties.

function inheritedPropertyNames(obj) {

}

console.log(inheritedPropertyNames(Date));
// [
//  "caller",
//  "constructor",
//  "toString",
//  "UTC",
//  "call",
// more properties...



//#14
//Provide your answers:
class A {
}

class B extends A {
}

B.__proto__ === A //your answer:
B.prototype.__proto__ === A.prototype //your answer:


//#15
//What would be printed to the console?
class A {
    p() {
        return 2;
    }
}

class B extends A {
    constructor() {
        super();
        console.log(super.p());
    }
}

let b = new B();
//Your answer:


//#16
//What is the result?
class A {
    constructor() {
        this.p = 2;
    }
}

A.prototype.q = 2;

class B extends A {
    get m() {
        return super.p;
    }

    get n() {
        return super.q;
    }
}

let b = new B();
b.m //your answer:
b.n //your answer:


//#17
//What would be printed to the console.
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

Child.myMethod(1); //your answer:

var child = new Child();
child.myMethod(2); //your answer:



//#18
//Write down your answers for the results.
var p1 = new Point(2, 3);
var p2 = new ColorPoint(2, 3, 'red');

p2.__proto__ === p1.__proto__ //true or false? your answer:
p2.__proto__.__proto__ === p1.__proto__ //true or false? your answer:


p2.__proto__.__proto__.printName = function () {
    console.log('Ha');
};

p1.printName() //What's would be printed out to the console? Your answer:





//#19
//What is the result?
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

var colors = new MyArray();
colors[0] = "red";
colors.length  //your answer:



//#20 How to write a class which can only be used for inheritance? Throwing an exception if this class is called by "new CanOnlyBeInheritedClass()";
class CanOnlyBeInheritedClass {
    //put your implementation here
}

var NotOk = new CanOnlyBeInheritedClass(); // throw an error

class Ok extends CanOnlyBeInheritedClass {
    constructor() {
        super();
        //....
    }
}
var okToCreated = new Ok(); // working as normal.



//#21
//What is the result?
class C {
    constructor(id) {
        this.id = id;
    }
    id() {
        console.log( "Id: " + this.id );
    }
}

var c1 = new C( "c1" );
c1.id(); //Your answer:




//#22
class P {
    foo() { console.log( "P.foo" ); }
}

class C extends P {
    foo() {
        super.foo();
    }
}

var D = {
    foo: function() { console.log( "D.foo" ); }
};

var E = {
    foo: C.prototype.foo
};

Object.setPrototypeOf( E, D );

E.foo(); //What would be printed to the console? Your answer:




