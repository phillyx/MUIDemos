###页面优化的方式有哪些？
####常规优化
1. javascript 外联文件引用放在 html 文档底部
2. css 外联文件引用在 html 文档头部
3. http 静态资源尽量用多个子域名：充分利用现代浏览器的多线程并发下载能力。浏览器的多线程下载能力
4. 服务器端提供 html 文档和 http 静态资源时，尽量开启 gzip 压缩
5. 尽量减少 HTTP Requests 的数量
6. js/css 的 minify
7. 大量使用 CSS Sprites：这样做可以大大地减少CSS背景图片的HTTP请求次数；
8. 首屏不需要展示的较大尺寸图片，请使用 LazyLoad 
9. 避免404错误：请求一个外联 js 失败时获得的404错误，不但会堵塞并行的下载，而且浏览器会尝试分析404响应的内容，来辨识它是否是有用的Javascript代码；
10. 减少 cookies 的大小：尽量减少 cookies 的体积对减少用户获得响应的时间十分重要；
	- 去除不必要的 cookie ；
	- 尽量减少 cookie 的大小；
	- 留心将 cookie 设置在适当的域名下，避免影响到其他网站；
	- 设置适当的过期时间。一个较早的过期时间或者不设置过期时间会更快地删除 cookie，从而减少响应时间。
11. 避免使用 javascript 来定位布局
12. 图片压缩优化
13. 不要使用frameset，少使用iframe: 搜索引擎不友好、 即时内容为空，加载也需要时间、会阻止页面加载。禁止使用iframe引入外部资源，不包括allyes广告，不包括about:blank的空页面。

####中高级优化
1. combo handler 的引入：
通过combo handler模块，来合并相同URL下的Javascript和CSS文件，从而减少文件请求数
我们移动端首页就做了优化

	http://res.suning.cn/project/mvs/RES/common/script/??module/iscroll-lite/5.1.3/iscroll-lite.js,module/alertBox/2.0.0/alertBox.js,module/swipe/1.1.0/swipe.js
	
2. 引入script元素做延迟解析异步渲染，如在移动端应用广泛的artemplate
3. 添加Expire或Cache-Control:应用于不经常变化的组件，包括脚本、样式表、Flash组件、图片
4. 避免重定向：在重定向完毕并且HTML下载完毕之前，是没有任何东西显示给用户的
5. js代码优化
	 - 代码逻辑分层
	 - 避免全局变量
	 - 便于多人协作开发
	 - 各部分代码模块化，可以按需加载
	 - 保持全局变量的清洁
	 - 可进行单元测试
6. 减少 DOM Elements 的数量：针对一个展现元素，尽量减少其包含的DOM结点

####移动端页面优化
 移动页面的速度跟三个因素有关，分别是：移动网络带宽速度，设备性能（CPU，GPU，浏览器），页面本身。
 因此移动页面优化尤其特殊性。除了以上的处理方式，还有一些优化手段
 
1. 预加载
	- 显性加载
	
	参考天猫首页，在页面加载完毕之前，有一个缓冲的动画过程。它一方面能增加页面的趣味性，另一方面能让后续页面体验更流畅
	- 隐性加载  ：主要是图片的懒加载

2. 按需加载
3. 能用css3实现的效果就不要用图片
4. 使用icon-font代替图片
5. 尽量避免DataURI

	DataURI要比简单的外链资源慢6倍，生成的代码文件相对图片文件体积没有减少反而增大，而且浏览器在对这种base64解码过程中需要消耗内存和cpu，这个在移动端坏处特别明显。
6. 点击事件优化

	在移动端请适当使用touchstart，touchend，touch等事件代替延迟比较大的click事件。
7. 使用成熟的前端手势库
8. 动画优化
	
	 - 尽量使用css3动画
	 - 适当使用canvas动画
	 - 合理使用requestAnimationFrame  (android版本4.3以上)

9. 高频事件优化

   类似touchmove，scroll这类的事件可导致多次渲染，对于这种事件可以通过以下手段进行优化：
 - 使用requestAnimationFrame监听帧变化，使得在正确的时间进行渲染
 - 增加响应变化的时间间隔，减少重绘次数：移动端的搜索结果页的lazyload插件就是这么干的

####参考链接
1. [http://www.cnblogs.com/and/p/3390676.html](http://www.cnblogs.com/and/p/3390676.html)

2. [http://blog.csdn.net/j_shocker/article/details/46912601](http://blog.csdn.net/j_shocker/article/details/46912601)

3. [http://tgideas.qq.com/webplat/info/news_version3/804/808/811/m579/201412/293834.shtml](http://tgideas.qq.com/webplat/info/news_version3/804/808/811/m579/201412/293834.shtml)





*ps:内部转正，要求开放性简答三个问题*

>*题目一：  css权重是什么？*

>*题目二：js的基本数据类型有哪些？*

>*题目三：页面优化的方式有哪些？*

![](http://img2.imgtn.bdimg.com/it/u=382608122,1442631365&fm=21&gp=0.jpg)