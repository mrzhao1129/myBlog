# clientHeight,offsetHeigth,scrollHeight相关
从MDN上拷贝几张图  
## clientHeight
![](./image/clientheight.png)
## offsetHeight
> * 只读  
> * 高度=元素高度+垂直内边距（上下）+边框（上下）  
> * 返回整数（想要浮点数Element.getBoundingClientRect()经测试没发现有浮点数）

![](./image/offsetheight.png)
### [Element.getBoundingClientRect()](https://developer.mozilla.org/zh-CN/docs/Web/API/Element/getBoundingClientRect)
> DOMRect 对象包含了一组用于描述边框的只读属性——left、top、right和bottom，单位为像素。除了 width 和 height 外的属性都是相对于视口的左上角位置而言的。  
> top,right,bottom,left,height,width,

![](./image/getBoundingClientRect.png)  
![](./image/getBoundingClientRectObj.jpg)  

  
## scrollHeight
> * scrollHeight与元素视图填充所有内容所需要的最小值clientHeight相同。  
> * 包括元素的padding，但不包括元素的border和margin。

![](./image/scrollheight.png)
