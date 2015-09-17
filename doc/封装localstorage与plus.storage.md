##封装localstorage与plus.storage
```javascript
(fuction(){

/*
	 * myStorage对plus.storage做了简单封装，
	 * 可以存储任意对象，无需将对象转换字符串
	 * */
	var myStorage = {};
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
	myStorage.removeItemByKeys = function(keys,cb) {
		if (typeof(keys) === "string") {
			keys = [keys];
		}
		keys = keys || ["filePathCache_", "ajax_cache_"];

		var numKeys = myStorage.getLength();
		var numKeys = myStorage.getLength();
		//TODO plus.storage是线性存储的，从后向前删除是可以的 
		//稳妥的方案是将查询到的items，存到临时数组中，再删除  
		//var tmpks = [];
		for (var i =numKeys-1 ; i >=0; i--) {
			var tk = myStorage.key(i);
			Array.prototype.forEach.call(keys, function(k, index, arr) {
				if (tk.toString().indexOf(k) != -1) {
					myStorage.removeItem(tk);
					//tmpks.push(tk);
				}
			});
		}
		//tmpks.forEach(function(k) {
		//	myStorage.removeItem(k);
		//})
        cb&&cb();
	};
    window.myStorage=myStorage;
}());    
```