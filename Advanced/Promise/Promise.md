# What is Promise
A promise represents the eventual value returned from the single completion of an operation. A promise may be in one of the three states, unfulfilled, fulfilled, and failed. The promise may only move from unfulfilled to fulfilled, or unfulfilled to failed. Once a promise is fulfilled or failed, the promise's value MUST not be changed, just as a values in JavaScript, primitives and object identities, can not change (although objects themselves may always be mutable even if their identity isn't). The immutable characteristic of promises are important for avoiding side-effects from listeners that can create unanticipated changes in behavior and allows promises to be passed to other functions without affecting the caller, in same way that primitives can be passed to functions without any concern that the caller's variable will be modified by the callee.

In short the Promise is:
   * Future Value
      * time independent
      * can either indicate a success or failure
   * Completion Event
      * flow-control mechanism 
      * this-then-that 
      * two or more steps in asynchronous task

Promise has two characteristics:
   1. Promise's state cannot be changed from outside. It contains three states: Pending, Resolved, Rejected. 
   2. Once a Promise is resolved, it stays that way forever -- it becomes an immutable value at that point -- and can then be observed as many times as necessary.

Promises are a pattern that augments callbacks with trustable semantics, so that the behavior is more reason-able and more reliable. By uninverting the inversion of control of callbacks, we place the control with a trustable system (Promises) that was designed specifically to bring sanity to our async.

