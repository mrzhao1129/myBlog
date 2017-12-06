//扁平对象
console.log([].concat.apply([1, 2], [[11], [12]]));



/**
 * jquery的深拷贝提取
 * 修改基于jquery 3.2.2-pre /src/core.js
 * 
 * @param deep 可选。 Boolean类型 指示是否深度合并对象，默认为false。
 *             如果该值为true，且多个对象的某个同名属性也都是对象，则该"属性对象"的属性也将进行合并。
 * @param clone Object类型 目标对象，其他对象的成员属性将被附加到该对象上。
 * @param copy 可选。 Object类型 第一个被合并的对象。
 * @param copyN
 */
// jQuery.extend = jQuery.fn.extend = function() {
// function deepclone( deep, clone, copy ) {
function deepclone() {
  var options, name, src, copy, copyIsArray, clone,
    target = arguments[ 0 ] || {},
    i = 1,
    length = arguments.length,
    deep = false;//层数

  // Handle a deep copy situation 判断deep掺入是否传入
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
        if ( deep && copy && ( isPlainObject( copy ) ||
          ( copyIsArray = Array.isArray( copy ) ) ) ) {

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
var b = deepclone(true,e, a);
a.c.d = 4;
e.e = 'd';
console.log(c, b);
console.log(Object.toString());
/**
 * test
 * obj.toStrinng()
 * toSring.call(obj)
 * typeof
 * Object.getPrototypeOf()
 */
// toString()返回值测试
var obj = {test: 1, doSome: function() {}};
var fun = function (){var a = 1;}
var arr = [0, 1, 2];
var num = 2;
var is = true;
var udf = undefined;
var nl = null;

console.log(obj.toString(), toString.call(obj), typeof obj,);
// [object Object] [object Object]
console.log(fun.toString(), toString.call(fun), typeof fun, Object.getPrototypeOf(fun));
// function (){var a = 1;} [object Function]
console.log(arr.toString(), toString.call(arr), typeof arr, Array.isArray(arr), Object.getPrototypeOf(arr));
// 0,1,2 [object Array] object true
// Array.isArray 是ES2015的方法，IE9兼容。
console.log(num.toString(), toString.call(num), typeof num, Object.getPrototypeOf(num));
// 2 [object Number]
console.log(is.toString(), toString.call(is), typeof is, Object.getPrototypeOf(is));
// true [object Boolean]
// console.log(udf.toString());//Cannot read property 'toString' of undefined
console.log(toString.call(udf), typeof udf);
// [object Undefined]
// console.log(nl.toString());//Cannot read property 'toString' of null
console.log(toString.call(nl), typeof nl);
// [object Null]
console.log('------------------------------------------------------------------------')
// 返回指定对象的原型
console.log(Object.getPrototypeOf(obj));
// 判定对象是否存在指定方法（不包含原型）
console.log(obj.hasOwnProperty('doSome'));
console.log(hasOwnProperty.call(obj, 'test'));


function User(name, sex) {
  //实例属性与方法
  this.name = name;
  this.sex = sex;
  //实例引用属性（单个用例修改后，其他用例全部更改）
  this.address = ['add', 'add1'];
}
User.prototype.getAll = function() {
  console.log(this.name, this.sex);
}
User.prototype.getName = function() {
  console.log(this.name)
};
User.prototype.getSex = function() {
  console.log(this.sex);
}
const Tom = new User('Tom', 'man');
console.log(Tom);
function Students(name, sex, id) {
  User.call(this, name, sex);
  this.id = id;
}
Students.prototype = new User();
Students.prototype.getAll = function() {
  console.log(this.name, this.sex, this.id);
}
const xiaoming = new Students('xm', 'man', 'swe12099');
xiaoming.getAll();//xm man swe12099
console.log(xiaoming.address);//[ 'add', 'add1' ]
console.log(xiaoming);
const xiaohua = new Students('xh', 'woman', 'swe12100');
xiaohua.getAll();//xh woman swe12100
xiaoming.address.push('add3');
console.log(xiaoming.address);//[ 'add', 'add1', 'add3' ]
console.log(xiaohua.address);//[ 'add', 'add1', 'add3' ]