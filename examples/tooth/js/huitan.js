var huitan = (function() {
	var ht = {};
	ht.init = function(d) {
		if (!support_touch_event()) return;
		var startX, startY, endX, endY, cou,
			container = d || document.querySelector(".mui-content");
		container.addEventListener('touchstart', function(e) {
			e.preventDefault(); //阻止触摸时浏览器的缩放、滚动条滚动等
			var touch = e.touches[0]; //获取第一个触点
			var x = touch.pageX; //页面触点X坐标
			var y = touch.pageY; //页面触点Y坐标
			//记录触点初始位置
			startX = x;
			startY = y;
			cou = 0;
		});
		container.addEventListener('touchmove', function(e) {
			e.preventDefault(); //阻止触摸时浏览器的缩放、滚动条滚动等
			var touch = e.touches[0]; //获取第一个触点
			var x = touch.pageX; //页面触点X坐标
			var y = touch.pageY; //页面触点Y坐标
			endX = x;
			endY = y;
			var abs = Math.abs(y - startY);
			if (abs > 50 && abs < 180) {

				container.style.transition = "all 1s cubic-bezier(.1, .57, .1, 1)";
				container.style.webkitTransition = "all 1s cubic-bezier(.1, .57, .1, 1)";
				container.style.transform = "translate(0px, " + (y - startY) + "px) translateZ(0px)";
				container.style.webkitTransform = "translate(0px, " + (y - startY) + "px) translateZ(0px)";
				//container.style.cssText = "transition:1s cubic-bezier(.1, .57, .1, 1); -webkit-transition:1s cubic-bezier(.1, .57, .1, 1); -webkit-transform: translate(0px, " + (y - startY) + "px) translateZ(0px);";
			}
		});
		container.addEventListener('touchend', touchend);
		container.addEventListener('touchcancel', touchend);

		function touchend(e) {
			e.preventDefault();
			container.style.transition = "all 300ms cubic-bezier(.1, .57, .1, 1)";
			container.style.webkitTransition = "all 300ms cubic-bezier(.1, .57, .1, 1)";
			container.style.transform = "translate(0px,0px) translateZ(0px)";
			container.style.webkitTransform = "translate(0px,0px) translateZ(0px)";
			//container.style.cssText = "transition:300ms cubic-bezier(.1, .57, .1, 1); -webkit-transition: 300ms cubic-bezier(.1, .57, .1, 1);  -webkit-transform: translate(0px,0px) translateZ(0px);";
		}

		function support_touch_event() {
			return !!(('ontouchstart' in window) || window.DocumentTouch && document instanceof DocumentTouch);
		}
	}
	return ht;
}())