var mine;
mui.plusReady(function() {
	mine = plus.webview.currentWebview();
});
var waiting = {
	content: '<div class="waiting mui-loading" style="text-align: center;margin-top: 160px;"><span class="mui-spinner"></span>加载中...</div>',
	show: function() {
		document.body.innerHTML += this.content;
	},
	close: function() {
		document.body.removeChild(document.querySelector(".waiting.mui-loading"));
	}
};
mui.ready(function() {
	var txt_search = document.querySelector("form input");
	var search_body = document.querySelector(".search-body");
	var search_ctn = document.querySelector("#search-input");
	var more_html = '<span class="mui-spinner"></span>';
	document.querySelector("form").addEventListener('submit', function(e) {
		console.log("submit");
		e.preventDefault();
		if (txt_search.value != tmpValue || (+new Date()) - firstime > 4000)
			func_search(0);
		txt_search.blur();
		return false;
	});
	document.querySelector("#cancel").addEventListener('tap', function() {
		console.log("cancel");
		txt_search.blur();
		//mine.hide('fade-out');
		setTimeout(function() {
			txt_search.value = null;
			search_body.innerHTML = null;
		}, 200);
	});
	var firstime;
	var tmpValue;
	txt_search.addEventListener('keyup', function() {
		console.log("keyup");
		func_search(1);
		tmpValue = txt_search.value;
		search_ctn.classList.add('active');
	});
	txt_search.addEventListener('focus', function() {
		console.log("focus");
		firstime = +new Date();
		search_ctn.classList.add('active');
	});
	txt_search.addEventListener('blur', function() {
		console.log("blur");
		firstime = null;
		search_ctn.classList.remove('active');
	});

	function func_search(key) {
		console.log("firstime: " + firstime);
		if (firstime && (+new Date()) - firstime < 1000) return;
		firstime = +new Date();
		var name = txt_search.value;
		if (name.length == 0) return;
		search_body.innerHTML = null;
		var tmpdate = +new Date();
		console.log("now", +new Date());
		//ajax取数据渲染页面
		getData();
	}

	mui(search_body).on('tap', 'p.more', function() {
		txt_search.blur();
		var name = this.getAttribute('data-name');
		var tag_id = this.getAttribute('data-tagid');
		var pn = this.getAttribute('data-pn');
		var _this = this;
		this.innerHTML = more_html;
		//ajax取数据渲染页面
		getData();
	});

	mui(document).on('tap', '.mui-table-view-cell', function() {
		//打开新页面
	});

	document.querySelector("header .mui-title").addEventListener('tap', function() {
		//mui.scrollTo(0,100);
		window.scrollTo(0, 0);
	});

	function getData() {
		waiting.show();
		setTimeout(function() {
			waiting.close();
			
		}, 1000);
	}
});