Promises, have been around quite a while and are defined by a spec called [Promise/A+](https://promisesaplus.com/). ES6 has adopted this spec for its Promise implementation; but there are other Promise libraries out there such as Q, Bluebird, RSVP and others that adhere to this spec and offer other features on top of it.

# The drawback of Promise
   * Cannot be cancelled. 
   * The internal error would not be exposed to outside if not specified catch handler
   * Not able to know the current progress/phase of the operation when it is pending state.

NOTE: No individual Promise should be cancelable, but it's sensible for a sequence to be cancelable, because you don't pass around a sequence as a single immutable value like you do with a Promise.


# API of Promise
## The constructor of Promise
Promise is a constructor used for creating an instance of Promise. 
```javascript
var promise = new Promise(function(resolve, reject) {
  // ... some code

  if (/** asynchronous operation succeed */){
    resolve(value);
  } else {
    reject(error);
  }
});
````
`resolve` and `reject` are two functions deployed by JavaScript engine. 
`resolve` is used to change the state from pending to resolved and meanwhile passing the result of asynchronous to next handler(thenable)
`reject` is used to change the state from pending to rejected and meanwhile passing the error of asynchronous operation to error handler(catch)

After the creation of the Promise, it will be called immediately. 
```javascript
let promise = new Promise(function(resolve, reject) {
  console.log('Promise');
  resolve();
});

promise.then(function() {
  console.log('Resolved.');
});

console.log('Hi!');

// Promise
// Hi!
// Resolved
````
As you can see the 'Resolved.' will be output after the 'Hi!', which means the statement in the then will be called after all current synchronous operations done.

Here is an example to use Promise to implement Ajax operations:
```javascript
var getJSON = function(url) {
  var promise = new Promise(function(resolve, reject){
    var client = new XMLHttpRequest();
    client.open("GET", url);
    client.onreadystatechange = handler;
    client.responseType = "json";
    client.setRequestHeader("Accept", "application/json");
    client.send();

    function handler() {
      if (this.readyState !== 4) {
        return;
      }
      if (this.status === 200) {
        resolve(this.response);
      } else {
        reject(new Error(this.statusText));
      }
    };
  });

  return promise;
};

getJSON("/posts.json").then(function(json) {
  console.log('Contents: ' + json);
}, function(error) {
  console.error('出错了', error);
});
````

Consider: 
```javascript
var p1 = new Promise(function (resolve, reject) {
  // ...
});

var p2 = new Promise(function (resolve, reject) {
  // ...
  resolve(p1);
})
````
If the argument of `resolve` is also an instance of Promise as the example above. Then the state of p1 will be passed to p2, on the other hand, p1's state determines the state of p2. 
If p1 is `pending`, then p2's thenable function will not be called until p1's state is changed.  Consider below:
```javascript
var p1 = new Promise(function (resolve, reject) {
  setTimeout(() => reject(new Error('fail')), 3000)
})

var p2 = new Promise(function (resolve, reject) {
  setTimeout(() => resolve(p1), 1000)
})

p2
  .then(result => console.log(result))
  .catch(error => console.log(error))
// Error: fail
````
As p2 returns another Promise(p1), so p2's state will not be resolved after 1000ms until the p1 is rejected after 3000ms. 


## Promise.prototype.then(fulfilledCallback, rejectedCallback)
`then` returns another Promise instance(Note: not the original one). Thus, it it able to call them as a chain, on the other word call another `then` after a `then`.
```javascript
getJSON("/posts.json").then(function(json) {
  return json.post;
}).then(function(post) {
  // ...
});
```

For chained `then`s, if the former `then` returns a Promise instance, the next `then`'s callback will not be called until the former one is resolved. (the same as for .catch)
```javascript
getJSON("/post/1.json").then(function(post) {
  return getJSON(post.commentURL);
}).then(function funcA(comments) {
  console.log("Resolved: ", comments);
}, function funcB(err){
  console.log("Rejected: ", err);
});
````
The callback in first `then` is also returning a Promise instance, so the `funcA` and `funcB` will waiting for the state change of that callback. If the callback is changed into Resolved, then `funcA` will be called. If it is changed into Rejected, then `funcB` will be called. 

## Promise.prototype.catch(rejectedCallback)
`Promise.prototype.catch` is the alias for `.then(null, rejection)` and is used to specify error handler. 
```javascript
p.then((val) => console.log('fulfilled:', val))
  .catch((err) => console.log('rejected', err));

// the same as
p.then((val) => console.log('fulfilled:', val))
  .then(null, (err) => console.log("rejected:", err));
````
See an example below:
```javascript
var promise = new Promise(function(resolve, reject) {
  throw new Error('test');
});
promise.catch(function(error) {
  console.log(error);
});
// Error: test
````

Consider the counterparts below how to handle the errors.
 ```javascript
 // Way 1
 var promise = new Promise(function(resolve, reject) {
   try {
     throw new Error('test');
   } catch(e) {
     reject(e);
   }
 });
 promise.catch(function(error) {
   console.log(error);
 });
 
 // Way 2
 var promise = new Promise(function(resolve, reject) {
   reject(new Error('test'));
 });
 promise.catch(function(error) {
   console.log(error);
 });
 ````
 I have already mentioned that Promise's state cannot be changed anymore once it is resolved or rejected. So it does nothing if throwing an error after the promise is resolved. 
 ```javascript
 var promise = new Promise(function(resolve, reject) {
   resolve('ok');
   throw new Error('test');
 });
 promise
   .then(function(value) { console.log(value) })
   .catch(function(error) { console.log(error) });
 // ok
 ````
 
Promise's error can bubble, it will not stop bubbling until it is caught by next `catch` statement.  
```javascript
getJSON('/post/1.json').then(function(post) {
  return getJSON(post.commentURL);
}).then(function(comments) {
  // some code
}).catch(function(error) {
  // one of three promises ahead throws error, will be caught here.
});
````
 
 Unlike the `try/catch` block, if there is no `catch` at all for the promise chain. the error thrown will not pass to outside (uncaught exception). 
 ```javascript
 var someAsyncThing = function() {
   return new Promise(function(resolve, reject) {
     // the next line would throw an error as x is undefined, 
     resolve(x + 2);
   });
 };
 
 someAsyncThing().then(function() {
   console.log('everything is great');
 });
 ````
 As there is no `catch` specified, so the error will not be caught, which results in no output in console. 
 NOTE: Chrome browser doesn't follow this rule, it will throw `ReferenceError: x is not defined`. 
 
 But consider the case below:
 ```javascript
 var promise = new Promise(function(resolve, reject) {
   resolve('ok');
   setTimeout(function() { throw new Error('test') }, 0)
 });
 promise.then(function(value) { console.log(value) });
 // ok
 // Uncaught Error: test
 ````
Why the console still can get the uncaught error for this case? It is because the timeout function will be called after this promise is done, so that the error would bubble to outside and be uncaught error. 

There is an `unhandleRejection` event, which is used to capture uncaught `reject` error. 
```javascript
process.on('unhandledRejection', function (err, p) {
  console.error(err.stack)
});
````
`catch` also returns a Promise instance, see example below:
```javascript
var someAsyncThing = function() {
  return new Promise(function(resolve, reject) {
    // x is undefined
    resolve(x + 2);
  });
};

someAsyncThing()
.catch(function(error) {
  console.log('oh no', error);
})
.then(function() {
  console.log('carry on');
});
// oh no [ReferenceError: x is not defined]
// carry on
````
If there is no error thrown, the `catch` will be skipped. 

NOTE: always use catch instead of defining rejection handlers as the second argument for `then` calls.

## Promise Patterns
### Promise.resolve
`Promise.resolve` is to convert an value to a Promise instance. 
```javascript
Promise.resolve('foo')
// the same as
new Promise(resolve => resolve('foo'))
```
When the argument of `Promise.resolve` is 
#### a Promise instance
`Promise.resolve` would not do nothing, just return it. 
####. a thenable object
`thenable` object is the object with `then` function. For example:
```javascript
let thenable = {
  then: function(resolve, reject) {
    resolve(42);
  }
};
````
`Promise.resolve` would convert the object to a real Promise instance and then call the `then` function immediately. 
```javascript
let thenable = {
  then: function(resolve, reject) {
    resolve(42);
  }
};

let p1 = Promise.resolve(thenable);
p1.then(function(value) {
  console.log(value);  // 42
});
````

#### non-thenable object, or not an object at all
If the argument is a primitive, or a non-themable object, the `Promise.resolve` would return a new Promise instance with state `Resolved`. Also the argument will be pass to next callback in next `then`
```javascript
var p = Promise.resolve('Hello');

p.then(function (s){
  console.log(s)
});
// Hello
````
#### no argument
`Promise.resolve` just returns a Promise instance with state `Resolved`. 
```javascript
var p = Promise.resolve();

p.then(function () {
  // ...
});
````

NOTE: immediately resolved Promise instance's callback will be called at the end of the current "event loop", not the beginning of next "event loop". 
Consider:
```javascript
setTimeout(function () {
  console.log('three');
}, 0);

Promise.resolve().then(function () {
  console.log('two');
});

console.log('one');

// one
// two
// three
````
Above, `setTimeout(fn, 0)` will run at the beginning of next round of "event loop", but `Promise.resolve` will run at the end of current "event loop". That's why "two" was printed out firstly.

### Promise.reject
`Promise.reject(reason)` returns another Promise instance with state `rejected`. 
```javascript
var p = Promise.reject('error happened');
// the same as
var p = new Promise((resolve, reject) => reject('happened'))

p.then(null, function (s) {
  console.log(s)
});
// error happened
````
Unlike `Promise.resolve`, `Promise.reject` would return the reason directly as the argument for the next error handler. 
```javascript
const thenable = {
  then(resolve, reject) {
    reject('error happened');
  }
};

Promise.reject(thenable)
.catch(e => {
  console.log(e === thenable)
})
// true, not "error happened"
````

### Promise.all
`Promise.all` is used to wrap one or more Promise instance to a new Promise instance. 
```javascript
var p = Promise.all([p1, p2, p3]);
````
p1, p2 and p3 should all be Promise instances, if not, they will be converted to Promise instance by `Promise.resolve`. Also the argument of `Promise.all` can be either `Array` or `Iterable` object.

p's state is determined by p1, p2, p3
   * only when p1,p2 and p3 are all fulfilled, p's state -> fulfilled. the returned value would be `[p1Result, p2Result, p3Result]`
   * as long as one of p1, p2 and p3 is rejected, p's state -> rejected. the returned value would be the error rejected from the first one.
    
See example below:
```javascript
const databasePromise = connectDatabase();

const booksPromise = databasePromise
  .then(findAllBooks);

const userPromise = databasePromise
  .then(getCurrentUser);

Promise.all([
  booksPromise,
  userPromise
])
.then(([books, user]) => pickTopRecommentations(books, user));
````

### Promise.race
`Promise.race` is also used to wrap multiple Promise instances to one Promise instance. 
```javascript
var p = Promise.race([p1, p2, p3]);
````
Like the name of race, `Promise.race`'s state is determined by the first changed Promise instance. The first changed Promise instance's return value would be the value for `Promise.race`. 

Consider:
```javascript
const p = Promise.race([
  fetch('/resource-that-may-take-a-while'),
  new Promise(function (resolve, reject) {
    setTimeout(() => reject(new Error('request timeout')), 5000)
  })
]);
p.then(response => console.log(response));
p.catch(error => console.log(error));
````
If the `fetch` function cannot return result in 5 seconds, the p's state will be changed into `rejected`.  

### Promise.try
`Promise.try` is to simulate the `try...catch...` block. It can be used to capture both synchronous and asynchronous errors. 
Consider:
```javascript
database.users.get({id: userId})
.then(...)
.catch(...)
```
if there is an error happened synchronously in `database.users.get` for some reasons. the `.catch` block cannot capture any error.Then you have to do below:
```javascript
try {
  database.users.get({id: userId})
  .then(...)
  .catch(...)
} catch (e) {
  // ...
}
````
But it looks ugly,doesn't it?  Then it would be great to change it by using `Promise.try` to wrap it. 
```javascript
Promise.try(database.users.get({id: userId}))
  .then(...)
  .catch(...)
````

The advantages of `Promise.try` are: 
   1. Better error handling; synchronous errors are propagated as rejections, no matter where in the process they occur.
   2. Better interoperability; no matter what Promises implementation the third-party method uses, you will always be working with your preferred implementation.
   3. Easier to 'scan'; all code is horizontally at the same indentation level, so it's easier to see what's going on at a glance.

More information, please refer to http://cryto.net/~joepie91/blog/2016/05/11/what-is-promise-try-and-why-does-it-matter/ 

Also you can refer to the API of Bluebird: http://bluebirdjs.com/docs/api/promise.try.html 

### finally
`finally` is not in the scope of ES6, but is the proposal in ES7. The callback in the `finally` will be called no matter the state of Promise instance is rejected or resolved. 
Here is an example:
```javascript
server.listen(0)
  .then(function () {
    // run test
  })
  .finally(server.stop);
````
Its implementation is very simple:
```javascript
Promise.prototype.finally = function (callback) {
  let P = this.constructor;
  return this.then(
    value  => P.resolve(callback()).then(() => value),
    reason => P.resolve(callback()).then(() => { throw reason })
  );
};
````
Note: the final value cannot be modified from the handler in `finally`. 

See another example how and when to use it. 
```javascript
function ajaxGetAsync(url) {
    return new Promise(function (resolve, reject) {
        var xhr = new XMLHttpRequest;
        xhr.addEventListener("error", reject);
        xhr.addEventListener("load", resolve);
        xhr.open("GET", url);
        xhr.send(null);
    }).finally(function() {
        $("#ajax-loader-animation").hide();
    });
}
````

### Promisify
ES6 didn't provide an utitlity to convert a callback-based code to promise-aware code, but there are many libraries provide such utility. 
Even without a library, you can do a simple one like this:
```javascript
// polyfill-safe guard check
if (!Promise.wrap) {
	Promise.wrap = function(fn) {
		return function() {
			var args = [].slice.call( arguments );

			return new Promise( function(resolve,reject){
				fn.apply(
					null,
					args.concat( function(err,v){
						if (err) {
							reject( err );
						}
						else {
							resolve( v );
						}
					} )
				);
			} );
		};
	};
}
````
It takes a function that expects an error-first style callback as its last parameter, and returns a new one that automatically creates a Promise to return, and substitutes the callback for you, wired up to the Promise fulfillment/rejection.

How to use it?
```javascript
var request = Promise.wrap( ajax );

request( "http://some.url.1/" )
.then( .. )
..
```
The act of wrapping a callback-expecting function to be a Promise-aware function is sometimes referred to as "lifting" or "promisifying".


## Libraries
### Bluebird
http://bluebirdjs.com/docs/api-reference.html 
Use bluebird as Promise implementation, the advantage of bluebird are:
   * It acts as a thin compatibility layer and abstracts away differences in implementations
   * It provides a [better performance](http://programmers.stackexchange.com/questions/278778/why-are-native-es6-promises-slower-and-more-memory-intensive-than-bluebird). Though I guess the native implementations will catch up soon
   * It provides [additional useful features](https://github.com/petkaantonov/bluebird#features)


#### Promise.map
See: http://bluebirdjs.com/docs/api/promise.map.html 

#### Promise.each
See: http://bluebirdjs.com/docs/api/promise.each.html 

#### Promisification
Promise.promisify, Promise.promisifyAll, Promise.fromCallback
See: http://bluebirdjs.com/docs/api/promisification.html

# References
   * http://es6.ruanyifeng.com/#docs/promise 
   * https://github.com/getify/You-Dont-Know-JS/blob/master/async%20%26%20performance/ch3.md 
   * http://www.ruanyifeng.com/blog/2012/12/asynchronous%EF%BC%BFjavascript.html 
   * http://cryto.net/~joepie91/blog/2016/05/11/what-is-promise-try-and-why-does-it-matter/ 


# Exercise
Try [Promise exercise](Advanced/Exercise/Promise.js) here to grab all key points. 

# Presentation & Video
See [Promise presentation](https://sharenet-ims.int.net.nokia.com/livelink/livelink?func=ll&objaction=overview&objid=555094629) for the course presentation. 
See [Promise_video](https://sharenet-ims.int.net.nokia.com/livelink/livelink?func=ll&objaction=overview&objid=555122276) for the course video. 

