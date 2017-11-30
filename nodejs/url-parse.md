### url-parse API

```javascript
const URL = require('url-parse')
console.log(new URL('https://a.baidu.com/a'));
```
```javascript
{   
  slashes: true,//斜线
  protocol: 'https:',
  hash: '',
  query: '',
  pathname: '/a',
  auth: '',
  host: 'a.baidu.com',
  port: '',
  hostname: 'a.baidu.com',
  password: '',
  username: '',
  origin: 'https://a.baidu.com',
  href: 'https://a.baidu.com/a' 
}
```