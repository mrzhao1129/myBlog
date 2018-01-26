### 常见的排序算法
> 附：以下测试数据基于[Array](../static/js/sort_exp_arr.js)[35934]、node
* 冒泡排序

![](../static/img/Bubble_sort_animation.gif)
```javascript
function bubbleSort(arr) {
  arr = [].concat(arr);
  for(var i = 0; i < arr.length; i++) {//0-
    for(var j = 0; j < arr.length - i - 1; j++) {
      if(arr[j] > arr[j + 1]) {
        var test = arr[j];
        arr[j] = arr[j + 1];
        arr[j + 1] = test;
      }
    }
  }
  return arr;
}
//bubbleSort: 4159.974ms
```
> #### 时间复杂度计算思路(比较与交换次数)
> i 运算次数为n  </br>
> j 运算次数：最多为n-1，最少为1，总共为n^2/2  </br>
> j 循环中比较次数为n^2/2  </br>
> J 循环中交换的次数最少为0，最多为3*n^2/2

> **稳定性** 相同大小数据不会交换位置

|时间复杂度|空间复杂度|稳定|
|---|---|---|
|O(n^2)|O(1)|是|
* 选择排序

![](../static/img/Selection_sort_animation.gif)
```javascript
function selectionSort(arr) {
  arr = [].concat(arr);
  for(var i = 0; i < arr.length; i++) {
    var min = i;
    for(var j = i + 1; j < arr.length; j++) {
      if(arr[j] < arr[min]) {
        min = j;
      }
    }
    var test = arr[i];
    arr[i] = arr[min];
    arr[min] = test;
  }
  return arr;
}
//selectionSort: 1422.006ms
```
> #### 时间复杂度计算思路
> i 运算次数n  </br>
> j 运算次数n^2/2  </br>
> 比较次数n*2/2次 </br>
> 交换的次数为0~3n次之间

|时间复杂度|空间复杂度|稳定|
|---|---|---|
|O(n^2)|O(1)|否|
* 插入排序

![](../static/img/Insertion_sort_animation.gif)
```javascript
function insertionSort(arr) {
  arr = [].concat(arr);
  for(var i = 1; i < arr.length; i++) {
    var test = arr[i];
    for(var j = i - 1; j >= 0; j--) {
      if(arr[j] > test) {//前大于后
        arr[j + 1] = arr[j];
        j === 0 ? arr[0] = test : '';
      } else {
        arr[j + 1] = test;
        break;
      }
    }
  }
  return arr;
}
//insertionSort: 978.745ms
```
> #### 时间复杂度计算思路
> i 运算次数n-1  </br>
> j 运算次数n-1~n^2/2之间  </br>
> 比较次数n-1~n*2/2次  </br>

|时间复杂度|空间复杂度|稳定|
|---|---|---|
|O(n^2)|O(1)|是|
* 快速排序

![](../static/img/Sorting_quicksort_anim.gif)
```javascript
function quickSort(arr) {
  //代码开始
  arr = [].concat(arr);
  Array.prototype.quickSort = function() {
    if(this.length <= 1) {
      return this;
    }
    var middle = [this[0]];
    var left = [];
    var right = [];
    for(var i = 1; i < this.length; i++) {
      this[i] < middle[0] ? left.push(this[i]) : right.push(this[i]);
    }
    left = left.quickSort();
    right = right.quickSort();
    // console.log(left.concat(middle, right));
    return left.concat(middle, right);
  }
  var afterSort = arr.quickSort();
  return afterSort;
  //代码结束
}
//quickSort: 175.581ms
```
> #### 时间复杂度计算思路

|时间复杂度|最差情况时间复杂度|空间复杂度|稳定|
|---|---|---|---|
|O(nlogn)|O(n^2)|O(1)|否|
> Gif图及算法思路源于[维基百科](https://zh.wikipedia.org/wiki/%E6%8E%92%E5%BA%8F%E7%AE%97%E6%B3%95)