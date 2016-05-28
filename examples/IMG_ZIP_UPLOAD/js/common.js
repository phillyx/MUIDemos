/**
 * @author 1020450921@qq.com
 * @link http://www.cnblogs.com/phillyx
 * @link http://ask.dcloud.net.cn/people/%E5%B0%8F%E4%BA%91%E8%8F%9C
 */
var common =
	(function($) {
		var com = {};
		/**
		 * @description 获取当前DOM的所有同类型兄弟结点
		 * @param {Object} obj
		 * @param {Object} arr
		 */
		var getAllDomBrothers = function(obj, arr) {
			var arr = arr || [];
			var pre = obj.previousElementSibling;
			var nex = obj.nextElementSibling;
			if (obj && !arr.Contains(obj)) {
				arr.push(obj);
			}
			if (pre && pre.tagName == obj.tagName && !arr.Contains(pre)) {
				getAllDomBrothers(pre, arr);
			}
			if (nex && nex.tagName == obj.tagName && !arr.Contains(nex)) {
				getAllDomBrothers(nex, arr);
			}
			return arr;
		};
		com.getAllDomBrothers = getAllDomBrothers;
		/**
		 * 通过递归实现异步阻塞
		 * @param {Object} list
		 * @param {Object} cb_exec
		 * @param {Object} cb_end
		 */
		function myasync(list, cb_exec, cb_end) {
			var each = function(_list, cb) {
				if (_list.length < 1) {
					return cb_end && cb_end();
				}
				cb(_list.shift(), function() {
					each(list, cb);
				})
			}
			each(list, cb_exec)
		};
		com.myasync = myasync;
		/**
		 * @description 生成一个随机数
		 */
		com.hashCode = function(str) {
			var hash = 0;
			if (!str || str.length == 0) return hash.toString();
			for (i = 0; i < str.length; i++) {
				char = str.charCodeAt(i);
				hash = ((hash << 5) - hash) + char;
				hash = hash & hash; // Convert to 32bit integer
			}
			return hash.toString();
		};

		/**
		 * @description 产生一个随机数
		 */
		com.getUid = function() {
			return Math.floor(Math.random() * 100000000 + 10000000).toString();
		};
		/**
		 * @author liuyf 2015-4-30
		 * @description 获取系统信息
		 */
		com.GetDeviceInfo = function() {
			var device = {
				IMEI: plus.device.imei,
				IMSI: '',
				Model: plus.device.model,
				Vendor: plus.device.vendor,
				UUID: plus.device.uuid,
				Screen: plus.screen.resolutionWidth * plus.screen.scale + 'x' + plus.screen.resolutionHeight * plus.screen.scale + '',
				DPI: plus.screen.dpiX + 'x' + plus.screen.dpiY,
				OS: new Object()
			};
			for (var i = 0; i < plus.device.imsi.length; i++) {
				device.IMSI += plus.device.imsi[i];
			}
			var types = {};
			types[plus.networkinfo.CONNECTION_UNKNOW] = '未知网络';
			types[plus.networkinfo.CONNECTION_NONE] = '未连接网络';
			types[plus.networkinfo.CONNECTION_ETHERNET] = '有线网络';
			types[plus.networkinfo.CONNECTION_WIFI] = 'WiFi网络';
			types[plus.networkinfo.CONNECTION_CELL2G] = '2G蜂窝网络';
			types[plus.networkinfo.CONNECTION_CELL3G] = '3G蜂窝网络';
			types[plus.networkinfo.CONNECTION_CELL4G] = '4G蜂窝网络';
			device.NetworkInfo = types[plus.networkinfo.getCurrentType()];
			device.OS = {
				Language: plus.os.language,
				Version: plus.os.version,
				Name: plus.os.name,
				Vendor: plus.os.vendor
			};
			return device;
		};

		/**
		 * @description 安卓创建快捷键方式
		 *
		 */
		com.createShortcut = function(name,iconUrl) {
			if (mui.os.android) {
				// 导入要用到的类对象
				var Intent = plus.android.importClass("android.content.Intent");
				var BitmapFactory = plus.android.importClass("android.graphics.BitmapFactory");
				// 获取主Activity
				var main = plus.android.runtimeMainActivity();
				// 创建快捷方式意图
				var shortcut = new Intent("com.android.launcher.action.INSTALL_SHORTCUT");
				// 设置快捷方式的名称
				shortcut.putExtra(Intent.EXTRA_SHORTCUT_NAME, name);
				// 设置不可重复创建
				shortcut.putExtra("duplicate", false);
				// 设置快捷方式图标
				var iconPath = plus.io.convertLocalFileSystemURL(iconUrl); // 将相对路径资源转换成系统绝对路径
				var bitmap = BitmapFactory.decodeFile(iconPath);
				shortcut.putExtra(Intent.EXTRA_SHORTCUT_ICON, bitmap);
				// 设置快捷方式启动执行动作
				var action = new Intent(Intent.ACTION_MAIN);
				action.setComponent(main.getComponentName());
				shortcut.putExtra(Intent.EXTRA_SHORTCUT_INTENT, action);
				// 广播创建快捷方式
				main.sendBroadcast(shortcut);
			}
		};
		/**
		 * @description 双击返回键退出
		 */
		com.bindQuit = function() {
			if (mui.os.android) {
				var backButtonPress = 0;
				mui.back = function(event) {
					backButtonPress++;
					if (backButtonPress > 1) {
						plus.runtime.quit();
					} else {
						plus.nativeUI.toast('再按一次退出应用');
					}
					setTimeout(function() {
						backButtonPress = 0;
					}, 1000);
					return false;
				};
			}
		};
		com.androidMarket = function(pname) {
			plus.runtime.openURL("market://details?id=" + pname);
		};

		com.iosAppstore = function (url) {
			plus.runtime.openURL("itms-apps://" + url);
		};
		return com;
	}(mui));

