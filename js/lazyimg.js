/**
 * @author 1020450921@qq.com
 * @link http://www.cnblogs.com/phillyx
 * @link http://ask.dcloud.net.cn/people/%E5%B0%8F%E4%BA%91%E8%8F%9C
 *@description 将网络图片下载到本地并显示，包括缓存
*/
(function(win, com,$) {

	var makeArray = function(obj) {
		var res = [];
		for (var i = 0, len = obj.length; i < len; i++) {
			res.push(obj[i]);
		}
		return res;
	}

	function lazyLoad(doc, cb) {
		//console.log(lazyImg.pageno);
		var imgs;
		if (lazyImg.pageno) {
			imgs = doc.querySelectorAll("img[data-pageno='" + lazyImg.pageno + "']");
		} else {
			imgs = doc.querySelectorAll('img.lazy');
		}

		com.myasync(/*makeArray(imgs)*/$.slice.call(imgs), function(img, next) {
			var data_src = img.getAttribute('data-src');
			//console.log("data_src: "+data_src);
			if (data_src && data_src.indexOf('http://') >= 0) {
				com.cache.getFile(data_src, function(localUrl) {
					setPath(img, localUrl);
					next();
				});
			} else {
				next();
			}
		}, function() {
			cb && cb();
		});

	};

	function setPath(img, src) {
		img.setAttribute('src', src);
		img.classList.remove("lazy");
	};

	win.lazyImg = {
		lazyLoad: function(doc, cb) {
			lazyLoad(doc ? doc : document, cb);
		},
		pageno: null
	};

})(window, common, mui);