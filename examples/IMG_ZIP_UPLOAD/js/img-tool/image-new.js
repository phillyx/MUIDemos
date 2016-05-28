/**
 * @author 1020450921@qq.com
 * @link http://www.cnblogs.com/phillyx
 * @link http://ask.dcloud.net.cn/people/%E5%B0%8F%E4%BA%91%E8%8F%9C
 */
var imageTool = (function(mui, com) {
	/**
	 * 1.使用native.js压缩
	 * 1.1.拍照上传
	 * 1.2.选择图片上传
	 */
	var endReturn = [];
	var itool = {
		options: {
			uploadUrl: '', //图片上传地址
			multiple: false, //是否多图上传
			maxPicsCount: 8, //默认一次最多选择8张图片
			isZoom: true, //默认通过native.js压缩
			ZoomBox: 1200, //缩放宽高，默认1200px,横图缩放宽度，高度根据比例计算，同理竖图
			ZoomQuality: 89, //压缩图片的质量
			isUpload: false, //默认不上传
			system: false, //设置为true时，如果系统自带相册选择控件时则优先使用，否则使用5+统一相册选择控件；设置为false则不使用系统自带相册选择控件，直接使用5+统一相册选择界面。
		},
		setUploadData: function(task) {
			task.addData("client", "HelloH5+");
			task.addData("uid", com.getUid());
		}
	};
	/**
	 * @description get images from an album
	 * @param {Object} cb(err,files)
	 */
	function galleryImgs(cb) {
		//重置
		endReturn = [];
		plus.gallery.pick(function(e) {
			if (itool.options.multiple) {
				/*if(e.files.length > itool.options.maxPicsCount){
					return cb && cb('最多选择'+itool.options.maxPicsCount+'张图片');
				}*/
			}
			processing_imgs(itool.options.multiple ? e.files : e, cb);
		}, function(error) {
			sys_permission(error);
			cb && cb(error.message);
		}, {
			filter: "image",
			multiple: itool.options.multiple,
			maximum: itool.options.maxPicsCount,
			system: false,
			onmaxed: function() {
				mui.toast('最多选择' + itool.options.maxPicsCount + '张图片');
			}
		});
	};

	var endReturn = [];

	function processing_imgs(files, cb) {
		plus.nativeUI.closeWaiting();
		plus.nativeUI.showWaiting('图片处理中，请耐心等待...');
		if (typeof(files) === "string") {
			files = [files];
		}
		console.log(JSON.stringify(files));
		com.myasync(files, processing_img, function() {
			plus.nativeUI.closeWaiting();
			//end
			console.log("end");
			console.log(endReturn)
			cb && cb(false, endReturn);
		});
	};
	/**
	 * @description 压缩并上传图片单独拎出来，拍照也可用到
	 * @param {Object} pic
	 * @param {Object} next
	 */
	function processing_img(pic, next) {
		console.log(pic);
		if (pic) {
			//是否需要压缩
			if (itool.options.isZoom) {
				zoomImage(pic, function(err, p) {
					processing_img_x(p, next);
				});
			} else {
				processing_img_x(pic, next);
			}
		}
	};

	function processing_img_x(pic, next) {
		if (itool.options.isUpload) {
			imgUploadCom(pic, function(err, imgUrl) {
				endReturn.push({
					error: err,
					imgUrl: imgUrl
				});
				next();
			});
		} else {
			endReturn.push({
				imgUrl: pic
			});
			next();
		}
	}
	/**
	 * @description 上传图片带参数 
	 * @param {Object} path
	 * @param {Object} cb
	 */
	function imgUploadCom(path, cb) {
		var uploadUrl = itool.options.uploadUrl;
		var task = plus.uploader.createUpload(uploadUrl, {
			method: "POST",
			timeout: 10
		}, function(t, status) {
			if (status == 200) {
				console.log(JSON.stringify(t));
				var data = JSON.parse(t.responseText);
				//上传成功后后台返回的数据格式规范为{code:200,url:'网络链接'}
				if (data.code == 200) {
					imgurl = data.url;
					cb && cb(false, imgurl);
				} else {
					cb && cb(data.message);
				}
			} else {
				cb && cb('上传失败！');
			}
		});
		task.addFile(path, {
			key: 'phillyx_' + com.getUid()
		});
		itool.setUploadData(task);
		task.start();
	}
	/**
	 * @description 缩放图片
	 * @param {Object} pth 图片本地路径
	 * @param {Object} cb 
	 */
	function zoomImage(pth, cb) {
		//不覆盖原图
		var newImgSrc = "_downloads/" + (+new Date()) + pth.substr(pth.lastIndexOf('.'));
		var conf = {
			src: pth,
			dst: newImgSrc,
			//dst:pth,
			//overwrite:true,
			quality: itool.options.ZoomQuality
		};
		//不再判断横图和竖图
		conf['width'] = itool.options.ZoomBox + 'px';
		plus.zip.compressImage(conf, function(data) {
			cb(false, data.target);
		}, function(err) {
			cb(err.message, pth);
		});
	};
	/**
	 * @description 手机拍照并压缩(上传)
	 * @param {Object} cb(err,files)
	 * @param {Object} err
	 */
	function camera(cb) {
		//重置 拍照无用，重置不要占内存
		endReturn = [];
		var cmr = plus.camera.getCamera();
		cmr.captureImage(function(p) {
			plus.io.resolveLocalFileSystemURL(p, function(entry) {
				//妈蛋 entry.fullPath 有坑，在ios上获取不到
				var u = entry.toLocalURL();
				console.log("entry.toLocalURL: " + u);
				processing_imgs(u, cb);
			}, function(err) {
				console.log("读取拍照文件错误：" + err.message);
				cb && cb(err.message);
			});
		}, function(err) {
			//未测拍照权限 err.code
			console.log("失败：" + err.message);
			cb && cb(err.message);
		}, {
			filename: "_doc/camera/",
			index: 1
		});
	};

	/**
	 * @description 打开相册失败，请求系统权限
	 * @param {Error} e
	 */
	function sys_permission(e) {
		if (plus.os.name == "iOS") {
			if (e.code == 8) {
				mui.alert("您的相册权限未打开，请在当前应用设置-隐私-相册来开打次权限", function() {
					plus.runtime.openURL('prefs:root=Privacy');
				})
			}
		} else if (plus.os.name == "Android") {
			if (e.code != 12) {
				mui.alert("您的相册权限未打开，请在应用列表中找到您的程序，将您的权限打开", function() {
					var android = plus.android.importClass('com.android.settings');
					var main = plus.android.runtimeMainActivity();
					var Intent = plus.android.importClass("android.content.Intent");
					var mIntent = new Intent('android.settings.APPLICATION_SETTINGS');
					main.startActivity(mIntent);
				});
			}
		}
	};
	itool.galleryImgs = galleryImgs;
	itool.imgUpload = imgUploadCom;
	itool.zoomImage = zoomImage;
	itool.camera = camera;
	return itool;
})(mui, common);