##JS实现继承
* ES6
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
*ES5构造函数实现
```javascript
function User(name, sex) {
  this.name = name;
  this.sex = sex;
  this.getName = function() {
    console.log(this.name)
  };
  this.getSex = function() {
    console.log(this.sex);
  }
}
User.prototype.all = function() {
  console.log(this.name, this.sex);
}
const Tom = new User('Tom', 'man');
Tom.getName();
Tom.getSex();
Tom.all();
console.log(Tom);
function Students(name, sex, id) {
  this.id = id;
  this.name = name;
  this.sex = sex;
  this.getSth = function() {
    console.log(this.name, this.sex, this.id);
  }
}
Students.prototype = new User()
const xiaoming = new Students('xm', 'man', 'swe12099');
xiaoming.getName();
xiaoming.getSex();
xiaoming.getSth();
console.log(xiaoming);
```
