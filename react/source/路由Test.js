class Router {
  constructor() {
    //不同路由的回调函数
    this.routes = {};
    this.currentUrl = '';
  }
  route(path, callback) {
    console.log('route: ', path);

    this.routes[path] = callback || function() {};
  }
  updateView() {
    console.log('updateView');

    this.currentUrl = location.hash.slice(1) || '/';
    
    console.log('updateView: ', location);

    this.routes[this.currentUrl] && this.routes[this.currentUrl]();
  }
  init() {
    console.log('init');
    // 资源已经加载完触发
    window.addEventListener('load', this.updateView.bind(this), false);
    window.addEventListener('hashchange', this.updateView.bind(this), false);
  }
}