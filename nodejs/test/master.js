//exec() 方法
const fs = require('fs');
const child_process = require('child_process');

for (var i = 0; i < 3; i++) {
  var workerProcess = child_process.exec('node ./nodejs/test/support.js ' + i,
    function (error, stdout, stderr) {
      if (error) {
        console.log(error.stack);
        console.log('Error code: ' + error.code);
        console.log('Signal received: ' + error.signal);
      }
      console.log('stdout: ' + stdout);
      console.log('stderr: ' + stderr);
    });

  workerProcess.on('exit', function (code) {
    console.log('子进程已退出，退出码 ' + code);
  });
}
//spawn() 方法
const fs = require('fs');
const child_process = require('child_process');

for (var i = 0; i < 3; i++) {
  var workerProcess = child_process.spawn('node', ['./nodejs/test/support.js', i]);

  workerProcess.stdout.on('data', function (data) {
    console.log('stdout: ' + data);
  });

  workerProcess.stderr.on('data', function (data) {
    console.log('stderr: ' + data);
  });

  workerProcess.on('close', function (code) {
    console.log('子进程已退出，退出码 ' + code);
  }); z
}
//fork 方法
const fs = require('fs');
const child_process = require('child_process');

for (var i = 0; i < 3; i++) {
  var worker_process = child_process.fork(__dirname + "/support.js", [i]);
  worker_process.on('message', function (message) {
    console.log('master:', message);
  });
  worker_process.send('hehe' + i);
  worker_process.on('close', function (code) {
    console.log('子进程已退出，退出码 ' + code);
  });
  // worker_process.kill();
}