function 手写到从前() {
  function deepClone() {
    var copyResult =  {};
    var obj = arguments[0];
    //如果不是对象类型直接返回
    if(toString.call(obj) !== '[object Object]' && toString.call(obj) !== '[object Array]') {
      return obj;
    }
    var copyKeys = Object.keys(obj);
    for(var i = 0; i < copyKeys.length; i++) {
      copyResult[copyKeys[i]] = deepClone(obj[copyKeys[i]]);
    }
    return copyResult;
  }
  var a = {1:1};
  var b = {2:2, a, fu: function(){}};
  var c = deepClone(b);
  a[1] = 3;
  console.log(b, c);//{ '2': 2, a: { '1': 3 } } { '2': 2, a: { '1': 1 } }
}
function jquery啦() {
  function deepclone() {
    var options, name, src, copy, copyIsArray, clone,
      target = arguments[ 0 ] || {},
      i = 1,
      length = arguments.length,
      deep = false;//层数
    // Handle a deep copy situation
    if ( typeof target === "boolean" ) {
      deep = target;
      // Skip the boolean and the target
      target = arguments[ i ] || {};
      i++;
    }
    // Handle case when target is a string or something (possible in deep copy)
    // if ( typeof target !== "object" && !jQuery.isFunction( target ) ) { 
    if ( typeof target !== "object" && typeof target != "function" ) {
      target = {};
    }
    // Extend jQuery itself if only one argument is passed
    if ( i === length ) {
      target = this;
      i--;
    }
    for ( ; i < length; i++ ) {
      // Only deal with non-null/undefined values
      if ( ( options = arguments[ i ] ) != null ) {
        // Extend the base object
        for ( name in options ) {
          src = target[ name ];
          copy = options[ name ];
          // Prevent never-ending loop
          if ( target === copy ) {
            continue;
          }
          // Recurse if we're merging plain objects or arrays
          // 简单对象
          // if ( deep && copy && ( jQuery.isPlainObject( copy ) ||
          if ( deep && copy && 
            ( isPlainObject( copy ) || ( copyIsArray = Array.isArray( copy ) ) ) )
          {
            if ( copyIsArray ) {
              copyIsArray = false;
              clone = src && Array.isArray( src ) ? src : [];
            } else {
              // clone = src && jQuery.isPlainObject( src ) ? src : {};
              clone = src && isPlainObject( src ) ? src : {};
            }
            // Never move original objects, clone them
            // target[ name ] = jQuery.extend( deep, clone, copy );
            target[ name ] = deepclone( deep, clone, copy );
          // Don't bring in undefined values
          } else if ( copy !== undefined ) {
            target[ name ] = copy;
          }
        }
      }
    }
    // Return the modified object
    return target;
  };
  function isPlainObject( obj ) {
    var proto, Ctor;
    // Detect obvious negatives
    // Use toString instead of jQuery.type to catch host objects
    if ( !obj || toString.call( obj ) !== "[object Object]" ) {
      return false;
    }
    // proto = getProto( obj ); 
    proto = Object.getPrototypeOf( obj );
    // Objects with no prototype (e.g., `Object.create( null )`) are plain
    if ( !proto ) {
      return true;
    } 
    // Objects with prototype are plain iff they were constructed by a global Object function
    // Ctor = hasOwn.call( proto, "constructor" ) && proto.constructor;
    Ctor = proto.hasOwnProperty('constructor') && proto.constructor;
    // return typeof Ctor === "function" && fnToString.call( Ctor ) === ObjectFunctionString;
    return typeof Ctor === "function" && Ctor.toString() === Object.toString();
  }
  var a = {b: 1, c: {d: 2}};
  var e = {e: 'e'}
  var c = deepclone(e, a);
  var b = deepclone(true, e, a);
  a.c.d = 4;
  // e.e = 'd';
  console.log(c, b);
}
function 函数引用测试() {
  var a = function() {
    console.log(1);
  }
  var b = a;
  a = function() {
    console.log(2);
  }
  a();//2
  b();//1
  //数组引用测试
  var a = [1,2,3];
  var b = [4,5,a];
  a = [7,8,9];
  console.log(a);
  console.log(b);
}
function 迭代生成器() {
  function* born() {
    var index = 0;
    for(let i = 0; i < 20; i++) {
      yield index += 1;
    }
  }
  var son = born();
  console.log(son);
  // for(let i = 0; i < 20; i++) {
  //   console.log(son.next());
  // }
  for(let j of son) {
    console.log(j);
  }
  /////////////////////////////
  var testBorn = {};
  testBorn[Symbol.iterator] = function* () {
    yield 5;
    yield 6;
    yield 7;
  }
  for(let i of testBorn) {
    console.log(i);
  }
  console.log(testBorn);
}
