

// process.on('message', function (message) {
//   console.log('support:', message);
//   process.send(message);

// });

// process.on('SIGHUP', function() {
//   process.exit();//收到kill信息，进程退出
// });

console.log("进程 " + process.argv[2] + " 执行。");