### nodejs文件夹拷贝
node指定文件夹拷贝（文件夹下只有一层目录），需要多层目录递归则需要再小改一下。用于webpak打包过程中静态文件自动化拷贝。

涉及到的node方法
> #### fs.readdir(path[, options], callback)【读取路径下的文件列表】
> * path <string> | <Buffer> | <URL> 【读取指定的路径】
> * options <string> | <Object>
>   * encoding <string> 默认 = 'utf8'
> * callback <Function>
>   * err <Error> </br>
>   * files <string[]> | <Buffer[]> 【指定路径下所有文件、文件夹名称的数组】

> #### fs.existsSync(path)【路径存在否判定】
> * path <string> | <Buffer> | <URL>
> 【是否存在指定目录】，fs.exists()的同步版本。

> #### fs.copyFileSync(src, dest[, flags])【拷贝文件】
> 新增于: v8.5.0
> * src <string> | <Buffer> | <URL> 【要被拷贝的源文件名称】
> * dest <string> | <Buffer> | <URL> 【拷贝操作的目标文件名】
> * flags <number> 【拷贝操作修饰符 默认: 0】
>
> 同步的将 src 拷贝到 dest。默认情况下，如果 dest 已经存在会被覆盖。返回值是 undefined。Node.js 不能保证拷贝操作的原子性。如果目标文件打开后出现错误，Node.js 将尝试删除它。

> #### fs.mkdirSync(path[, mode])
> * path <string> | <Buffer> | <URL>
> * mode <integer> Default: 0o777
>
> 同步的 mkdir(2)。【返回 undefined】。当目录存在时会报错。

上述方法都存在Sync、和非Sync方法，异步方法可以有效防阻塞（猜）。
  
  
  
  
 
```
var path = require('path'),
      fs = require('fs');
//路径相关，无视
var ROOT_PATH = path.resolve(__dirname);
var BUILD_PATH = path.resolve('F:/nginx-1.12.0/html/project');
var APP_PATH = path.resolve(ROOT_PATH, 'src');
var STATIC_PATH = path.resolve(ROOT_PATH, 'static');
//主要代码
//读取原目录
fs.readdir(STATIC_PATH, (err, files) => {
  if (err) throw err;
  //判断目标目录存在时不操作，不存在则生成文件夹
  fs.existsSync(BUILD_STATIC_PATH) 
    ? ''
    : fs.mkdirSync(BUILD_STATIC_PATH);
  for(var file of files) {
    //拷贝文件到目标目录
    fs.copyFileSync(path.resolve(STATIC_PATH, file), path.resolve(BUILD_STATIC_PATH, file))
  }
});
```
 
    