(function(com) {
	/**
 	* @author 1020450921@qq.com
 	* @link http://www.cnblogs.com/phillyx
 	* @link http://ask.dcloud.net.cn/people/%E5%B0%8F%E4%BA%91%E8%8F%9C
	 *@description 存储当前下载路径
	 */
	var cache = {};
	cache.options={
		downloadPath:"_downloads/",
		removePrefix:[]
	};
	cache.getFile = function(netPath, cb) {
		var filePathCache = getLocalFileCache(netPath);
		isExist(filePathCache, function(exist) {
			if (exist) {
				//console.log('EXIST_' + filePathCache)
				cb(filePathCache);
			} else {
				//console.log('UNEXIST_' + filePathCache+"_"+netPath)
				Filedownload(netPath, function(localPath) {
					cb(localPath);
				});
			}
		});
	};
	/**
	 * @description 检查文件是否存在
	 */
	var isExist = function(localpath, cb) {
		if (!localpath) {
			return cb(false);
		}
		plus.io.resolveLocalFileSystemURL(localpath, function() {
			cb(true);
		}, function() {
			cb(false);
		});
	}
	var couDwn = 0;
	//下载
	var Filedownload = function(netPath, callback) {
		var dtask = plus.downloader.createDownload(netPath, {}, function(d, status) {
			// 下载完成	`
			if (status == 200) {
				plus.io.resolveLocalFileSystemURL(d.filename, function(entry) {
					setLocalFileCache(netPath, entry.toLocalURL());
					callback(entry.toLocalURL()); //获取当前下载路径
				});
			} else {
				//console.log('download.state:' + d.state + "____download.status" + status);
				//下载失败 只递归一次，再次失败返回默认图片
				if (++couDwn <= 1) {
					console.log(couDwn);
					arguments.callee(netPath, callback);
				} else {
					//重置
					couDwn = 0;
					//返回默认图片
					callback();
				}
			}
		});
		//TODO 监听当前下载状态，当云服务器中不存在该文件时，查询的特别慢，估计过了3分钟以上才返回status:404，其他时间一直在刷d.state:2
		//具体的报文格式看这http://wenku.baidu.com/link?url=JtC5q4w4D8DCzid6ahpQGgir2JCxuQq_uHfJ-_G9ZxvySL1oStV6oS447QKLEMFT5JpmQCSl4gmYdotk1JfmcUBLPKO_WbaDirQulDWMK7_
		//		dtask.addEventListener( "statechanged", function(d, status){
		//			console.log(d.state);
		//		}, false );
		dtask.start();
	};

	function getLocalFileCache(netPath) {
		var FILE_CACHE_KEY = "filePathCache_" + common.hashCode(netPath);
		var localUrlObj = myStorage.getItem(FILE_CACHE_KEY);
		return localUrlObj;
	};

	function setLocalFileCache(netPath, localPath) {
		var FILE_CACHE_KEY = "filePathCache_" + common.hashCode(netPath);
		myStorage.setItem(FILE_CACHE_KEY, localPath);
	};
	/**
	 * 清除本地文件及缓存
	 */
	cache.clear = function(cb, waiting) {
		//没有手动设置下载路径，默认的下载路径是"/storage/sdcard0/Android/data/io.dcloud.HBuilder/.HBuilder/downloads/",相对路径如下
		//		plus.io.resolveLocalFileSystemURL("_downloads/", function(entry) {
		//			entry.removeRecursively(function() {
		//				myStorage.removeItemByKeys(null, function() {
		//					cb && cb();
		//				});
		//			}, function() {
		//				cb & cb(false);
		//			});
		//		}, function(e) {
		//			cb & cb(false);
		//		});
		waiting = waiting || plus.nativeUI.showWaiting('缓存清除中...');
		plus.io.resolveLocalFileSystemURL(cache.options.downloadPath, function(entry) {
			var tmpcou = 0;
			var dirReader = entry.createReader();
			dirReader.readEntries(function(entries) {
				var flen = entries.length,
					percent;
				//console.log("flen:" + flen);

				com.myasync(entries, function(fl, next) {
					if (fl.isFile) {
						fl.remove(function(en) {
							percent = Math.floor(++tmpcou / flen * 100);
							waiting.setTitle('已清除' + (percent > 99 ? 99 : percent) + '%')
							next();
						}, function(e) {
							console.log(JSON.stringify(e));
							next();
						});
					}
				}, function() {
					cache.options.removePrefix.concat(["filePathCache_","ajax_cache_"]);
					myStorage.removeItemByKeys(cache.options.removePrefix, function() {
						waiting.setTitle('已清除100%');
						setTimeout(function() {
							waiting.close();
						}, 200);
						cb && cb();
					});
				});

			}, function(e) {
				console.log(e);
			});
		}, function(e) {
			console.log(e);
		});
	};
	/**
	 *@description 查看已下载的文件
	 */
	cache.getDownloadFiles = function() {
		plus.io.resolveLocalFileSystemURL(cache.options.downloadPath, function(entry) {
			console.log(entry.toLocalURL());
			var rd = entry.createReader();
			rd.readEntries(function(entries) {
				entries.forEach(function(f, index, arr) {
					console.log(f.name);
				})
			})
		});
	}
	com.cache = cache;
}(common));