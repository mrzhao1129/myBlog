# three.js笔记
## 序
* 测试环境：http://wow.techbrood.com/fiddle/new

## 三个组件
### 场景scene（整个布景）
> 场景只存在一种
```javascript
var scene = new THREE.Scene();
```
### 相机camera
相机有很多种，不用类型相机适合不同的场景。  
exp:透视相机（THREE.PerspectiveCamera( fov, aspect, near, far )）
> fov — 相机视锥体垂直视角  
aspect — 相机视锥体宽高比  
near — 相机视锥体近裁剪面  
far — 相机视锥体远裁剪面

![](./image/three-PerspectiveCamera.jpg)
```javascript
//75度视角，拍摄面长宽比，近裁剪面，远裁剪面
var camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);
```
### 渲染器renderer
```javascript
var renderer = new THREE.WebGLRenderer();
		
renderer.setSize(window.innerWidth, window.innerHeight);

document.body.appendChild(renderer.domElement);
```
## 核心模块


[[the first example]](http://wow.techbrood.com/fiddle/38296)  
[[参考文档]：Three.js 中文教程](http://techbrood.com/threejs/docs/)