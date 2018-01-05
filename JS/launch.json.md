## VSCode Debug 之 launch.json
> VSCode: 1.16.1  
> node: 8.9.1

贴一些用VSCode可以自动生成的配置列表。注意：json文件不能包含注释内容，切记用的时候删除。
```javascript
{
  "version": "0.2.0",
  "configurations": [
    //默认可以生成的Node调试配置
    {
      "type": "node",
      "request": "launch",
      "name": "Launch Program",
      "program": "${workspaceRoot}\\bin\\www"
    },
    //在全局安装nodemon的基础上的调试模式，坑大多来自于这里
    {
      "type": "node",
      "request": "launch",
      "name": "nodemon",
      "runtimeExecutable": "nodemon",
      "program": "${workspaceRoot}\\bin\\www",
      "restart": true,
      "console": "integratedTerminal",
      "internalConsoleOptions": "neverOpen",
      "env": {
        "NODE_ENV": "dev"
      }
    },
    //launch模式的调试
    {
      "type": "chrome",
      "request": "launch",
      "name": "Launch Chrome",
      "url": "http://localhost:8080",
      "webRoot": "${workspaceRoot}"
    }, 
    //attach模式调试
    {
      "type": "chrome",
      "request": "attach",
      "name": "Attach to Chrome",
      "port": 9222,
      "webRoot": "${workspaceRoot}"
    },
  ]
}
```
### Configuration attributes
* "console"[string]
  * "internalConsole"：VSCode 的调试控制台
  * "integratedTerminal"：VSCode 的终端
  * "externalTerminal"：windows下会弹出cmd小黑框
* "env"[object]  
  运行时的全局变量，在程序中例如用`process.env.NODE_ENV`获取  
  exp:`"env": { NODE_ENV": "dev" }`
* "port"[number]  
  在runtimeExecutable为npm,nodemon情况下，不设置端口，会默认生成一些runtimeArgs的参数，导致再添加一些自定义的runtimeArgs时候会填充到默认生成的那些后面，比如:  
  `node --inspect --debug-brk --inspect-brk ./bin/www`  
  --inspect-brk就是我们在runtimeArgs的自定义的。
* "program"[string]  
  default: "${workspaceRoot}\\bin\\www"  
  需要启动（debug）的源代码，整个项目的入口。
* "request"[string]
  * "launch"：由 vscode 来启动一个独立的具有 debug 模式的程序。
  * "attach"：附加于（也可以说“监听”）一个已经启动的程序。
* "restart"[boolean]  
  和nodemon搭配使用疗效最佳
  * true or false  
* "runtimeArgs"[array]  
  跟随在runtimeExecutable后边的参数  
  exp:`"runtimeArgs": [ "--inspect" ]`
* "runtimeExecutable"[string]
  default: "node"  
  启动方式，方式分为npm,node,nodemon
### nodemon
---
For use during development of a node.js based application.

nodemon will watch the files in the directory in which nodemon was started, and if any files change, nodemon will automatically restart your node application.

nodemon does not require any changes to your code or method of development. nodemon simply wraps your node application and keeps an eye on any files that have changed. Remember that nodemon is a replacement wrapper for node, think of it as replacing the word "node" on the command line when you run your script.

在基于node.js的应用开发中使用。

nodemo开启后将监控路径中的文件，如果文件发生变化，nodemo将会自动重新启动您的node应用。

您的项目中的代码和方法不需要对nodemon进行任何适配。nodemon会简单的包装您的项目并且监控任何文件的改变，请记住nodemon是对node加了一层包装，把她当成"node"命令行运行脚本的替换者。

下面的配置没有实际操作过，贴官网的范例。主要实践还是在VSCode的launch.json配置文件中，且也满足需求。

#### Sample nodemon.json
```json
{
  "restartable": "rs",
  "ignore": [
    ".git",
    "node_modules/**/node_modules"
  ],
  "verbose": true,
  "execMap": {
    "js": "node --harmony"
  },
  "events": {
    "restart": "osascript -e 'display notification \"App restarted due to:\n'$FILENAME'\" with title \"nodemon\"'"
  },
  "watch": [
    "test/fixtures/",
    "test/samples/"
  ],
  "env": {
    "NODE_ENV": "development"
  },
  "ext": "js json"
}
```
[参考内容：Visual Studio Code 前端调试不完全指南](http://jerryzou.com/posts/vscode-debug-guide/)  
[参考内容：VSCode Launch configuration attributes](https://code.visualstudio.com/docs/nodejs/nodejs-debugging#_launch-configuration-attributes)