## 变相的服务端渲
> 大意就是说，一个提供操作Headless Chrome的API的node库。
> 再具体的说，就是能在node环境中，通过一些API，来“模拟”真实chrome访问页面，并对其进行模拟用户操作、获取DOM等。

### 需要解决的问题
1. 什么时候把审生成的HTML返回
2. 多加一层转换回增加服务器负担，解决办法使用缓存技术
3. IE用户没有办法做JS交互
4. 使用Hash路由模式存在服务端无法获取url的问题（换成History）

### 解决方案
见项目shanghai-project2-s

> ### nginx判定百度爬虫方法
> ```
> location / {
>  	if ($http_user_agent ~ "Baiduspider-render") {
>  		return 403;
>  	}
>		proxy_pass http://192.168.3.220:8090/;
>	}
> ```


