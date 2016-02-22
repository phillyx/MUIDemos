##HBuilder app开发文档
rule1:优先使用`hellomui`提供的示例插件或代码
rule2:优先使用`helloH5+`提供的代码
###css

###js
1.创建或打开页面
 - 页面id命名规则：`xxx.html`, **不要使用相对路径，一定要带`.html`扩展名**
 - 创建或打开页面，一定要给`id`; 不给，默认取`url`为`id`,会造成相对路劲的问题
 - 可是使用封装的mui.openwindow打开页面，也可以使用plus.webview.open
```js
//mui打开有两种方式
//直接传单个参数
mui.openWindow(url,id,mui.webview.options);
//传一个对象
//具体参考http://dev.dcloud.net.cn/mui/window/#openwindow
```
 - mui.openwindow最新版本没有封装** Webview窗口显示完成的回调函数**，如果需要`showedCB`可以如下操作：
```js
//直接打开页面并传参，参考http://www.html5plus.org/doc/zh_cn/webview.html#plus.webview.open
 plus.webview.open( url, id, styles, aniShow, duration, showedCB );
//或者先创建页面再打开`show`
//参考http://www.html5plus.org/doc/zh_cn/webview.html#plus.webview.create
 plus.webview.create( url, id, styles, extras );
 //在show里回调
 //参考http://www.html5plus.org/doc/zh_cn/webview.html#plus.webview.show
  plus.webview.show( id_wvobj, aniShow, duration, showedCB, extras );
```

2.创建子页面
 - 使用封装的mui方法，这种方法适合创建单个或几个子页面
```js
//具体参考 http://dev.dcloud.net.cn/mui/window/#subpage
mui.init({
    subpages:[{
      url:your-subpage-url,//子页面HTML地址，支持本地地址和网络地址
      id:your-subpage-id,//子页面标志
    }]
  });
```
 - 也可以使用`native.js`方法,具体参考`hellomui`示例`tab-webview-main.html`，这种方法适用多个子页面，且有较为复杂的内部逻辑
```js
			mui.plusReady(function() {
				var self = plus.webview.currentWebview();
				for (var i = 0; i < 4; i++) {
					var temp = {};
					var sub = plus.webview.create(subpages[i], subpages[i], subpage_style);
					if (i > 0) {
						sub.hide();
					}else{
						temp[subpages[i]] = "true";
						mui.extend(aniShow,temp);
					}
					self.append(sub);
				}
			});
```
```js
				//方法存在于父页面
				childview.addEventListener('loaded', function() {
                	//可以在子页面数据加载完毕后再显示
					childview.show();
				});
```

3.预加载页面
 - mui封装的参考http://dev.dcloud.net.cn/mui/window/#preload
 - 实际上`mui.preload`封装的就是`plus.webview.create`,具体参考http://www.html5plus.org/doc/zh_cn/webview.html#plus.webview.create