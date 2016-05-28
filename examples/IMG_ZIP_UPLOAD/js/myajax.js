(function(com,$) {
	/**
	 * @author 1020450921@qq.com
	 * @link http://www.cnblogs.com/phillyx
	 * @link http://ask.dcloud.net.cn/people/%E5%B0%8F%E4%BA%91%E8%8F%9C
	 * @description 封装mui.ajax
	 * @example
	 *         1. 直接从缓存中取数据 com.ajax({url:'',refreshCache:false,type:'get',data:{},success;functoin(result){}});
	 * 		   2. 从缓存中取数据，并刷新缓存 com.ajax({url:'',refreshCache:true,type:'get',data:{},success;functoin(result){}});
	 * 		   3. 直接从服务器取最新数据 com.ajax(url:'',data:{},success;functoin(result){}});
	 */
	var locationURI = '远程连接或域名/';
	var ajax = function(options1) {
		var options = {
			refreshCache: false, //强制刷新缓存，根据业务需要，选择是否强制刷新
			url: "", //请求地址
			data: {

			}, //提交参数
			type: "post", //type与mui AJAX一样
			dataType: 'json', //服务器返回json格式数据
			timeout: 10 * 1000, //timeout与mui AJAX一样
			success: function(data) {},
			error: function(xhr, type, errorThrown) {}
		}

		options = com.extendObj(options, options1);
		options.data.token = myStorage.getItem('token'); //token

		options.url = options.url.indexOf('http://') == 0 ? options.url : (locationURI + options.url);
		var cacheDate = false;
		var cacheKey = options.url + '_' + objectToKey(options.data) + "_" + myStorage.getItem('token');
		cacheKey = 'ajax_cache_' + com.hashCode(cacheKey);
		var isNeedCache = !options.refreshCache && options.type.toLowerCase() != "post";

		var isNetOf = false;
		var networkinfo = $.os.plus ? plus.networkinfo.getCurrentType() : 2;

		if (!isNeedCache && isNetOf) {
			options.error.call(this, '', '', '');
			return;
		}

		if (isNeedCache) {
			cacheDate = myStorage.getItem(cacheKey);
		}

		if (!cacheDate && !isNetOf) {
			getData(function(err, data) {
				if (!err && data && options.type == 'get') {
					myStorage.setItem(cacheKey, data);
				}
			}, options);
		} else {
			options.success.call(this, cacheDate);
			if (options.type == 'get') {
				options.success = function() {};
				options.error = function() {};
				options.refreshCache = true;
				getData(function(err, data) {
					if (!err && data && options.type == 'get') {
						myStorage.setItem(cacheKey, data);
					}
				}, options);
			}
		}
	};

	function getData(cb, options) {
		$.ajax(options.url, {
			data: options.data,
			dataType: options.dataType, //服务器返回json格式数据
			type: options.type, //HTTP请求类型
			timeout: options.timeout, //超时时间设置；
			success: function(result) {
				options.success.call(this, result);
				cb && cb(result.success, result);
			},
			error: function(xhr, type, errorThrown) {
				console.error('type' + type)
				options.error.call(this, xhr, type, errorThrown);
				if ($.os.plus) {
					plus.nativeUI.closeWaiting();
					if (type && type == 'timeout') {
						plus.nativeUI.toast('网络超时', {
							verticalAlign: 'center'
						});
					} else if (type) {
						var networkinfo = $.os.plus ? plus.networkinfo.getCurrentType() : 2;
						if (networkinfo == 0 || networkinfo == 1) {
							plus.nativeUI.toast(common.GetDeviceInfo().NetworkInfo, {
								verticalAlign: 'center'
							});
						} else {
							plus.nativeUI.toast('未知的网络请求错误', {
								verticalAlign: 'center'
							});
						}
					} else {
						plus.nativeUI.toast('未知的网络请求错误', {
							verticalAlign: 'center'
						});
					}
				}
				cb && cb(errorThrown);
				console.error(options.type + '___' + errorThrown + '__' + options.url);
			}
		});
	}

	function objectToKey(_object) {
		var arr = [];
		for (var key in _object) {
			arr.push(key)
			arr.push(_object[key]);
		}
		arr.sort();
		return arr.join('_');
	}

	var post = function(url, _data, callback) {
		ajax({
			url: url,
			data: _data,
			success: callback,
			type: 'post'
		});

	}

	var get = function(url, _data, callback) {
		ajax({
			url: url,
			data: _data,
			success: callback,
			type: 'post'
		});
	}
	com.ajax = ajax;
	com.post = post;
	com.get = get;
})(common, mui);