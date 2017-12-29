## VSCode Debug 之 launch.json
---
贴一些用VSCode可以自动生成的配置列表
```json
{
  "version": "0.2.0",
  "configurations": [
    //默认可以生成的Node调试配置
    {
      "type": "node",
      "request": "launch",
      "name": "Launch Program",
      //启动文件
      "program": "${workspaceRoot}\\bin\\www"
    },
    //在全局安装nodemon的基础上的调试模式
    {
      "type": "node",
      "request": "launch",
      "name": "nodemon",
      "runtimeExecutable": "nodemon",
      "program": "${workspaceRoot}\\bin\\www",
      "restart": true,
      "console": "integratedTerminal",
      "internalConsoleOptions": "neverOpen"
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
> "request"
> * "launch"：由 vscode 来启动一个独立的具有 debug 模式的程序
> * "attach"：附加于（也可以说“监听”）一个已经启动的程序（必须已经开启 Debug 模式）
### nodemon
---
For use during development of a node.js based application.

nodemon will watch the files in the directory in which nodemon was started, and if any files change, nodemon will automatically restart your node application.

nodemon does not require any changes to your code or method of development. nodemon simply wraps your node application and keeps an eye on any files that have changed. Remember that nodemon is a replacement wrapper for node, think of it as replacing the word "node" on the command line when you run your script.

在基于node.js的应用开发中使用。

nodemo开启后将监控路径中的文件，如果文件发生变化，nodemo将会自动重新启动您的node应用。

您的项目中的代码和方法不需要对nodemon进行任何适配。nodemon会简单的包装您的项目并且监控任何文件的改变，请记住nodemon是对node加了一层包装，把她当成"node"命令行运行脚本的替换者。

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