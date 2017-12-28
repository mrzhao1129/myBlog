## JS模块化
自己的工作经历是从jquery模式是状态（非模块化），直接跳到了以react为基础的ES6模块化开发模式，中间跨过了AMD、CMD。最近事情比较少，就看看官方文档，稍微了解一下。重点了解了CMD，其他慢慢来。:pig:
>### 在HTML中直接导入
>### CommonJS
在nodejs中是通用的解决方案，但是该加载是同步加载，在浏览器中使用不合适。
>### AMD(require.js)
[DEMO](./source/AMD/test.html)
```javascript
// API
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
// 模块定义
define(function(require, exports, module) {
  var $ = require('jquery');
  var Spinning = require('./spinning');
  exports.doSomething = ...
  module.exports = ...
})
// 运行某个模块（单独文件，使用define定义）
seajs.use('url' [, functoin(module){}]);
```
#### 模块定义
```javascript
// -----模块定义-----
define(function(require, exports, module) {});
define({ "foo": "bar" });
define('I am a template. My name is {{name}}.');
// id模块标识,deps模块依赖,factory
define('hello', ['jquery'], function(require, exports, module) {});
// id 和 deps 参数可以省略。省略时，可以通过构建工具自动生成。

// -----判定当前页面是否有 CMD 模块加载器-----
if (typeof define === "function" && define.cmd) {
  // 有 Sea.js 等 CMD 模块加载器存在
}

// -----define factory第一个参数require------
// 同步加载
var a = require('./a');
// 异步加载（调用成功后调用callback）
require.async(id, callback);
// 返回解析后的绝对路径
require.resolve('./b');

// -----define factory第二个参数 exports------
// 对外提供 foo 属性
exports.foo = 'bar';
// 对外提供 doSomething 方法
exports.doSomething = function() {};
// 通过 return 直接提供接口
return {
  foo: 'bar',
  doSomething: function() {}
};
// 或
module.exports = {
  foo: 'bar',
  doSomething: function() {}
};
// 如果 return 语句是模块中的唯一代码，还可简化为：
define({
  foo: 'bar',
  doSomething: function() {}
});

// -----define factory第三个参数module------
module.id;// 唯一标示符
module.uri;// 模块的绝对路径
module.dependencies;// (Array)模块的依赖
module.exports;// 注意：只能同步执行，不能再回调中调用
```
#### 模块标识
1. http,https,file等协议下文件
1. 可以是相对（./）、绝对路径(/)
1. 顶级标识不以点（.）或斜线（/）开始， 会相对模块系统的基础路径（即 Sea.js 的 base 路径）来解析
1. 可以使seajs.config声明在alias中后直接用模块名调用
```javascript
// seajs 的简单配置
seajs.config({
  base: "../sea-modules/",
  alias: {
    "jquery": "jquery/jquery/1.10.1/jquery.js"
  }
})
```
#### 模块调用
```javascript
// 加载模块 main，并在加载完成时，执行指定回调
seajs.use('./main', function(main) {
  main.init();
});
// 并发加载模块 a 和模块 b，并在都加载完成时，执行指定回调
seajs.use(['./a', './b'], function(a, b) {
  a.init();
  b.init();
});
```
#### sea.config配置详情
```javascript
seajs.config({

  // 别名配置：模块名、地址统一管理
  alias: {
    'es5-safe': 'gallery/es5-safe/0.9.3/es5-safe',
    'json': 'gallery/json/1.0.2/json',
    'jquery': 'jquery/jquery/1.10.1/jquery'
  },

  // 路径配置：路径统一管理，和alias感觉一样，一个是文件，一个是地址
  paths: {
    'gallery': 'https://a.alipayobjects.com/gallery'
  },

  // 变量配置：在require中的路径中使用
  // var lang = require('./i18n/{locale}.js');
  vars: {
    'locale': 'zh-cn'
  },

  // 映射配置
  map: [
    ['http://example.com/js/app/', 'http://localhost/js/app/']
  ],

  // 预加载项
  preload: [
    Function.prototype.bind ? '' : 'es5-safe',
    this.JSON ? '' : 'json'
  ],

  // 调试模式
  debug: true,

  // Sea.js 的基础路径
  base: 'http://example.com/path/to/base/',

  // 文件编码
  charset: 'utf-8'
});
```
#### 构建工具
* [CMD 模块构建，从认识 Grunt 开始](https://github.com/seajs/seajs/issues/670)
* [如何使用 Grunt 构建一个中型项目](https://github.com/seajs/seajs/issues/672)
>### ES6模块处理