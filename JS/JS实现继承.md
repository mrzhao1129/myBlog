## JS实现继承
* ES6（完美）
```javascript
class User {
  constructor(name, sex) {
    this.name = name;
    this.sex = sex;
  }
  getName() {
    console.log(this.name)
  };
  getSex() {
    console.log(this.sex);
  }
}
User.prototype.all = function() {
  console.log(this.name, this.sex);
}
const Tom = new User('Tom', 'man');
Tom.all();
console.log(Tom);
//User {name: "Tom", sex: "man"}
//	name:"Tom"
//	sex:"man"
//	__proto__:
//		all:function ()//可枚举
//		constructor:class User
//		getName:function getName()//不可枚举
//		getSex:function getSex()//不可枚举
//		__proto__:Object
class Students extends User {
  constructor(name, sex, id) {
    super(name, sex);
    this.id = id;
  }
  getSth() {
    console.log(this.name, this.sex, this.id);
  }
}
const xiaoming = new Students('xm', 'man', 'swe12099');
console.log(xiaoming);
//Students {name: "xm", sex: "man", id: "swe12099"}
//	id:"swe12099"
//	name:"xm"
//	sex:"man"
//	__proto__:User
//		constructorclass Students
//		getSth:function getSth()
//		__proto__:
//			all:function ()
//			constructor:class User
//			getName:function getName()
//			getSex:function getSex()
//			__proto__:Object
```
* ES5构造函数实现
1. 原型链继承
```javascript
function User(name, sex) {
  //实例属性与方法
  this.name = name;
  this.sex = sex;
  //实例引用属性（单个用例修改后，其他用例全部更改）
  this.address = ['add', 'add1'];
  this.getName = function() {
    console.log(this.name)
  };
  this.getSex = function() {
    console.log(this.sex);
  }
}
User.prototype.getAll = function() {
  console.log(this.name, this.sex);
}
const Tom = new User('Tom', 'man');
console.log(Tom);
//User {name: "Tom", sex: "man", address: Array(2), getName: f, getSex: f}
//  address:(2) ["add", "add1"]
//  getName:f ()
//  getSex:f ()
//  name:"Tom"
//  sex:"man"
//  __proto__:
//    getAll:f ()
//    constructor:f User(name, sex)
//    __proto__:Object
function Students(name, sex, id) {
  this.id = id;
  this.name = name;
  this.sex = sex;
  this.getAll = function() {
    console.log(this.name, this.sex, this.id);
  }
}
Students.prototype = new User()
const xiaoming = new Students('xm', 'man', 'swe12099');
xiaoming.getAll();//xm man swe12099
console.log(xiaoming.address);//[ 'add', 'add1' ]
console.log(xiaoming);
//Students {id: "swe12099", name: "xm", sex: "man", getAll: f}
//  getAll:f ()
//  id:"swe12099"
//  name:"xm"
//  sex:"man"
//  __proto__:User
//    address:(3) ["add", "add1", "add3"]
//    getName:f ()
//    getSex:f ()
//    name:undefined
//    sex:undefined
//    __proto__:
//    getAll:f ()
//    constructor:f User(name, sex)
//    __proto__:Object
const xiaohua = new Students('xh', 'woman', 'swe12100');
xiaohua.getAll();//xh woman swe12100
xiaoming.address.push('add3');
console.log(xiaoming.address);//[ 'add', 'add1', 'add3' ]
console.log(xiaohua.address);//[ 'add', 'add1', 'add3' ]
```
> 存在问题：
> 1. 实例引用属性修改会引起所有实例相关属性变化。
> 2. 无法向父类传递属性和方法  
2. 组合继承
```javascript
function User(name, sex) {
  //实例属性与方法
  this.name = name;
  this.sex = sex;
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
//User {name: "Tom", sex: "man", address: Array(2)}
//  address:(2) ["add", "add1"]
//  name:"Tom"
//  sex:"man"
//  __proto__:
//    getAll:f ()
//    getName:f ()
//    getSex:f ()
//    constructor:f User(name, sex)
//    __proto__:Object
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
//Students {name: "xm", sex: "man", address: Array(2), id: "swe12099"}
//  address:(3) ["add", "add1", "add3"]
//  id:"swe12099"
//  name:"xm"
//  sex:"man"
//  __proto__:User
//    address:(2) ["add", "add1"]
//    getAll:f ()
//    name:undefined//问题所在
//    sex:undefined//问题所在
//    __proto__:
//      getAll:f ()
//      getName:f ()
//      getSex:f ()
//      constructor:f User(name, sex)
//      __proto__:Object
const xiaohua = new Students('xh', 'woman', 'swe12100');
xiaohua.getAll();//xh woman swe12100
xiaoming.address.push('add3');
console.log(xiaoming.address);//[ 'add', 'add1', 'add3' ]
console.log(xiaohua.address);//[ 'add', 'add1' ]
```
> 解决了原型链继承中存在的两个问题

[参考](https://www.cnblogs.com/ayqy/p/4471638.html)
