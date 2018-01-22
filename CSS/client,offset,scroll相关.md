# clientHeight,offsetHeigth,scrollHeight相关
图片来源于MDN，（Width与Height类似就不多赘述了） 
## clientHeight
> * 只读
> * 包含内边距，但不包括水平滚动条、边框和外边距
> * 返回整数

![](./image/clientheight.png)
## offsetHeight
> * 只读  
> * 高度=元素高度+垂直内边距（上下）+边框（上下）  
> * 返回整数（想要浮点数Element.getBoundingClientRect()经测试没发现有浮点数:expressionless:）

![](./image/offsetheight.png)
### [Element.getBoundingClientRect()](https://developer.mozilla.org/zh-CN/docs/Web/API/Element/getBoundingClientRect)
> DOMRect 对象包含了一组用于描述边框的只读属性——left、top、right和bottom，单位为像素。除了 width 和 height 外的属性都是相对于视口的左上角位置而言的。  
> top,right,bottom,left,height,width,

![](./image/getBoundingClientRect.png)  
![](./image/getBoundingClientRectObj.jpg)  

  
## scrollHeight
> * scrollHeight与元素视图填充所有内容所需要的最小值clientHeight相同
> * 包括元素的padding，但不包括元素的border和margin
> * 包括 ::before 和 ::after这样的伪元素
> * 返回整数（想要浮点数Element.getBoundingClientRect()）

![](./image/scrollheight.png)

[[codepen]:offset 测试](https://codepen.io/mrzhao1129/pen/wPjERo)

[参考文章:MDN Element.clientHeight](https://developer.mozilla.org/zh-CN/docs/Web/API/Element/clientHeight)

[参考文章:MDN Element.offsetHeight](https://developer.mozilla.org/zh-CN/docs/Web/API/Element/offsetHeight)

[参考文章:MDN Element.scrollHeight](https://developer.mozilla.org/zh-CN/docs/Web/API/Element/scrollHeight)
