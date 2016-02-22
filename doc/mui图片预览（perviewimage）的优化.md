##mui图片预览（perviewimage）的优化
主要对`mui`**图片全屏预览插件**做了以下三点补充
1.添加了预览图片文字说明，使用的时候需要添加以下`css`及`DOM`属性
```css
			.mui-slider-img-content {
				position: absolute;
				bottom: 10px;
				left: 10px;
				right: 10px;
				color: white;
				text-align: center;
				line-height: 21px
			}
```

```html
<img src="../images/yuantiao.jpg" data-preview-src="" data-preview-group="2" data-content="这里是文字说明"/>
```
2.如果图片过宽或过长，预加载图片（上一张或下一张）时，会和当前显示的图片重叠
原来的效果是这样
![](http://images.cnblogs.com/cnblogs_com/phillyx/779277/o_QQ%E6%88%AA%E5%9B%BE20160127160020.png)
主要对缩放进行了更改
```js
	proto._initImgData = function(itemData, imgEl) {
		if (!itemData.sWidth) {
			var img = itemData.el;
			itemData.sWidth = img.offsetWidth;
			itemData.sHeight = img.offsetHeight;
			var offset = $.offset(img);
			itemData.sTop = offset.top;
			itemData.sLeft = offset.left;
			//缩放判断，解决预加载图片时，图片过大，和当前显示图片重叠的问题
            //未更改之前缩放比例能达到2.5倍以上
			var scale = Math.max(itemData.sWidth / window.innerWidth, itemData.sHeight / window.innerHeight);
			itemData.sScale = scale > 1 ? 0.977 : scale;
		}
		imgEl.style.webkitTransform = 'translate3d(0,0,0) scale(' + itemData.sScale + ')';
	};
```
3.解决了预加载页面返回（mui.back）重新加载数据并打开时，预览无用的问题
主要应用场景是这样的：
 - view是预加载的，返回时view隐藏，DOM重置，
 - 如果不清除当前预览对象previmage的话，加载数据后打开当前页面，重新调用mui.previewImage()无效，依然是第一次的预览的`DOM`结果
 - 因为插件源码决定了该对象是不变的
```js
	var previewImageApi = null;
	$.previewImage = function(options) {
		if (!previewImageApi) {
			previewImageApi = new PreviewImage(options);
		}
		return previewImageApi;
	};
```
 - 有朋友会问，为毛要预加载，为什么不通过loadurl或其他方式刷新页面（或DOM）？
 - 就为了优化性能，秒开页面，整个详情页的代码前前后后改了一个多星期
 - 我不可能因为插件的不完整而放弃优化的成果。
 - 所以就有了以下的代码
```js
	//释放当前对象及清除DOM
	proto.dispose = function() {
		var prevdom = document.getElementById("__MUI_PREVIEWIMAGE");
		prevdom && prevdom.parentNode.removeChild(prevdom);
		previewImageApi = null;
	};
```

具体代码在这[https://github.com/phillyx/mui/blob/master/examples/hello-mui/examples/imageviewer.html](https://github.com/phillyx/mui/blob/master/examples/hello-mui/examples/imageviewer.html)