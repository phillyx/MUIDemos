##基于plus.downloader的图片懒加载功能，支持本地缓存
	1.页面先引入[async.js](https://github.com/caolan/async)
	2.本地缓存的代码使用到了[这个链接](http://www.cnblogs.com/phillyx/p/4648276.html)
	建议在懒加载前给img一个默认图片
####源码
```javascript
 /**
 * 将网络图片下载到本地并显示，包括缓存
 */
(function(lazyimg) {

	lazyimg.lazyLoad = function(doc, cb) {

		lazyLoad(doc ? doc : document,cb);
	}
	var lazyLoad = function(doc, cb) {
		var imgs = doc.querySelectorAll('img.lazy');
		async.each(imgs, function(img, cb1) {
			var data_src = img.getAttribute('data-src');
			if (data_src && data_src.indexOf('http://') >= 0) {
				common.cache.getFile(data_src, function(localUrl) {
					setPath(img, localUrl);
					cb1(null);
				});
			}
		}, function() {
			cb && cb();
		});

	}

	function setPath(img, src) {
		img.setAttribute('src', src);
		img.classList.remove("lazy");
	}
}(window.Lazyimg = {}));

```

####使用
```javascript
var getImgs=function(cb){
 	var imgs=document.querySelectorAll("img");
    imgs=mui.slice.call(imgs);
    imgs.forEach(function(item, index, array) {
    	item.setAttribute("data-src", "远程链接")
    });
    cb&&cb();
}
getImgs(function(){
	Lazyimg.lazyLoad();
});
```