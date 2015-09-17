##html5仿ios下拉和上拉回弹功能
		在网上搜索了“html5 下拉回弹” 或 “html5  仿ios下拉回弹”，几乎没有找到可用的代码，大都是在对-webkit-overflow-scrolling进行讨论的，没什么意思。
```CSS
-webkit-overflow-scrolling : touch; 
```
        在查看了iscroll.js的下拉回弹及mui的回弹功能后，码出了以下的代码，基本上能够做到模仿ios回弹的效果。

```javascript
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
			var abs = Math.abs(y - startY)
			if (abs > 50 && abs < 180) {
				//低版本安卓机拉伸有抖动现象，通过减少动画次数来规避
				if ( /*mui.os.android &&*/ ++cou % 10 == 0) {
					container.style.cssText = "transition:1s cubic-bezier(.1, .57, .1, 1); -webkit-transition:1s cubic-bezier(.1, .57, .1, 1); -webkit-transform: translate(0px, " + (y - startY) + "px) translateZ(0px);";
				}
			}
		});
		container.addEventListener('touchend', touchend);
		container.addEventListener('touchcancel', touchend);

		function touchend(e) {
			e.preventDefault();
			container.style.cssText = "transition:300ms cubic-bezier(.1, .57, .1, 1); -webkit-transition: 300ms cubic-bezier(.1, .57, .1, 1);  -webkit-transform: translate(0px,0px) translateZ(0px);";
		}

		function support_touch_event() {
			return !!(('ontouchstart' in window) || window.DocumentTouch && document instanceof DocumentTouch);
		}
	}
	return ht;
}())
```
		mui提供了以下代码实现回弹效果，不过当dom内部元素高度小于屏幕高度时是没有回弹效果的。且有滚动条出没。
```html
<div class="mui-page-content">
				<!--回弹-->
				<div class="mui-scroll-wrapper">
					<div class="mui-content mui-scroll">
					</div>
					<div class="mui-scrollbar mui-scrollbar-vertical">
						<div class="mui-scrollbar-indicator"></div>
					</div>
				</div>
			</div>
```
###使用示例
		如果mui-content内部ul高度大于body高度,就不要使用回弹代码了，因为下拉列表本身overflow-y:auto已经有该效果了。
```javascript
function bindScroll() {
				var lefts = document.querySelectorAll(".left-title .mui-content .tooitems");
				Array.prototype.forEach.call(lefts, function(lf) {
					var ulheight = lf.querySelectorAll('ul li').length * 60;
					console.log(ulheight);
					if (ulheight <= 420) {
						huitan.init(lf);
					}
				});
			}
```