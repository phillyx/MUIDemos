/**
 	* @author 1020450921@qq.com
 	* @link http://www.cnblogs.com/phillyx
 	* @link http://ask.dcloud.net.cn/people/%E5%B0%8F%E4%BA%91%E8%8F%9C
	* @description 该版本主要是对ios safari无痕浏览模式做了兼容，源于看了这个帖子http://bluereader.org/article/426505。不过，我在开启无痕模式做测试时并不影响app，因此就没有使用这个版本,以防万一，先放上来 
	*/
(function(com, mui) {
	//解决ios隐私模式(无痕浏览)下 localStorage 不正常问题
	var check_KEY = '_localStorage_',
		check_VALUE = 'test';
	var is_support_LS = true;
	// 检测是否正常
	try {
		window.localStorage.setItem(check_KEY, check_VALUE);
	} catch (e) {
		console.log(e);
		if (e.code == 22) {
			is_support_LS = false;
			var noop = function() {};
			window.localStorage.__proto__ = {
				setItem: noop,
				getItem: noop,
				removeItem: noop,
				clear: noop
			};
		}
	}
	// 删除测试数据
	if (localStorage.getItem(check_KEY) === check_VALUE) window.localStorage.removeItem(check_KEY);

	var myStorage = {};
	//var first = null;

	function getItem(k) {
		var jsonStr = window.localStorage.getItem(k.toString());
		//console.log("getItem" +( new Date().getTime() - first));
		return jsonStr ? JSON.parse(jsonStr).data : null;
	};

	function getItemPlus(k) {
		var jsonStr = plus.storage.getItem(k.toString());
		//console.log("getItemPlus" + (new Date().getTime() - first));
		return jsonStr ? JSON.parse(jsonStr).data : null;
	};
	myStorage.getItem = function(k) {
		//first = new Date().getTime();
		return getItem(k) || getItemPlus(k);
	};

	myStorage.setItem = function(k, value) {
		//first = new Date().getTime();
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
		//console.log("setItem__"+key+"__"+(new Date().getTime() - first));
	};
	if (!is_support_LS) {
		//重写
		myStorage.getItem = function(k) {
			//first = new Date().getTime();
			return getItemPlus(k);
		};

		myStorage.setItem = function(k, value) {
			//first = new Date().getTime();
			value = JSON.stringify({
				data: value
			});
			k = k.toString();

			plus.storage.setItem(k, value);
		};
	}

	function getLength() {
		return window.localStorage.length || 0;
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
		return window.localStorage.key(index) || null;
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
		keys = keys || ["filePathCache_", "ajax_cache_", "Wedding", "wedding"];
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
	window.myStorage = myStorage;
}(common, mui));

