/**
 * @author 1020450921@qq.com
 * @link http://www.cnblogs.com/phillyx
 * @link http://ask.dcloud.net.cn/people/%E5%B0%8F%E4%BA%91%E8%8F%9C
 *@description 将网络图片下载到本地并显示，包括缓存
*/
(function(window, common/*, async*/) {
	
	
	function lazyLoad(doc, cb) {
		console.log(Lazyimg.pageno);
		var imgs;
		if(Lazyimg.pageno){
			imgs = doc.querySelectorAll("img[data-pageno='" + Lazyimg.pageno + "']");
		}else{
			imgs = doc.querySelectorAll('img.lazy');
		}
		// async.each(imgs, function(img, cb1) {
		// 	var data_src = img.getAttribute('data-src');
		// 	if (data_src && data_src.indexOf('http://') >= 0) {
		// 		common.cache.getFile(data_src, function(localUrl) {
		// 			setPath(img, localUrl);
		// 			cb1(null);
		// 		});
		// 	}
		// }, function() {
		// 	cb && cb();
		// });

		com.myasync(imgs, function(img, next) {
			var data_src = img.getAttribute('data-src');
			if (data_src && data_src.indexOf('http://') >= 0) {
				common.cache.getFile(data_src, function(localUrl) {
				 	setPath(img, localUrl);
					next();
				});
			}	
		}, function() {
			 cb && cb();
		});

	};

	function setPath(img, src) {
		img.setAttribute('src', src);
		img.classList.remove("lazy");
	};

	window.Lazyimg = {
		lazyLoad: function(doc, cb) {
			lazyLoad(doc ? doc : document, cb);
		},
		pageno: null
	};

})(window, common /*, async*/);