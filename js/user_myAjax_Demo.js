/**
 * @author 1020450921@qq.com
 * @link http://www.cnblogs.com/phillyx
 * @link http://ask.dcloud.net.cn/people/%E5%B0%8F%E4%BA%91%E8%8F%9C
 * @description 对于实时性要求比较高的且需要本地缓存的可以参考以下的数据获取方式
 */
(function(window, com) {
	/**
	 * @description 添加或修改
	 */
	function save(user, cb) {
		console.log('save————' + JSON.stringify(user));
		com.ajax({
			url: "user/update",
			type: "post",
			data: {
				user: user
			},
			success: function(result) {
				console.log('__save__data___' + JSON.stringify(result));
				//数据保存后刷新缓存
				refresh(cb);
			}
		})
	};
	/**
	 * @description 获取数据 逻辑：如果缓存中已存在数据，取返回并更新数据，无远程取并保存数据且返回
	 * @param {Object} cb
	 * @param {Object} isRecursion
	 */
	function getInfo(cb, isRecursion) {
		var user = myStorage.getItem(getKey());
		if (user) {
			cb && cb(user);
			return refresh();

		}
		if (!isRecursion) {
			refresh(function() {
				getInfo(cb, true)
			})
		} else {
			return cb && cb(hlrinfo);
		}
	};

	function refresh(cb) {
		com.ajax({
			url: "user/show",
			type: "get",
			refreshCache: true,
			success: function(result) {
				if (result.success) {
					myStorage.setItem(getKey(), result.data); //一定要确保格式
				}
				cb && cb();
			},
			error: function() {
				cb && cb();
			}
		});
	}

	function getKey() {
		var key = 'userinfo_' + com.hashCode(myStorage.getItem('token'));
		return key;
	}
	window.userInfo = {
		refresh: refresh,
		getInfo: getInfo,
		save: save,
	};

})(window, common);