(function($, Too, com) {
	/**
	 * @description 下载数据
	 * @param {Object} hascode 下载代码
	 * @param {Object} cb
	 */
	function GetData(hascode, cb) {
		mui.ajax(Too.getweb(), {
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
					content_list.push([it.id, ct[i].type, ct[i].img, ct[i].video_src || '', com.hashCode(ct[i].img), com.hashCode(ct[i].video_src)]);
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
		var SQL_SELECT = "SELECT * FROM content_list a left join fileCache b on a.ihash=b.ihash or a.vhash=b.ihash where iid='" + iid + "' order by guid asc";
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
		try {

			var SQL_SELECT = "SELECT  ihash,img FROM  cat_list union SELECT  ihash,img FROM  item_list union SELECT  ihash,img FROM  content_list union SELECT vhash  as ihash,video_src as img FROM  content_list";
			Too.getItems(SQL_SELECT, function(rows) {
				var tmprows = [];
				for (var i = 0, len = rows.length; i < len; i++) {
					if (rows.item(i).img && rows.item(i).img.indexOf("http") != -1) {
						tmprows.push(rows.item(i));
					}
				}
				var ws = plus.nativeUI.showWaiting('共有' + tmprows.length + '个图片和视频文件,准备下载');
				var count = 0;
				var its = [];
				async.each(tmprows, function(tmp, cb1) {
					Filedownload(tmp.ihash, tmp.img, function(localpath) {
						ws.setTitle('已下载' + (++count) + '个文件');
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

		} catch (e) {
			//TODO handle the exception
			console.log(e.code+"___"+e.message);
		}
	};
	Too.downLoadFile = downLoadFile;
	
	var couDwn=0;
	function Filedownload(ihash, netPath, callback) {
		var dtask = plus.downloader.createDownload(netPath, {}, function(d, status) {
			// 下载完成
			if (status == 200) {
				plus.io.resolveLocalFileSystemURL(d.filename, function(entry) {
					callback(entry.toLocalURL()); //获取当前下载路径
				});
			} else {
				console.log('download.state:' + d.state + "____download.status" + status);
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
}(mui, Too, common))