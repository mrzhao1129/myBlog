## node之TCP连接
* `net.connect(options[, connectListener])` 是 net.createConnection() 的别名(返回 socket)
  * `net.createConnection(options[, connectListener])` 创建Socket的工厂函数  
### 对于 TCP 连接可能的 options 有：
* port <number> 必须。Socket 连接的端口
* host <string> Socket 连接的主机。默认是 'localhost'
* localAddress <string> Socket 连接的本地地址
* localPort <number> Socket 连接的本地端口(不填的话node会自己生成)
* family <number> IP栈的版本，可以是4或6。默认值为4
* hints <number> 可选的[dns.lookup() hints](http://nodejs.cn/api/dns.html#dns_supported_getaddrinfo_flags)
* lookup <Function> 自定义的 lookup 方法。默认是 [dns.lookup()](http://nodejs.cn/api/dns.html#dns_dns_lookup_hostname_options_callback)
* path <string> 必须。客户端连接的路径。查看 Identifying paths for IPC connections。如果提供了，则以上的 TCP 选项都会被忽略。

代码片段基于express 
```javascript
router.get('/', function(req, res, next) {
  
  var client = net.connect({ port: 60000 }, function() {
    console.log('连接到后台')
  });

  client.setTimeout(3000);

  client.on('timeout', () => {
    res.send('time out');
    client.end();
  });

  client.on('data', (data) => {
    console.log(data.toString());
    res.send(data.toString());
    client.end();
  });

  client.on('end', () => { 
    console.log('断开与服务器的连接');
  });
});
```