##[报bug] 弹出键盘父级页面高度也跟着变化了##
####首先说一下这个bug是怎么发现的####
	A页面打开B页面，B弹出键盘时发现A页面数据重新刷新了一遍，排查发现触发了自定义的refresh事件，很奇怪，查找了好长时间才发现是scroll的问题原来scroll也定义了refresh事件，A页面高度变化时，scroll.refresh(),跟着也触发了我自定义的refresh事件，这大坑。。。。

```javascript
//我自己定义的
window.addEventListener('refresh', function () {
				console.log("触发了");
			});
```

```javascript
	//mui.js 2090行，对wrapper定义的refresh事件，跟window的refresh事件应该没有关系啊，难道向上冒泡？
	this.wrapper.addEventListener('refresh', function() {
				self.indicators.map(function(indicator) {
					indicator.refresh();
				});
			});
```
####现在问题来了
	为毛子页面屏幕高度变化时，父页面也跟着变化，难道不应该相互独立么？
    稳重起见，又做了一次测试，从A->B->C, C高度变化了，A，B 都尼玛变掉了。。。。
