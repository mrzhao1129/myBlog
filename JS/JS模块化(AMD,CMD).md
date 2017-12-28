## JS模块化
自己的工作经历是从jquery模式是状态（非模块化），直接跳到了以react为基础的ES6模块化开发模式，中间跨过了AMD、CMD。最近事情比较少，就看看官方文档，稍微了解一下。重点了解了CMD，其他慢慢来。:pig:
>### 在HTML中直接导入
>### CommonJS
在nodejs中是通用的解决方案，但是该加载是同步加载，在浏览器中使用不合适。
>### AMD(require.js)
[DEMO](./source/AMD/test.html)
```javascript
//API
require([module], callback);
define(id, [depends], callback);
```
```javascript
define('alerts', function() {
  'use strict';
  var alertName = function(str) {
    alert('I am ' + str);
  };
  var alertAge = function(num) {
    alert('I am ' + num + " years old");
  };
  return {
    alertName,
    alertAge
  }
});
require(['alerts'], function(alert) {
  console.log(alert, window);
  alert.alertName('xiaoming');
  alert.alertAge('12');
})
```
>### CMD(sea.js)
CMD规范是阿里的玉伯提出来的，实现js库为sea.js。 它和requirejs非常类似，即一个js文件就是一个模块，但是CMD的加载方式更加优秀，是通过按需加载的方式，而不是必须在模块开始就加载所有的依赖。如下：

[DEMO](./source/CMD/my-exp/index.html)
```javascript
//模块定义
define(function(require, exports, module) {
  var $ = require('jquery');
  var Spinning = require('./spinning');
  exports.doSomething = ...
  module.exports = ...
})
//运行某个模块（单独文件，使用define定义）
seajs.use('url' [, functoin(module){}]);
```
#### 模块定义
```javascript
//-----模块定义-----
define(function(require, exports, module) {});
define({ "foo": "bar" });
define('I am a template. My name is {{name}}.');
//id模块标识,deps模块依赖,factory
define('hello', ['jquery'], function(require, exports, module) {});
//id 和 deps 参数可以省略。省略时，可以通过构建工具自动生成。

//-----判定当前页面是否有 CMD 模块加载器-----
if (typeof define === "function" && define.cmd) {
  // 有 Sea.js 等 CMD 模块加载器存在
}

//-----define factory第一个参数require------
//同步加载
var a = require('./a');
//异步加载（调用成功后调用callback）
require.async(id, callback);
//返回解析后的绝对路径
require.resolve('./b');

//-----define factory第二个参数 exports------
//对外提供 foo 属性
exports.foo = 'bar';
//对外提供 doSomething 方法
exports.doSomething = function() {};
//通过 return 直接提供接口
return {
  foo: 'bar',
  doSomething: function() {}
};
//或
module.exports = {
  foo: 'bar',
  doSomething: function() {}
};
//如果 return 语句是模块中的唯一代码，还可简化为：
define({
  foo: 'bar',
  doSomething: function() {}
});

//-----define factory第三个参数module------
module.id;//唯一标示符
module.uri;//模块的绝对路径
module.dependencies;//(Array)模块的依赖
module.exports;//注意：只能同步执行，不能再回调中调用
```
### ES6