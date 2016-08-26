#也来谈谈wap端瀑布流布局
##Definition
    瀑布流布局，在视觉上表现为参差不齐的多栏布局，随着页面滚动条向下滚动，新数据不断被加载进来。
    
    瀑布流对于图片的展现，是高效而具有吸引力的，用户一眼扫过的快速阅读模式可以在短时间内获得更多的信息量,而瀑布流里懒加载模式又避免了用户鼠标点击的翻页操作。
    
    瀑布流的主要特性便是错落有致，于乱中见序，定宽而不定高的设计让页面区别于传统的矩阵式图片布局模式，巧妙的利用视觉层级，视线的任意流动又缓解了视觉疲劳，同时给人以不拘一格的感觉，切中年轻一族的个性化心理。
   
 *ps*：以上来自百度百科，说的挺有道理的。
 
 最早采用此布局的网站是[Pinterest](https://www.pinterest.com/)，逐渐在国内流行开来。
 
 目前主流的布局方式是以下三种：
 
 1. 传统的多列浮动：如wap端天猫的搜索结果页就是左右两列浮动布局
 2. 通过绝对定位的方式：如Pinterest。
 3. 使用css3实现。
 
本文重点讨论的是第三种。
##Origin
我组负责的搜索结果页布局是传统的格子布局，通过 `ul>li.float[width:50%]*2` 简单代码就可以满足效果了。

不过，**PM**在横向比较其他厂的设计后，坚决要求我们上瀑布流。

老早就有这个需求了，在我入职前老早就有了。因为开发进度等各种原因拖了下来，这次过完了**818**，又提了出来。前端不是什么麻烦事，在和后端同学沟通后，这事就定了下来。

限于移动端的硬件性能，绝对定位实现瀑布流的方式首先就否了。<br/>

另外左右两列的布局，不利于数据的渲染。<br/>
一般搜索结果页有列表和大图两种模式切换。<br/>
切换的样式布局可以通过`css`来控制（*ps*：具体的代码就不贴了，可以参考现有的[搜索结果页](http://m.suning.com/search/%E5%B0%8F%E7%B1%B3/)），<br/>
后台的模板渲染也只是一套，前端异步加载新数据依然是一种数据就可以了。<br/>

如果是左右两列的布局，就麻烦多了
 - 首先列表布局和大图布局各有一种样式
 - 后台的渲染模板也要有两套，列表的`data-module`不变，大图模式需要将`dm`按**奇偶数**分开，然后各自再组成`data-list`去填充模板
 - 前端加载下一页获取的数据可以保持`dm`不变，不过需要通过`js`拆为两个奇偶`list`。<br/>这样就背离了*前后端分离的初衷*，而且也加重了`browser`的负担。<br/>因此，依然需要后台去实现数据分拆，接口变更。
 - 这也就是瀑布流布局一直拖着没做的原因。

所以如果前端能实现，不需要多少的工作量，不增加其他童鞋的工作量，自然是皆大欢喜。

##Fill the hole

### 1. 使用`flex`弹性布局实现
*ps：还不知道`flex`? [传送门在这](http://www.ruanyifeng.com/blog/2015/07/flex-grammar.html?utm_source=tuicool)*
使用`flex-direction：column`纵向排列的属性 `+` `flex-wrap:wrap`超过高度换行的属性来实现。 

线上的可以参考[这个网址](http://www.htmleaf.com/ziliaoku/qianduanjiaocheng/20141206695.html)<br/>
DEMO的[代码在这](https://github.com/phillyx/MUIDemos/blob/master/examples/PHILLYXDEMOS/flex/flex-04.html)<br/>
截图如下：

![](http://images.cnblogs.com/cnblogs_com/phillyx/779277/o_flex-01.png)

- 看数字，很明显是纵向排列，根本就是伪瀑布流布局。
- 很坑的是，高度要定死，要不`DOM`是不会换行的。
- 另外加载新数据，高度需要重新计算，且整体的排列顺序变掉了。依然是先占满左列的空间，再折行。

如下图，高度不变，增加`DOM`，变成四列了。<br/>
![](http://images.cnblogs.com/cnblogs_com/phillyx/779277/o_flex-02.png)
<br/>
高度改变，变成这样了<br/>
![](http://images.cnblogs.com/cnblogs_com/phillyx/779277/o_flex-03.png)
<br/>
*so*，这种实现方式对**单页**且对排序不敏感的需求适用或者对横向布局适用。

###2. 通过`collumn`属性来实现
`css3`中增加了一个新的属性：`column` 来实现等高的列的布局效果。该属性有`column-width`宽度，`column-count`数量等，并且能根据窗口自适应。<br/>
[DEMO代码传送门](https://github.com/phillyx/MUIDemos/blob/master/examples/PHILLYXDEMOS/flex/collumns.html)<br/>
该属性的效果几乎与上面的截图等同，新增数据的效果也一样<br/>
因此，该属性并不适合瀑布流的格子布局。<br/>
实际上，`collumn`比较适合文字内容的布局，`w3cScholl`提供的就是文本布局的栗子*[传送门](http://www.w3school.com.cn/cssref/pr_column-width.asp)*。<br/>

**我们来看看普通瀑布流布局与css3实现的效果对比图**<br/>
![](http://images.cnblogs.com/cnblogs_com/phillyx/779277/o_water-fall.png)<br/>


>**无论是`flex.collumn`还是`collumn`都是以纵向展开、向右推进的形式来布局的，并不是横向平铺布局、向下推进的方式。其他的实现方式尚未找到，到这里就走到了死胡同了，所以还得使用最上面所说的左右两列布局来实现**

####3. 依然使用`flex`
布局的传统解决方案，基于盒状模型，依赖 display属性 + position属性 + float属性。<br/>
而现代特性的Flex布局，可以简便、完整、响应式地实现各种页面布局，那么就用`flex`取代`float`来实现左右两列的布局。<br/>
具体的实现逻辑只能按照最上的分析了。
[DEMO传送门](https://github.com/phillyx/MUIDemos/blob/master/examples/PHILLYXDEMOS/flex/flex-05.html)<br/>

![](http://images.cnblogs.com/cnblogs_com/phillyx/779277/o_flex-04.png)



*end*