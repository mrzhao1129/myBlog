# for...of与for...in
for...in返回字符串的index为字符串类型key，遍历对象中所有可枚举属性、方法。  
for...of返回字符串的index为value，
```javascript
var myArray=[1,2,4,5,6,7]
myArray.name="数组"
for (var index in myArray) {
  console.log(index + 1, myArray[index]);
}
//打印数据
// 01 1
// 11 2
// 21 4
// 31 5
// 41 6
// 51 7
// name1 数组
```
```javascript
var myArray=[1,2,4,5,6,7]
myArray.name="数组";
for (var value of myArray) {
  console.log(value + 1);
}
//打印数据
// 2
// 3
// 4
// 5
// 6
// 7
// 8
```