### url-parse API
> 基于Nodejs的URL路径拆分工具，可拆分路径中的域名、参数、协议等等。
```javascript
const URL = require('url-parse')
console.log(new URL('https://a.baidu.com/a/b?q1=1&q2=3'));
```
```javascript
{   
  slashes: true,//斜线
  protocol: 'https:',
  hash: '',
  query: '?q1=1&q2=3',
  pathname: '/a/b',
  auth: '',
  host: 'a.baidu.com',
  port: '',
  hostname: 'a.baidu.com',
  password: '',
  username: '',
  origin: 'https://a.baidu.com',
  href: 'https://a.baidu.com/a/b?q1=1&q2=3'
}
```