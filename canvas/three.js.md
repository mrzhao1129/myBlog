### three.js笔记
三个组件
* 场景scene
> 场景只存在一种
```javascript
var scene = new THREE.Scene();
```
* 相机camera
> 相机有很多种，不用类型相机适合不同的场景。
> exp:透视相机（THREE.PerspectiveCamera）
```javascript
var camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);
```
* 渲染器renderer
```javascript
var renderer = new THREE.WebGLRenderer();
		
renderer.setSize(window.innerWidth, window.innerHeight);

document.body.appendChild(renderer.domElement);
```