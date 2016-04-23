(function($, myStorage) {
	/*
	 * myStorage对plus.storage做了简单封装，
	 * 可以存储任意对象，无需将对象转换字符串
	 * */
	myStorage.getItem = function(key) {
		var jsonStr;
		if (mui.os.plus) {
			jsonStr = plus.storage.getItem(key)
		} else {
			jsonStr = window.localStorage.getItem(key);
		}
		//		console.log(jsonStr)
		var dat = JSON.parse(jsonStr);
		if (!isNull(dat)) {
			dat = dat.data;
		}
		return jsonStr ? dat : null;
	}

	myStorage.setItem = function(key, value) {
		if (mui.os.plus) {
			return plus.storage.setItem(key, JSON.stringify({
				data: value
			}));
		} else {
			return window.localStorage.setItem(key, JSON.stringify({
				data: value
			}));
		}
	}
	myStorage.getLength = function() {
		if (mui.os.plus)
			return plus.storage.getLength();
		else
			return window.localStorage.length;
	}
	myStorage.removeItem = function(key) {
		if (mui.os.plus)
			return plus.storage.removeItem(key);
		else
			return window.localStorage.removeItem(key);
	}
	myStorage.clear = function() {
		if (mui.os.plus)
			return plus.storage.clear();
		else
			return window.localStorage.clear();
	}
	myStorage.key = function(index) {
		if (mui.os.plus)
			return plus.storage.key(index);
		else
			return window.localStorage.key(index);
	};
	/**
	 * @author liuyf 2015-05-04
	 * @description 通过索引获取存储对象
	 * @param {Object} index
	 */
	myStorage.getItemByIndex = function(index) {
		var item = {
			keyname: '',
			keyvalue: ''
		};
		item.keyname = myStorage.key(index);
		item.keyvalue = myStorage.getItem(item.keyname);
		return item;
	};
	/**
	 * @author liuyf 2015-05-04
	 * @description 获取所有存储对象
	 * @param {Object} key 可选，不传参则返回所有对象，否则返回含有该key的对象
	 */
	myStorage.getItems = function(key) {
		var items = [];

		var numKeys = myStorage.getLength();
		if (key) {
			for (var i = 0; i < numKeys; i++) {
				if (myStorage.key(i).toString().indexOf(key) != -1) {
					items.push(myStorage.getItemByIndex(i));
				}
			}
		} else {
			for (var i = 0; i < numKeys; i++) {
				items.push(myStorage.getItemByIndex(i));
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
	myStorage.removeItemByKeys = function(keys) {
		if (typeof(keys) === "string") {
			keys = [keys];
		}
		keys = keys || ["filePathCache_", "ajax_cache_"];

		var numKeys = myStorage.getLength();
		var tmpks = [];
		for (var i = 0; i < numKeys; i++) {
			var tk = myStorage.key(i);
			Array.prototype.forEach.call(keys, function(k, index, arr) {
				if (tk.toString().indexOf(k) != -1) {
					tmpks.push(tk);
				}
			});
		}
		tmpks.forEach(function(k) {
			myStorage.removeItem(k);
		})
	};

}(mui, window.myStorage = {}));


(function($, com) {
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
	 * 通过递归实现进程阻塞
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
	com.async = myasync;
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
	 *@author liuyf 2015-4-30
	 *@description 获取系统信息
	 */
	//获得系统信息 
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
	 *存储当前下载路径
	 */
	var cache = {};
	cache.getFile = function(netPath, cb) {
		var filePathCache = getLocalFileCache(netPath);
		isExist(filePathCache, function(exist) {
			if (exist) {
				console.log('EXIST_' + filePathCache)
				cb(filePathCache);
			} else {
				console.log('UNEXIST_' + filePathCache + "_" + netPath)
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
	};
	var couDwn = 0;
	//下载
	var Filedownload = function(netPath, callback) {
		var dtask = plus.downloader.createDownload(netPath, {}, function(d, status) {
			// 下载完成
			if (status == 200) {
				plus.io.resolveLocalFileSystemURL(d.filename, function(entry) {
					setLocalFileCache(netPath, entry.toLocalURL());
					callback(entry.toLocalURL()); //获取当前下载路径
				});
			} else {
				console.log('download.state:' + d.state + "____download.status" + status);
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
		//TODO 监听当前下载状态
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
	cache.clear = function(cb) {
		plus.nativeUI.showWaiting();
		plus.io.resolveLocalFileSystemURL("_downloads/", function(entry) {
			entry.removeRecursively(function() {
				plus.nativeUI.closeWaiting();
				//myStorage.removeItemByKeys();
				//plus.nativeUI.toast("缓存删除成功");
				cb&&cb();
			}, function() {
				plus.nativeUI.closeWaiting();
			});
		}, function(e) {
			plus.nativeUI.closeWaiting();
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
	};
	com.cache = cache;

}(mui, window.common = {}));

/**
 * 将网络图片下载到本地并显示，包括缓存
 */
(function(lazyimg) {

	lazyimg.lazyLoad = function(doc, cb) {

		lazyLoad(doc ? doc : document, cb);
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

var Too = (function(Too) {
	var Toothweb = 'http://192.168.1.45:3002/api/all';

	Too.getweb = function() {
		return Toothweb;
	}
	return Too;
}(Too || {}));
(function($, Too, websql) {
	var DB_VERSION_NUMBER = '1.0';
	var TIME_UPDATE = 'TIME_UPDATE';
	var TIME_PUBDATE = 'TIME_PUBDATE';
	var TIME_UPDATE_SLIDER = 'TIME_UPDATE_SLIDER';
	var TIME_INTERVAL = 1000 * 60 * 5; //更新间隔(默认十分钟)
	var TIME_INTERVAL_SLIDER = 1000 * 60 * 60; //更新间隔(默认一小时)

	var SLIDER_GUID = 'SLIDER_GUID';


	var PAGE_SIZE = 10;
	var MAX_INTEGER = Number.MAX_VALUE;

	Too.SQL_UPDATE = 'UPDATE TooDemo SET image = ? WHERE guid = ?';
	var SQL_UPDATE = Too.SQL_UPDATE;

	Too.SQL_DELETE = 'DELETE FROM TooDemo';
	var SQL_DELETE = Too.SQL_DELETE;
	
	Too.dbReady = function(successCallback, errorCallback) {
		html5sql.openDatabase("Tooth", "ToothAuthorByYHQ", 5 * 1024 * 1024);
		if (html5sql.database.version === '') {
			html5sql.changeVersion('', DB_VERSION_NUMBER, "", function() {
				successCallback && successCallback(true);
			}, function(error, failingQuery) {
				errorCallback && errorCallback(error, failingQuery);
			});
		} else {
			successCallback && successCallback(false);
		}
	};
	Too.createTable = function(SQL_TABLE, successCallback, errorCallback) {
		websql.process(SQL_TABLE, function(tx, results) {
			successCallback(results.rows.length > 0 && results.rows.item(0));
		}, function(error, failingQuery) {
			errorCallback && errorCallback(error, failingQuery);
		});
	}
	
	Too.getItems = function(SQL_SELECT,successCallback, errorCallback) {
		websql.process(SQL_SELECT, function(tx, results) {
			successCallback(results.rows);
		}, function(error, failingQuery) {
			console.log(JSON.stringify(error));
			console.log(failingQuery);
			errorCallback && errorCallback(error, failingQuery);
		});
	};
	Too.addItems = function(SQL_INSERT,items, successCallback, errorCallback) {
		var sqls = [];
		$.each(items, function(index, item) {
			sqls.push({
				"sql": SQL_INSERT,
				"data": item
			})
		});
		websql.process(sqls, function(tx, results) {
			successCallback(true);
		}, function(error, failingQuery) {
			errorCallback && errorCallback(error, failingQuery);
		});

	};
	Too.updateItems = function(dt, successCallback, errorCallback) {
		websql.process([{
			"sql": Too.SQL_UPDATE,
			"data": dt,
		}], function(tx, results) {
			successCallback && successCallback();
		}, function(error, failingQuery) {
			errorCallback && errorCallback(error, failingQuery);
		});
	};
	Too.deleteItems = function(successCallback, errorCallback) {
		websql.process(Too.SQL_DELETE, function(tx, results) {
			successCallback && successCallback();
		}, function(error, failingQuery) {
			errorCallback && errorCallback(error, failingQuery);
		});
	};
}(mui, Too, html5sql));

(function($, Too, com) {
	/**
	 * @description 下载数据
	 * @param {Object} hascode 下载代码
	 * @param {Object} cb
	 */
	function GetData(hascode, cb) {
		//如链接不可用，则使用data.json文件
		mui.ajax(/*Too.getweb()*/"http://update.yihunqing.net/data.json", {
			data: {
				hascode: hascode
			},
			dataType: 'json',
			type: 'get',
			timeout: 10000,
			success: function(data) {
				processData(data, cb);
			}, 
			error: function(xhr, type, errorThrown) {
				cb && cb(type);
				//异常处理；
				console.log(type + '__' + JSON.stringify(xhr) + '__' + errorThrown);
			}
		})
	};
	Too.getData = GetData;
	//	var data = {
	//		cat_list: [{
	//			id: 1,
	//			img: '1.jpg',
	//			name: '牙齿美容',
	//		}],
	//		item_list: [{
	//			id: 1,
	//			cid: 1,
	//			img: '1.jpg',
	//			desc: '摘要介绍',
	//			title: '冷光美白',
	//			content: [{
	//				type: 'img',
	//				img: '1.jpg'
	//			}]
	//		}]
	//	};

	function processData(data, cb) {
		Too.dbReady(function() {
			var cat_list = data.cat_list || [];
			var item_list = data.item_list || [];
			var content_list = [];
			Array.prototype.forEach.call(item_list, function(it, index, arr) {
				//TODO 临时数据content是stringfy后的数据，这边需要转换一下
				var ct = JSON.parse(it.content);
				for (var i = 0, len = ct.length; i < len; i++) {
					content_list.push([it.id, ct[i].type, ct[i].img, ct[i].video || '', com.hashCode(ct[i].img), com.hashCode(ct[i].video)]);
				}
			});
			addCatList(cat_list, function() {
				addItemList(item_list, function() {
					addContentList(content_list, function() {
						downLoadFile(cb);
					});
				});
			});
		});
	};
	/**
	 * @description 牙科种类
	 * @param {Object} cats
	 * @param {Object} cb
	 */

	function addCatList(cats, cb) {
		var items = [];
		Array.prototype.forEach.call(cats, function(item, index, arr) {
			items.push([item.id, item.img, item.name, com.hashCode(item.img).toString()]);
		});
		var SQL_TABLE = 'DROP TABLE IF EXISTS cat_list;CREATE TABLE cat_list (guid integer PRIMARY KEY AutoIncrement, id TEXT,img TEXT,name TEXT,ihash TEXT);';
		var SQL_INSERT = 'INSERT INTO cat_list(id,img,name,ihash) VALUES(?,?,?,?);';
		Too.createTable(SQL_TABLE, function() {
			Too.addItems(SQL_INSERT, items, function() {
				cb && cb();
			})
		})
	};
	/**
	 * 牙科子类别
	 * @param {Object} its
	 */
	function addItemList(its, cb) {
		var items = [];
		Array.prototype.forEach.call(its, function(item, index, arr) {
			items.push([item.id, item.c_id, item.img, item.desc || '', item.title, com.hashCode(item.img)]);
		});
		var SQL_TABLE = 'DROP TABLE IF EXISTS item_list;CREATE TABLE item_list (guid integer PRIMARY KEY AutoIncrement,id TEXT,cid integer,img TEXT,digest TEXT,title TEXT,ihash TEXT);';
		var SQL_INSERT = 'INSERT INTO item_list(id,cid,img,digest,title,ihash) VALUES(?,?,?,?,?,?);';
		Too.createTable(SQL_TABLE, function() {
			Too.addItems(SQL_INSERT, items, function() {
				cb && cb();
			});
		});
	};
	/**
	 * @description 子类别内容
	 * @param {Object} cts
	 */
	function addContentList(cts, cb) {
		var SQL_TABLE = 'DROP TABLE IF EXISTS content_list;CREATE TABLE content_list (guid integer PRIMARY KEY AutoIncrement,iid TEXT,type TEXT,img TEXT,video_src TEXT,ihash TEXT,vhash TEXT);';
		var SQL_INSERT = 'INSERT INTO content_list(iid,type,img,video_src,ihash,vhash) VALUES(?,?,?,?,?,?);';
		Too.createTable(SQL_TABLE, function() {
			Too.addItems(SQL_INSERT, cts, function() {
				cb && cb();
			})
		})
	};
	/**
	 * 获取牙科种类 用于menu页模板渲染
	 * @param {Object} cb
	 */
	function GetCatList(cb) {
		var SQL_SELECT = 'SELECT * FROM cat_list a left join fileCache b on a.ihash=b.ihash  order by guid asc';
		
		Too.getItems(SQL_SELECT, function(rows) {
			var tmprows = [];
			for (var i = 0, len = rows.length; i < len; i++) {
				//移动端无法识别row[i].property 对象，建议使用通用函数 rows.item(i) 
				tmprows.push(rows.item(i));
			}
			console.log("GetCatList_" + JSON.stringify(tmprows));
			cb && cb(tmprows);
		});
	};
	Too.getCatList = GetCatList;
	/**
	 * 获取牙科子类别
	 * @param {Object} cb
	 */
	function getItemList(cid, cb) {
		var SQL_SELECT = "SELECT * FROM item_list a left join fileCache b on a.ihash=b.ihash where cid='" + cid + "' order by guid asc";
		Too.getItems(SQL_SELECT, function(rows) {
			var tmprows = [];
			for (var i = 0, len = rows.length; i < len; i++) {
				//移动端无法识别row[i].property 对象，建议使用通用函数 rows.item(i) 
				tmprows.push(rows.item(i));
			}
			console.log("getItemList_" + JSON.stringify(tmprows));
			cb && cb(tmprows);
		});

	};
	Too.getItemList = getItemList;
	/**
	 * 获取内容
	 * @param {Object} cb
	 */

	function getContentList(iid, cb) {
		var SQL_SELECT = "SELECT a.*,b.localPath as iPath,c.localPath as vPath "+
							"FROM content_list a left join fileCache b on a.ihash=b.ihash "+ 
							"left join fileCache c on a.vhash=c.ihash "+
							"where iid='" + iid + "' order by guid asc";
		Too.getItems(SQL_SELECT, function(rows) {
			var tmprows = [];
			for (var i = 0, len = rows.length; i < len; i++) {
				tmprows.push(rows.item(i));
			}
			console.log("getContentList_" + JSON.stringify(tmprows));
			cb && cb(tmprows);
		});
	};
	Too.getContentList = getContentList;
	/**
	 * @description 保存图片路径
	 * @param {Object} its
	 * @param {Object} cb
	 */
	function setFilePath(its, cb) {
		var SQL_TABLE = 'DROP TABLE IF EXISTS fileCache;CREATE TABLE fileCache (fguid integer PRIMARY KEY AutoIncrement,ihash TEXT,localPath TEXT);';
		var SQL_INSERT = 'INSERT INTO fileCache(ihash,localPath) VALUES(?,?);';
		Too.createTable(SQL_TABLE, function() {
			Too.addItems(SQL_INSERT, its, function() {
				cb && cb();
			});
		});
	};

	Too.setFilePath = setFilePath;

	function getFilePath(ihash, cb) {
		var SQL_SELECT = "SELECT localPath FROM fileCache where ihash='" + ihash + "' order by guid asc";
		Too.getItems(SQL_SELECT, function(rows) {
			if (row.length > 0 && cb) {
				return cb(rows.item(0).localPath);
			}
			cb && cb();
		});
	};
	Too.getFilePath = getFilePath;

	function downLoadFile(cb) {
		var SQL_SELECT = "SELECT  ihash,img FROM  cat_list union SELECT  ihash,img FROM  item_list union SELECT  ihash,img FROM  content_list union SELECT vhash  as ihash,video_src as img FROM  content_list";
		Too.getItems(SQL_SELECT, function(rows) {
			var tmprows = [];
			for (var i = 0, len = rows.length; i < len; i++) {
				if (rows.item(i).img && rows.item(i).img.indexOf("http") != -1) {
					tmprows.push(rows.item(i));
				}
			}
			var ws = plus.nativeUI.showWaiting('准备下载...');
			var count = 0;
			var its = [];
			async.each(tmprows, function(tmp, cb1) {
				Filedownload(tmp.ihash, tmp.img, function(localpath) {
					ws.setTitle('共' + tmprows.length + '个图片和视频文件,已下载' + (++count) + '个文件');
					its.push([tmp.ihash, localpath]);
					cb1(null);
				});

			}, function() {
				setFilePath(its, function() {
					ws.setTitle('全部下载成功');
					setTimeout(function() {
						ws.close()
						cb && cb();
					}, 1000);
				});
			});
		});
	};
	Too.downLoadFile = downLoadFile;
	
	var couDwn=0;
	function Filedownload(ihash, netPath, callback) {
		console.log("679:"+netPath);
		var dtask = plus.downloader.createDownload(netPath, {}, function(d, status) {
			// 下载完成
			if (status == 200) {
				plus.io.resolveLocalFileSystemURL(d.filename, function(entry) {
					callback(entry.toLocalURL()); //获取当前下载路径
				});
			} else {
				console.log('download.state:' + d.state + "____download.status:" + status);
				//下载失败 只递归一次，再次失败返回默认图片
				if (++couDwn <= 1) {
					console.log(couDwn);
					arguments.callee(ihash, netPath, callback);
				} else {
					//重置
					couDwn = 0;
					//返回默认图片
					callback(plus.io.convertLocalFileSystemURL("_www/images/default.png"));
				}
			}
		});
		//TODO 监听当前下载状态
		//		dtask.addEventListener( "statechanged", function(d, status){
		//			console.log(d.state);
		//		}, false );
		dtask.start();
	};
}(mui, Too, common));