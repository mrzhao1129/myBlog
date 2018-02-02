# three.js笔记
## 序
* 代码测试环境：http://wow.techbrood.com/fiddle/new
* [学习过程实现效果Demo](./source/three/threeTest.html)

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
## 辅助工具
* 鼠标辅助工具，可根据鼠标移动转换相机位置（OrbitControls.js）
* 网格辅助工具（`new THREE.GridHelper( 40, 80, 'white' )`）
## 材质
* 使用基本材质（BasicMaterial）的物体，渲染后物体的颜色始终为该材质的颜色，而不会由于光照产生明暗、阴影效果。如果没有指定材质的颜色，则颜色是随机的。
* Lambert材质（MeshLambertMaterial）是符合Lambert光照模型的材质。Lambert光照模型的主要特点是只考虑漫反射而不考虑镜面反射的效果，因而对于金属、镜子等需要镜面反射效果的物体就不适应，对于其他大部分物体的漫反射效果都是适用的。
  >* color：是用来表现材质对散射光的反射能力
  >* ~~ambient~~
  >* emissive：材质的自发光颜色  
  
  只有color的话光照的地方为color颜色，其他黑；color和exissive都有的话光照地方为混合色，其他为emissive颜色
* Phong材质（MeshPhongMaterial）Phong模型考虑了镜面反射的效果
  >* color：散射光
  >* specular：镜面反射系数（颜色）；镜面光；
  >* shininess：值越大时，高光的光斑越小
* 法向材质（MeshNormalMaterial）
* 【没看】材质的纹理贴图
## 光与影
* 环境光 `new THREE.AmbientLight(hex)` 在各处形成的亮度一致
* 点光源 `new THREE.PointLight(0xffffff, 2, 100)` 
  > 颜色、光强（1=100%）、可照射最远距离（default=0）
* 平行光`new THREE.DirectionalLight()`
* 聚光灯`new THREE.SpotLight(hex, intensity, distance, angle, exponent)`
  > 相比点光源，多了angle和exponent两个参数。  
  > angle是聚光灯的张角，缺省值是Math.PI / 3，最大值是Math.PI / 2；  
  > exponent是光强在偏离target的衰减指数（target需要在之后定义，缺省值为(0, 0, 0)），缺省值是10。
  > light.target：light.postion是灯的位置，light.target是灯的朝向（默认`(0, 0, 0)`）;可以直接指向一个模型（Mesh）
* 阴影【没有坑出来】
## 着色器
* 顶点着色器
* 片元着色器

[[the first example]](http://wow.techbrood.com/fiddle/38296)  
[[参考文档]：Three.js 中文教程](http://techbrood.com/threejs/docs/)  
[[参考文档]：Three.js 官方文档](https://threejs.org/docs/index.html)  
[[参考文档]：Three.js入门指南(图灵社区图书)](http://www.ituring.com.cn/book/miniarticle/50476)