(function(win,com, mui) {
	/**
 	* @author 1020450921@qq.com
 	* @link http://www.cnblogs.com/phillyx
 	* @link http://ask.dcloud.net.cn/people/%E5%B0%8F%E4%BA%91%E8%8F%9C
	* @description 本地存储
	*/
	var myStorage = {};

	function getItem(k) {
		var jsonStr = window.localStorage.getItem(k.toString());
		return jsonStr ? JSON.parse(jsonStr).data : null;
	};

	function getItemPlus(k) {
		var jsonStr = plus.storage.getItem(k.toString());
		return jsonStr ? JSON.parse(jsonStr).data : null;
	};
	myStorage.getItem = function(k) {
		return getItem(k) || getItemPlus(k);
	};
	myStorage.setItem = function(k, value) {
		value = JSON.stringify({
			data: value
		});
		k = k.toString();
		try {
			window.localStorage.setItem(k, value);
		} catch (e) {
			console.log(e);
			//TODO 超出localstorage容量限制则存到plus.storage中
			//且删除localStorage重复的数据
			removeItem(k);
			plus.storage.setItem(k, value);
		}
	};

	function getLength() {
		return window.localStorage.length;
	};
	myStorage.getLength = getLength;

	function getLengthPlus() {
		return plus.storage.getLength();
	};
	myStorage.getLengthPlus = getLengthPlus;

	function removeItem(k) {
		return window.localStorage.removeItem(k);
	};

	function removeItemPlus(k) {
		return plus.storage.removeItem(k);
	};
	myStorage.removeItem = function(k) {
		window.localStorage.removeItem(k);
		return plus.storage.removeItem(k);
	}
	myStorage.clear = function() {
		window.localStorage.clear();
		return plus.storage.clear();
	};

	function key(index) {
		return window.localStorage.key(index);
	};
	myStorage.key = key;

	function keyPlus(index) {
		return plus.storage.key(index);
	};
	myStorage.keyPlus = keyPlus;

	function getItemByIndex(index) {
		var item = {
			keyname: '',
			keyvalue: ''
		};
		item.keyname = key(index);
		item.keyvalue = getItem(item.keyname);
		return item;
	};
	myStorage.getItemByIndex = getItemByIndex;

	function getItemByIndexPlus(index) {
		var item = {
			keyname: '',
			keyvalue: ''
		};
		item.keyname = keyPlus(index);
		item.keyvalue = getItemPlus(item.keyname);
		return item;
	};
	myStorage.getItemByIndexPlus = getItemByIndexPlus;
	/**
	 * @author liuyf 2015-05-04
	 * @description 获取所有存储对象
	 * @param {Object} key 可选，不传参则返回所有对象，否则返回含有该key的对象
	 */
	myStorage.getItems = function(k) {
		var items = [];
		var numKeys = getLength();
		var numKeysPlus = getLengthPlus();
		var i = 0;
		if (k) {
			for (; i < numKeys; i++) {
				if (key(i).toString().indexOf(k) != -1) {
					items.push(getItemByIndex(i));
				}
			}
			for (i = 0; i < numKeysPlus; i++) {
				if (keyPlus(i).toString().indexOf(k) != -1) {
					items.push(getItemByIndexPlus(i));
				}
			}
		} else {
			for (i = 0; i < numKeys; i++) {
				items.push(getItemByIndex(i));
			}
			for (i = 0; i < numKeysPlus; i++) {
				items.push(getItemByIndexPlus(i));
			}
		}
		return items;
	};
	/**
	 * @description 清除指定前缀的存储对象
	 * @param {Object} keys
	 * @default ["filePathCache_","ajax_cache_"]
	 * @author liuyf 2015-07-21
	 */
	myStorage.removeItemByKeys = function(keys, cb) {
		if (typeof(keys) === "string") {
			keys = [keys];
		}
		var numKeys = getLength();
		var numKeysPlus = getLengthPlus();
		//TODO plus.storage是线性存储的，从后向前删除是可以的 
		//稳妥的方案是将查询到的items，存到临时数组中，再删除  
		var tmpks = [];
		var tk,
			i = numKeys - 1;
		for (; i >= 0; i--) {
			tk = key(i);
			Array.prototype.forEach.call(keys, function(k, index, arr) {
				if (tk.toString().indexOf(k) != -1) {
					tmpks.push(tk);
				}
			});
		}
		tmpks.forEach(function(k) {
			removeItem(k);
		});
		for (i = numKeysPlus - 1; i >= 0; i--) {
			tk = keyPlus(i);
			Array.prototype.forEach.call(keys, function(k, index, arr) {
				if (tk.toString().indexOf(k) != -1) {
					tmpks.push(tk);
				}
			});
		}
		tmpks.forEach(function(k) {
			removeItemPlus(k);
		})
		cb && cb();
	};
	com.myStorage = myStorage;
	win.myStorage = myStorage;
}(window,common, mui));

(function(com) {
	/**
 	* @author 1020450921@qq.com
 	* @link http://www.cnblogs.com/phillyx
 	* @link http://ask.dcloud.net.cn/people/%E5%B0%8F%E4%BA%91%E8%8F%9C
	 *@description 存储当前下载路径
	 */
	var cache = {};
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
					callback(plus.io.convertLocalFileSystemURL("_www/images/default.png"));
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
		plus.io.resolveLocalFileSystemURL("_downloads/", function(entry) {
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
					myStorage.removeItemByKeys(null, function() {
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
		plus.io.resolveLocalFileSystemURL("_downloads/", function(entry) {
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