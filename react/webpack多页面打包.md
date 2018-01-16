# webpack多页面打包
## webpack.prod.js
```javascript
var path = require('path'),
  fs = require('fs');

var webpack = require('webpack');
var HtmlwebpackPlugin = require('html-webpack-plugin');//用于生成单/多页面所用到的html文件
var BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;//用于展示打包后文件内部模块结构
var ExtractTextPlugin = require("extract-text-webpack-plugin");//用于提取css文件

var ROOT_PATH = path.resolve(__dirname);
var BUILD_PATH = path.resolve('F:/nginx-1.12.0/html/shanghai-project2');
// var BUILD_PATH = path.resolve(ROOT_PATH, 'build');
var APP_PATH = path.resolve(ROOT_PATH, 'src');
var STATIC_PATH = path.resolve(ROOT_PATH, 'static');



module.exports = {
  entry: {
    app: [
      'babel-polyfill',
      path.resolve(APP_PATH, 'views', 'app.js'),
    ],
    home: [
      'babel-polyfill',
      path.resolve(APP_PATH, 'views', 'home.js'),
    ]
  },
  output: {
    path: BUILD_PATH,
    publicPath: '/assets/',
    filename: '[name].[chunkhash:8].js',
    chunkFilename: '[id].[name].[chunkhash:8].bundle.js'
  },
  devtool: 'source-map',
  resolve: {
    extensions: ['.js', '.json', '.jsx'],
  },
  module: {
    rules: [
      { test: /\.jsx?$/, use: ['babel-loader'], include: APP_PATH },
      // { test: /\.less$/, use: ['style-loader', 'css-loader', 'less-loader'] },
      {
        test: /\.less$/,
        use: ExtractTextPlugin.extract({
          fallback: "style-loader",
          use: ['css-loader?localIdentName=[name]_[local]_[hash:base64:5]', 'postcss-loader', 'less-loader']
        })
      },
      // { test: /\.css$/, use: ['style-loader', 'css-loader'] },
      {
        test: /\.css$/,
        use: ExtractTextPlugin.extract({
          fallback: "style-loader",
          use: ['css-loader?localIdentName=[name]_[local]_[hash:base64:5]', 'postcss-loader']
        })
      },
      { test: /\.(png|svg|jpg|gif)$/, use: ['file-loader'] },
      { test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/, use: ['file-loader'] },
    ]
  },
  plugins: [
    //增加新模块导致其他模块位置发生改变，导致vender.js的名称发生改变，从而缓存失效
    new webpack.HashedModuleIdsPlugin(),
    new webpack.optimize.CommonsChunkPlugin({
      name: 'vendor',
      // filename: 'vendor.js',//单/多页面都没用用到
      // 单页面，用于提取所有存在于node_modules中的模块，多次打包名称不变可用于缓存优化
      // minChunks: function (module) {
      //     return module.context && module.context.indexOf('node_modules') !== -1;
      // }
      chunks: ['app', 'home'],//提取哪些模块共有的部分
      minChunks: 2//提取至少3个模块共有的部分
    }),
    //提取每次运行时都会自动在vendor包中添加的引导部分内容，用于缓存优化
    new webpack.optimize.CommonsChunkPlugin({ name: 'runtime' }),
    //增加全局变量process.env.NODE_ENV
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify(process.env.NODE_ENV || 'production')
      }
    }),
    // new webpack.optimize.CommonsChunkPlugin({
    //     name: "manifest",
    //     filename: "webpackManifest.js",
    // }),
    new webpack.optimize.UglifyJsPlugin({
      beautify: false,
      comments: false,
      compress: {
        warnings: false,
        drop_debugger: true,
        // drop_console: true
      }
    }),
    new BundleAnalyzerPlugin(),
    new HtmlwebpackPlugin({ 
      template: './src/index.html', 
      filename: 'index.html',
      chunks: [ 'runtime', 'vendor', 'app' ]
    }),
    new HtmlwebpackPlugin({ 
      template: './src/index.html',
      filename: 'home.html',
      chunks: [ 'runtime', 'vendor', 'home' ]
    }),
    new ExtractTextPlugin({
      filename: '[name].[contenthash:6].css',
      allChunks: true
    }),
    // new InlineManifestWebpackPlugin,
  ]
}
//处理static文件下的拷贝
var BUILD_STATIC_PATH = path.resolve(BUILD_PATH, 'static');
fs.readdir(STATIC_PATH, (err, files) => {
  if (err) throw err;
  fs.existsSync(BUILD_STATIC_PATH) 
    ? ''
    : fs.mkdirSync(BUILD_STATIC_PATH);
  for(var file of files) {
    fs.copyFileSync(path.resolve(STATIC_PATH, file), path.resolve(BUILD_STATIC_PATH, file))
  }
});
```