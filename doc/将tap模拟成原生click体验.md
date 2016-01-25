##将tap模拟成原生click体验
	mui提供了tap事件替换了html5的click事件，解决了300ms延时的问题。不过相比原生app的click体验还是有些许差距的。
    仅用微信为例，只有当手指离开屏幕时才触发click事件，如果对象绑定了长按事件，则触发长按操作,离开时不再触发单击事件。
    这些逻辑无论是android, ios或者仅有1%的windows mobile都已经封装好了，根本不用关心。

**那么，我们应该怎么来实现呢？
下面是详细的填坑历程。。。。。。**

###坑1.通过原生的touch来实现
```js
//直接对dom添加touchend，这种方法只能针对位置不变且并没有添加longtap事件的DOM有效
//如果在listview中，你上下滑动，那就歇菜了。
//那么自然而然就想到了touch.target的位移，并做出判断是下滑还是单击。
//自己去写复杂度、代码量估计会很可观。
//因此就想到了了在原有的框架代码上去实现。
//下面就到了坑2
document.getElementById("").('touchend', function() {
    //
});
```

###坑2.更改mui.gestures.tap.js
####坑2.1 自定义事件侦听机制
mui没有提供类似于jq.data('events')获取事件列表的机制，另外官方也推荐使用`addEventListener`去绑定事件。
我要去获取当前DOM的事件列表应该怎么做呢？

你问我问毛要去获取DOM的事件列表，，，
呵呵，我总要知道DOM有木有绑定longtap事件好做规避吧


csdn的这个帖子看似有用
[http://bbs.csdn.net/topics/390250552](http://bbs.csdn.net/topics/390250552)

```js
function addEvent(dom,type,fn) {
    if(document.addEventListener) {
        dom.addEventListener(type, fn, false);
    } else if(document.attachEvent) {
        dom.attachEvent('on' + type, fn);
    } else {
        dom['on' + type] = fn;
    };
    dom["Listener-"+type]=!0;
}
```
~~实际上并没有什么卵用~~
**思想是好的.....**
我总不能每次addEventListener都去调一下这个方法吧！

####坑2.2 使用getEventListeners
找啊找，终于找到了`getEventListeners()`这个全局方法，在chrome和safari控制台中测试都木有问题。
喜出望外......
这下终于能解决问题了
于是有了以下的方法
```js
	var getEvents = function(obj) {
		console.log(getEventListeners(obj));
		return typeof(getEventListeners) == "function" && getEventListeners(obj);
	}
	var hasEventype = function(obj, e) {
		var es = getEvents(obj);
		console.log(es[e]);
		return es && !!es[e];
	}
```
调用下试试
```js
if (!hasEventype(target, 'longtap')) {}
```
报错
**`getEventListeners` is undefined**

R U kidding?!!!!

你丫在逗我.............

我瞬间感受到了深深地恶意

原来这个方法只能在**控制台**中用，
呵呵，人艰不拆......

####坑2.3 使用全局变量规避

给mui添加一个全局变量`isLongTapAtived`，看变量名就知道什么意思吧
在`mui.gestures.longtap.js`中初始化，在`handle`中激活
```js
(function($, name) {
	$.isLongTapAtived = false;//初始化
	var timer;
	var handle = function(event, touch) {
		switch (event.type) {
			case $.EVENT_START:
				clearTimeout(timer);
				timer = setTimeout(function() {
					$.trigger(session.target, name, touch);
                    //激活了
					$.isLongTapAtived = true;
				}, options.holdTimeout);
				break;
		}
	};

	});
})(mui, 'longtap');
```
在`mui.gestures.tap.js`中判断有无激活
```js
	var handle = function(event, touch) {
		var session = $.gestures.session;
		var options = this.options;
		switch (event.type) {
			case $.EVENT_END:
				//......
				if (touch.distance < options.tapMaxDistance) {
					if (touch.deltaTime < options.tapMaxTime) {
						//.....
					} else {
						//如果当前对象添加了长按侦听，略过，否则仍然视为tap事件
						//if (!hasEventype(target, 'longtap')) {
						if (!$.isLongTapAtived) {
                        	//如果没有longtap事件,离开屏幕是触发tap事件
							$.trigger(target, name, touch);
						}
                        //重置
						$.isLongTapAtived = false;
					}
				}
				break;
		}
	};

```

想法是美好的，现实是他么残酷的。无论有无`longtap`事件,都要走一遍`longtap`的`handle`代码
于是 `$.isLongTapAtived === true;`
于是 永远`trigger` `tap` 事件

呵呵，想死的心都有了


- - -
路子看来走对了，但是应该怎么做？？？

####终极解决方案
`mui.isLongTapAtived`依然添加，只是在每一次DOM添加的longtap事件内激活
```js
document.querySelector("#").addEventListener('longtap',function(){
	mui.isLongTapAtived=true;
	console.log('你触发了longtap事件');
});
```
**这样对开发者是不友好的，不过暂时没办法，只能如此取舍了**

代码已提交至[https://github.com/phillyx/mui/](https://github.com/phillyx/mui/)
并推送给官方

博客已同步至[http://www.cnblogs.com/phillyx/p/5157850.html](http://www.cnblogs.com/phillyx/p/5157850.html)

![觉得不错就打赏一下吧](http://images.cnblogs.com/cnblogs_com/phillyx/779277/o_pay_me_2.jpg "觉得不错就打赏一下吧")
**觉得不错就打赏一下吧**