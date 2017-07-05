/**
 * Please preview the following links carefully before doing the exercises below.
 * http://es6.ruanyifeng.com/#docs/promise
 * https://ponyfoo.com/articles/es6-promises-in-depth
 * https://github.com/getify/You-Dont-Know-JS/blob/master/async%20%26%20performance/ch3.md
 *
 */


//#1
//What is Promise. Try to describe it in a short sentence.

//#2
//How many states a Promise object possibly has?

//#3
//Is it possible to cancel a Promise?

//#4
//What would be printed out?
const promise = new Promise((resolve, reject) => {
    console.log('New Promise');
    resolve();
});

promise.then(() => console.log('Resolved')).then(() => console.log('Resolved-1'));
promise.then(() => console.log('Resolved-2'));
console.log('Hello');
//Your answer:


//#5
//What would be printed out?
setTimeout(() => console.log('1'), 0);
const p1 = new Promise((resolve, reject) => {
    console.log('2');
    resolve();
});

p1.then(() => console.log('3')).then(() => console.log('4'));
p1.then(() => setTimeout(() => console.log('5'), 0)).then(() => console.log('6'));
console.log('7');
//Your answer:


//#6
//What would be printed out?
const p2 = new Promise((resolve, reject) => {
    console.log('1');
    reject();
    resolve();
});

p2.then(() => console.log('2'), () => console.log('3')).catch(() => console.log('4')).then(() => console.log('5'));
//Your answer:


//#7
//What would be printed out?
const p3 = new Promise((resolve, reject) => {
    resolve(x + 2);
});

p3.catch(() => console.log('2')).then(() => console.log('3'));
//Your answer:

//#8
//What would be printed out?
const thenable = {
    then() {
        return 'thenable';
    }
};
Promise.resolve(thenable).then(value => console.log('hello' + value));

//#9
//What would be printed out?
const pm1 = new Promise( (resolve,reject) => resolve( "B" ) );
const pm2 = new Promise( (resolve,reject) => resolve( pm1 ) );
const pm3 = new Promise( (resolve,reject) => resolve( "A" ) );

pm2.then( v => console.log( v ) );
pm3.then( v => console.log( v ) );
//Your answer:


//#10
const pr1 = Promise.resolve( 42 );

const pr2 = Promise.resolve( pr1 );

console.log(pr1 === pr2); // What is the result?


//#11
//What would be printed out?
const prms = Promise.resolve(10);

prms.then(val => {
    return new Promise((resolve, reject) => {
        setTimeout(() => resolve(val * 2), 10);
    })
}).then(val => console.log(val));
//Your answer


//#12
/**
 Given an array which contains both promise instance and primitive value.
 Write a function called "promiseEach" to iterate the given array to print their value(resolved value for promise, the value itself for primitive value) to the console serially(which means the second item of array should be run/printed after the first one(promise) done).
 NOTE: do not use any 3rd part library.

 */
const delay = (time = 50) => {
    return new Promise((resolve, reject) => {
        setTimeout(resolve, time);
    });
};
const proms1 = Promise.resolve(delay()).then(() => 1);
const proms2 = Promise.resolve(2);
const val3 = 3;

const array = [proms1, proms2, val3];
function promiseEach(promises = []) {
    //Write your code here, do not utilize any 3rd library
}

promiseEach(array); // the console will print the number 1, 2 and 3 in order.


//#13
//Given a function below which is a callback-based function which callback is error first function.
//For the simplicity, if the first argument is given 0, the error will be created and passed to callback.
function doAsync(val, callback) {
    let error = null;
    if(val === 0) {
        error = new Error('Error message!');
    }
    setTimeout(() => callback(error, val), 50);
}
//Given a function which is error first function. If there is error, print the error message, otherwise print second argument.
function printValue(err, result) {
    if(err) {
        console.error(err.message);
    } else {
        console.log(result);
    }
}

doAsync(1, printValue); // 1
doAsync(0, printValue); //Error message!

/**
 Write helper function to promisify(lift) the function "doAsync", so that it can be used as a promise like the example shown. Do not utilize any 3rd party library.
 */
function promisify(fn) {
    //Write your code here and do not use any 3rd party library.
}

const promiseAware = promisify(doAsync);
promiseAware(1).then(console.log); // 1
promiseAware(0).catch(reason => console.error(reason.message)); //Error message!



//#14
//What's the state of racePromise?
const racePromise = Promise.race([]);
//your answer:


//#15
//Could explain what is the problem of the function below? If you were the author, how do you refactor it?
function badFunc(val) {
    if(val <= 0) {
        throw new Error('Error happened');
    }
    return Promise.resolve(val);
}
//Write your solution here.
function betterFunc(val) {
    //Write your code here
}


//#16
//Create a helper functin in Promise object - Promise.first, which accepts an array of promises or combination of promises and primitive value. It works this way: the promise returned from Promise.first can be resolved when the first promise of given promises is resolved. If all given promises are rejected, then the main promise is rejected.
if(!Promise.first) {
    Promise.first = function(prs) {
        //write your code here
    }
}

//E.g. it can be used this way:
//Promise.first([promise1, 1, promise2]);






