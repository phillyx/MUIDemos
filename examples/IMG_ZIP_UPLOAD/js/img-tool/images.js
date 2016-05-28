(function(window, com, mui) {
	var itool = {
		options: {
			uploadUrl: '',
			multiple: false,
			resize: {
				height: 0,
				width: 0
			},
			maxPicsCount: 30, //默认一次最多选择30张图片
			isResize: false,
			isZoom: true, //默认通过native.js压缩
			ZoomBox: 1200, //缩放宽高，默认1200px,横图缩放宽度，高度根据比例计算，同理竖图
			ZoomQuality: 89, //压缩图片的质量
			isUpload: false, //默认不上传
			selected: {}, //仅在多图片选择时生效，相册选择界面将选中指定的图片路径列表。
			system: false, //设置为true时，如果系统自带相册选择控件时则优先使用，否则使用5+统一相册选择控件；设置为false则不使用系统自带相册选择控件，直接使用5+统一相册选择界面。
			onmaxed: function() { //多选超出最大数量给出提示
				plus.nativeUI.toast("最多只能选择30张图片");
			},
			watermarkState: false, //是否添加水印   true添加     false不添加
			textWatermark: '' //添加水印的文字
		}
	};
	/**
	 * @description 选择相册    兼容旧方法（单独传参isUpload, isZoom),现推荐封装在option中
	 * @param {Object} option 参见itool.options
	 * @param {Object} cb    (error,imgUrl) 或 （[{error,imgUrl},...]）
	 * @param {Object}  是否上传
	 * @param {Object} isZoom
	 */
	function getPic(cb) {
		console.log(JSON.stringify(itool.options));
		//私有参数  用于存放最终使用的参数值
		var optionUpload = {
			watermarkState: itool.options.watermarkState,
			textWatermark: itool.options.textWatermark
		}

		//重置
		endReturn = [];
		plus.gallery.pick(function(e) {
			if (itool.options.multiple) {
				/*if(e.files.length > itool.options.maxPicsCount){
					return cb && cb('最多选择'+itool.options.maxPicsCount+'张图片');
				}*/
				return processing_imgs(optionUpload, e.files, cb);
			}
			processing_imgs(optionUpload, e, cb);
		}, function(error) {
			sys_permission(error);
			console.log(error.message)
			cb && cb('已取消');
		}, {
			filter: "image",
			multiple: itool.options.multiple,
			maximum: itool.options.maxPicsCount,
			system: false,
			onmaxed: itool.options.onmaxed
		});
	};

	var endReturn = [];

	function processing_imgs(option, files, cb) {
		if (typeof(files) === "string") {
			files = [files];
		}
		console.log(JSON.stringify(files));
		com.myasync(files, function(f, next) {
			console.log("processing_imgs_f" + f);
			processing_img(option, f, next);
		}, function() {
			//end
			console.log('end');
			if (endReturn.length == 0)
				cb && cb(endReturn[0].error, endReturn[0].imgUrl);
			else
				cb && cb(endReturn);
		});
	};

	function processing_img(option, pic, cb) {
		plus.nativeUI.closeWaiting();
		plus.nativeUI.showWaiting('图片上传中，请耐心等待...');
		console.log("processing_img_" + pic);
		if (pic) {
			//option && option.onSelect && option.onSelect(pic);
			if (itool.options.isResize) {
				resize(pic, itool.options.resize, function(base64Str) {
					imgUploadBase64(base64Str, function(err, filePath) {
						cb && cb(err, filePath);
					});
				});
			} else {
				//是否需要压缩
				if (itool.options.isZoom) {
					console.error("需要压缩");
					zoomImage(pic, function(data) {
						if (itool.options.isUpload) {
							imgUploadJudgeWatermark(option, data.target, function(err, imgUrl) {
								endReturn.push({
									error: err,
									imgUrl: imgUrl
								});
								cb && cb(err, imgUrl);
							});
						} else {
							var err = '';
							endReturn.push({
								error: err,
								imgUrl: data.target
							});
							cb && cb(err, data.target);
						}
					});
				} else {
					console.error("不需要压缩");
					if (itool.options.isUpload) {
						imgUploadJudgeWatermark(option, pic, function(err, imgUrl) {
							endReturn.push({
								error: err,
								imgUrl: imgUrl
							});
							cb && cb(err, imgUrl);
						});
					} else {
						endReturn.push({
							error: err,
							imgUrl: pic
						});
						cb && cb(err, pic);
					}
				}

			}
		}
	};
	//获取当前上传的
	//	function getSignature(option,cb) {
	//		var key = 'Signature_KEY'+common.hashCode(JSON.stringify(option));
	//		var dataStorage = myStorage.getItem(key);
	//		var time = new Date().getTime(); //获取当前时间
	//		if (dataStorage) {
	//			if (((time - dataStorage.time) / 60000) > 40) {
	//				dataStorage = null;
	//			}
	//		}
	//		if (dataStorage) {
	//			return cb(dataStorage.policy, dataStorage.signature);
	//		}
	//		getImageKey(option,function(data) {
	//			data.time = time;
	//			myStorage.setItem(key, data);
	//			cb(data.policy, data.signature);
	//		});
	//	}
	/**
	 * @description 上传图片
	 * @param {Object} path
	 * @param {Object} cb
	 * @param {URL}	uploadUrl
	 */
	function imgUpload(path, cb, uploadUrl) {
		return imgUploadCom(path, {}, cb, uploadUrl);
	}

	/**
	 * @description 上传图片添加水印 
	 * @param {Object} path
	 * @param {Object} cb
	 * @param {URL}	uploadUrl
	 */
	function imgUploadWithTextWatermark(textWatermark, path, cb, uploadUrl) {
		var option = {
			'x-gmkerl-thumb': '/watermark/text/5L2g5aW977yB/font/simhei'
		};
		return imgUploadCom(path, option, cb, uploadUrl);
	}

	/*
	 * @description 上传图片  判断是否添加水印（正常情况下，上传图片调用这个方法）
	 * @param {Object} option  水印状态、水印文字在这里面
	 * @param {Object} path
	 * @param {Object} cb
	 * @param {URL}	uploadUrl
	 */
	function imgUploadJudgeWatermark(option, path, cb, uploadUrl) {
		if (!option.watermarkState) {
			//不添加水印
			return imgUploadCom(path, {}, cb, uploadUrl);
		} else {
			console.log("图片添加水印");
			var textWatermark = option.textWatermark;
			var option = {
				'x-gmkerl-thumb': '/watermark/text/5L2g5aW977yB/font/simhei'
			};
			return imgUploadCom(path, option, cb, uploadUrl);
		}
	}

	/**
	 * @description 上传图片带参数 
	 * @param {Object} path
	 * @param {Object} cb
	 * @param {URL}	uploadUrl
	 */
	function imgUploadCom(path, option, cb, uploadUrl) {
		uploadUrl = uploadUrl || itool.options.uploadUrl;
		//		getSignature(option||{},function(policy, signature) {

		var task = plus.uploader.createUpload(uploadUrl, {
			method: "POST",
			timeout: 10
		}, function(t, status) {
			if (status == 200) {
				var data = JSON.parse(t.responseText);
				if (data.code == 200) {
					imgurl = data.url;
					cb && cb(false, imgurl);
					//cb && cb(false,imgurl);
				} else {
					cb && cb(data.message);

				}
			} else {

				cb && cb('上传失败！');
			}
		});
		task.addFile(path, {
			key: 'file'
		});
		task.addData('string_key', com.getUid())
			//			task.addData('policy', policy);
			//			task.addData('signature', signature);
		task.start();
		//		});
	}
	//获取图像key
	//	var getImageKey = function(option,cb) {
	//		mui.ajax({
	//			url: "http://api.yihunqing.net/v2/upload/getSignature",
	//			dataType: "json",
	//			data:option,
	//			success: function(data) {
	//				cb(data);
	//
	//			},
	//			error: function() {
	//				cb(null);
	//			}
	//		})
	//	};
	/**
	 * @description js压缩
	 * @param {Object} path
	 * @param {Object} sizeOption
	 * @param {Object} cb
	 */
	function resize(path, sizeOption, cb) {
		lrz(path, {
			before: function() {
				console.log('压缩开始');
			},
			fail: function(err) {
				console.error(err);
			},
			always: function() {
				console.log('压缩结束');
			},
			done: function(results) {
				console.log(5)
				cb && cb(results.base64);
			},
			width: (sizeOption && sizeOption.width) ? sizeOption.width : 600, //默认值
			height: (sizeOption && sizeOption.height) ? sizeOption.height : 600,
		});
	}
	/**
	 * @description base64字节图片上传
	 * @param {MediaStream} base64
	 * @param {Function} cb
	 * @param {URL} url  上传文件远程地址
	 */
	function imgUploadBase64(base64, cb, url) {
		url = url || "upload/uploadImgBase64"
		mui.ajax({
			url: url,
			data: {
				img: base64
			},
			type: "post",
			success: function(data) {

				if (data.success) {

					cb && cb(null, data.data[0]);
				}
			},
			error: function(xhr, type, errorThrown) {
				cb(errorThrown);
			}
		});
	};
	/**
	 * @description 缩放图片
	 * @param {Object} pth 图片本地路径
	 * @param {Object} cb 
	 */
	function zoomImage(pth, cb) {
		console.log("zoomImage_" + pth);
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
		console.log("conf: " + JSON.stringify(conf));
		plus.zip.compressImage(conf, function(data) {
			console.log(JSON.stringify(data));
			cb(data);
		}, function(error) {
			console.log(JSON.stringify(error));
			cb();
		});
	};
	/**
	 * @description 手机拍照并压缩
	 * @param {Object} cb
	 * @param {Object} err
	 */
	function cameraFn(cb, err) {
		console.log(1);
		var cmr = plus.camera.getCamera();
		console.log(2);
		cmr.captureImage(function(p) {
			console.log(3)
			var path = p;
			plus.io.resolveLocalFileSystemURL(path, function(entry) {
				console.log(4);
				console.log(entry.toLocalURL());
				zoomImage(entry.toLocalURL(), function(data) {
					console.log(5);
					cb && cb(data.target);
				})
			}, function(e) {
				console.log("读取拍照文件错误：" + e.message);
			});
		}, function(e) {
			err && err(e);
			console.log("失败：" + e.message);
		}, {
			filename: "_doc/camera/",
			index: 1
		});
	};
	/**
	 * @description 手机拍照并上传
	 * @param {Object} option {isUpload,isZoom,ZoomBox} 默认不上传、默认压缩、默认压缩质量1200px
	 * @param {funcback} cb
	 * @return  cb(path) 拍照并上传后返回远程链接
	 */
	function camera_upload(option, cb) {
		//重置 拍照无用，重置不要占内存
		endReturn = [];
		//私有参数  用于存放最终使用的参数值
		var optionUpload = {
			watermarkState: /* option.watermarkState || */ itool.options.watermarkState,
			textWatermark: /*option.textWatermark || */ itool.options.textWatermark
		}

		var cmr = plus.camera.getCamera();
		cmr.captureImage(function(p) {
			var path = p;
			plus.io.resolveLocalFileSystemURL(path, function(entry) {
				//妈蛋 entry.fullPath 有坑，在ios上获取不到
				console.log("entry.toLocalURL: " + entry.toLocalURL());
				if (itool.options.isUpload) {
					processing_img(optionUpload, entry.toLocalURL(), cb);
				} else {
					cb & cb(null, entry.toLocalURL());
				}
			}, function(e) {
				console.log("读取拍照文件错误：" + e.message);
				cb && cb('读取拍照文件错误');
			});

		}, function(e) {
			cb && cb(e.message);
			console.log("失败：" + e.message);
		}, {
			filename: "_doc/camera/",
			index: 1
		});
	}
	itool.getPic = getPic;
	itool.imgUpload = imgUpload;
	itool.imgUploadBase64 = imgUploadBase64;
	itool.resize = resize;
	itool.zoomImage = zoomImage;
	itool.cameraFn = cameraFn;
	itool.camera_upload = camera_upload;
	window.imageTool = itool;

})(window, common, mui);