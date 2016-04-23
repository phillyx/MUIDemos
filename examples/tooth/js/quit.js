(function($) {
	$.plusReady(function() {
		//首页返回键处理
		//处理逻辑：1秒内，连续两次按返回键，则退出应用；
		var backButtonPress = 0;
		$.back = function(event) {
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

	});
}(mui))