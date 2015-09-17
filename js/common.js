/**
 * @author 1020450921@qq.com
 * @link http://www.cnblogs.com/phillyx
 * @link http://ask.dcloud.net.cn/people/%E5%B0%8F%E4%BA%91%E8%8F%9C
 * @link
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
		com.myasync = myasync;
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
		return com;
	}(mui));
