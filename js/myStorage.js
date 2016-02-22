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
