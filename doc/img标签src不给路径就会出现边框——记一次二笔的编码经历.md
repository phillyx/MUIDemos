##img标签src不给路径就会出现边框————记一次二笔的编码经历
`<img/>`在`src`加载失败或没有给的，浏览器会自动给`img`加上边框。
如下图这样：

![](http://images.cnblogs.com/cnblogs_com/phillyx/779277/o_image-src-none-border.png)

产品觉得影响美观，一定要pass掉。

原码是这样：
```css
.ctn{
	position: relative;
	width: 2.8rem; 
	height: 2.8rem;
	border-radius: 3px;
	overflow: hidden;
	background: #FFF;
}
.ctn .title{
	position: absolute;
	top: 0;
	width: 2.8rem; 
	height: 2.8rem;
	background:rgba(0,0,0,.35) ;
	color: #FFF;
	font-size: .52rem;
	font-weight: bold;
	padding:0 .4rem;
}
.ctn img{
	width: 2.6rem;
	height: 2.2rem;
	margin: .3rem auto;
	object-fit: cover;
	background: url(images/120X120.jpg?201608012) no-repeat center;
	background-size: 2.2rem;
}
```
```html
<div class="ctn">
    <div class="title sn-flex center">
	    <p>休闲西装</p>
    </div>
	<img src=""/>
</div>
```

百度一下，在知乎上找到了解决方案，链接在这[https://www.zhihu.com/question/27426689](https://www.zhihu.com/question/27426689)

基于能用`css`实现就不用`js`的原则，选择了以下的解决方案：
给`img`包个`div`
```html
<div class="ctn">
    <div class="title sn-flex center"><p>收腰款</p></div>
    <div class="img-ctn">
         <img  src="temp/app_200x200.jpg"/>
    </div>
</div>
```
```css
.ctn .img-ctn{
	width: 2.6rem;
	height: 2.2rem;
	margin: .3rem auto;
	overflow: hidden;
}
.ctn .img-ctn img{
	width: -webkit-calc(2.6rem + 2px);
	height: -webkit-calc(2.2rem + 2px);	
	width: calc(2.6rem + 2px);
	height: calc(2.2rem + 2px);
	background: url(images/120X120.jpg?201608012) no-repeat center;
	background-size: 1.8rem;
	margin: -1px;
	object-fit: cover;	
}
```
but，有问题，无图片时上下的`border`是隐藏了，左右无论怎么样都隐藏不了，暂时没查出来问题，于是改成了这样：
```css
.ctn .img-ctn{
	width: 2.6rem;
	height: 2.2rem;
	margin: .3rem auto;
	overflow: hidden;
	background: url(images/120X120.jpg?201608012) no-repeat center;
	background-size: 1.8rem;
}
.ctn .img-ctn img{
	width: inherit;
	height: inherit;
	object-fit: cover;
}
/*无src隐藏*/
.ctn .img-ctn img[src='']{
	visibility: hidden;
}
```
后来，在控制台调试时，忽然灵光乍现，**FUCK**，是`reset`样式的问题。

原来，[base.css](http://res.m.suning.com/common/style/base/2.0/base.css?v=10)
对`img`做了这个
```css
img {
    max-width: 100%;
}
```
*hehe*，重新又改成这样：
```css
.ctn .img-ctn{
	width: 2.6rem;
	height: 2.2rem;
	margin: .3rem auto;
	overflow: hidden;
}
.ctn .img-ctn img{
	width: -webkit-calc(2.6rem + 2px);
	height: -webkit-calc(2.2rem + 2px);	
	width: calc(2.6rem + 2px);
	height: calc(2.2rem + 2px);
	background: url(images/120X120.jpg?201608012) no-repeat center;
	background-size: 1.8rem;
	margin: -1px;
    /*就是这货*/
	max-width: none;
	object-fit: cover;	
}
```
ok，提交给开发，终于可以偷懒一会了。

however，改变来的太快。开发发来了一张图：

![](http://images.cnblogs.com/cnblogs_com/phillyx/779277/o_img-src-float-transparent.png)

去开发机上调试一下，瞬间感受到了深深的恶意。

原来图片的背景图层是透明的，盒子模型的渲染层级是`color>src>background-image>background-color`，图片空白区域透明自然就显示背景图片了。
```css
img{
    background: red url(images/120X120.jpg?201608012) no-repeat center;
}
```
```html
<img src=".png">
```
![](http://images.cnblogs.com/cnblogs_com/phillyx/779277/o_img-index.png)

感觉自己的**洪荒之力**已经用完了。。。。

![](http://ww1.sinaimg.cn/mw600/67d5edb6gw1f6oosmnum0j20k00kemz6.jpg)

at the end，为了规避这种图片出现，直接不给背景图片了，还是通过模板引擎来判断吧
```html
<img src="{$src||'images/120X120.png'}"/>
```
多好，一下子就解决了。

白白饶了这么一大圈

![](http://images.cnblogs.com/cnblogs_com/phillyx/779277/o_cover-face-and-cry.jpg)