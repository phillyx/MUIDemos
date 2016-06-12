mui.init();
//阻尼系数
var deceleration = mui.os.ios ? 0.003 : 0.0009;
var mine, slider, scrolls;
var professionData = [{
	text: '推荐',
	value: "0"
}, {
	text: '南京',
	value: "1"
}, {
	text: '科技',
	value: "2"
}, {
	text: '娱乐',
	value: "3"
}, {
	text: '其他',
	value: "4"
}, {
	text: '社会',
	value: "5"
}, ];
mui.plusReady(function() {
	mine = plus.webview.currentWebview();
});
//页面DOM生成
var scroll_slider = {
	init: function() {
		//非动态tab，以下两行代码可删掉
		this._getScrolls();
		this._getSliderGroup();
		//
		document.querySelector("#slider").style.display = 'block';
		slider = mui('.mui-slider').slider();
		scrolls = mui('.mui-scroll-wrapper').scroll({
			bounce: false,
			indicators: true, //是否显示滚动条
			deceleration: deceleration
		});
		//首次切换不通过顶部滑块子项而是滑动切换，报bug: scrolls[0].pages=[]
		//解决：重新刷新该对象
		scrolls[0].refresh();
		this._bindEvent();
	},
	_getScrolls: function() {
		var html = template('tmpl_scroll', {
			items: professionData
		});
		document.querySelector("#slider .mui-scroll").innerHTML = html;
	},
	_getSliderGroup: function() {
		var html = template('tmpl_slider', {
			items: professionData
		});
		document.querySelector("#slider .mui-slider-group").innerHTML = html;
	},
	_bindEvent: function() {
		//绑定滑屏相关事件
		var gallery = mui('.mui-slider')[0];
		var _this = this;
		/***如果不需要左右滑动和拖动，可将以下代码注释掉****/
		gallery.addEventListener('dragend', function(e) {
			//console.log("drag", +new Date());
			var detail = e.detail;
			var direction = detail.direction;
			//console.log("direction: " + direction);
			//console.log("detail.distance: " + detail.distance);
			//console.log("document.body.clientWidth: " + document.body.clientWidth);
			if (detail.distance < document.body.clientWidth / 2) return;
			if(iswipe){iswipe=false;return;}
			var sno = slider.slideNumber;
			console.log("sno", sno);
			if (direction == "left" && sno < slider.itemLength - 1) {
				_this.setList(sno + 1);
			} else if (direction == "right" && sno > 0) {
				_this.setList(sno - 1);
			}
		});
		var iswipe = false;
		//滑动时拖动手势事件也触发，官方未规避，所以这里要考虑加载两次数据的可能
		//而拖动时是不触发滑动事件的
		gallery.addEventListener('swipeleft', function(e) {
			//console.log("swipeleft", +new Date());
			var sno = slider.slideNumber;
			if (sno < slider.itemLength - 1) {
				_this.setList(sno + 1);
			}
			iswipe = true;
		});
		gallery.addEventListener('swiperight', function(e) {
			//console.log("swiperight", +new Date());
			var sno = slider.slideNumber;
			if (sno > 0) {
				_this.setList(sno - 1);
			}
			iswipe = true;
		});
		/********************************************/
		//scroll_item 单击加载数据
		mui.each(scrolls[0].scroller.querySelectorAll(".mui-control-item"), function(index, item) {
			item.addEventListener('tap', function() {
				_this.setList(index);
			});
		});
	},
	setList: function(index) {
		//加载初始数据
		var ctn = slider.element.querySelectorAll('.mui-slider-item')[index];
		var pullTo = ctn.querySelector('.mui-scroll-wrapper .mui-scroll');
		var list = pullTo.querySelector('.mui-table-view');
		if (list.children.length > 0) return;
		mui(pullTo).pullToRefresh().pullDownLoading();
	},
	/**
	 * @description 获取当前活动的scroll 
	 *mui-slider-item mui-control-content mui-active
	 * mui-scroll-wrapper
	 *  mui-scroll
	 *   mui-table-view 
	 */
	getActiveScroll: function() {
		for (var i = 0, len = scrolls.length; i < scrolls.length; i++) {
			var sc = scrolls[i];
			if (sc.element.classList.contains('mui-segmented-control')) continue;
			if (sc.element.parentNode.classList.contains('mui-active'))
				return sc;
		}
	},
	/**
	 * @description 获取当前活动的pullToRefresh对象index
	 */
	getActivePullIndex: function() {
		var slideritems = document.querySelectorAll(".mui-slider-group .mui-slider-item");
		for (var i = 0, len = slideritems.length; i < len; i++) {
			if (slideritems[i].classList.contains('mui-active')) {
				return i;
			}
		}
	},
	/**
	 * @description 获取当前活动的pullToRefresh对象 
	 */
	getActivePull: function() {
		var slideritems = document.querySelectorAll(".mui-slider-group .mui-slider-item");
		for (var i = 0, len = slideritems.length; i < len; i++) {
			if (slideritems[i].classList.contains('mui-active')) {
				console.log(slideritems[i].querySelector('.mui-scroll'));
				return mui(slideritems[i].querySelector('.mui-scroll')).pullToRefresh();
			}
		}
	}
};

var pull = {
	colors: ['FF0000', 'FF665E', 'FF5053', 'F14E41', 'dc00b8'],
	/**
	 * @description 可自定义下拉颜色
	 * @param {Object} colors
	 */
	init: function(colors) {
		this.colors = colors || this.colors;
		this._set();
	},
	_set: function() {
		//循环初始化所有下拉刷新，上拉加载。
		mui.each(document.querySelectorAll('.mui-slider-group .mui-scroll'), function(index, pullRefreshEl) {
			var u = mui(pullRefreshEl).pullToRefresh({
				down: {
					callback: down_list,
					tips: {
						colors: pull.colors,
					}
				},
				up: {
					callback: up_list,
				}
			});
			u.pn = 0; //页码初始化
			if (index == 0) {
				//默认加载第一列的数据
				u.pullDownLoading();
			}
		});
	}
}

function down_list() {
	var self = this;
	//加载首页数据
	self.pn = 1;
	self.element.querySelector('.mui-pull-bottom-tips').style.display = 'none';
	setTimeout(function() {
		var ul = self.element.querySelector('.mui-table-view');
		ul.insertBefore(createFragment(ul, 0, 10, true), ul.firstChild);
		self.endPullDownToRefresh();
		self.refresh(true);
		self.element.querySelector('.mui-pull-bottom-tips').style.display = 'block';
	}, 1000);
};

function up_list() {
	var self = this;
	self.pn++;
	setTimeout(function(err) {
		var ul = self.element.querySelector('.mui-table-view');
		ul.appendChild(createFragment(ul, 0, 5));
		self.endPullUpToRefresh(ul.children.length > 20 ? true : false);
		if (err) {
			//出错，数据回溯
			self.pn--;
		}
	}, 1000);
}
var createFragment = function(ul, index, count, reverse) {
	var length = ul.querySelectorAll('li').length;
	var fragment = document.createDocumentFragment();
	var li;
	for (var i = 0; i < count; i++) {
		li = document.createElement('li');
		li.className = 'mui-table-view-cell';
		li.innerHTML = '第' + (index + 1) + '个选项卡子项-' + (length + (reverse ? (count - i) : (i + 1)));
		fragment.appendChild(li);
	}
	return fragment;
};
mui.ready(function() {
	scroll_slider.init();
	pull.init();
	document.querySelector("header .mui-title").addEventListener('tap', function() {
		var sc = scroll_slider.getActiveScroll();
		sc.scrollTo(0, 0, 300);
	});
});