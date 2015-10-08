##html5实现ios长按图标后进入图标排序及删除功能的效果##
	我们知道在ios（国产定制安卓系统基本都有）设备上按下图标，图标就会不停的抖动，并且可以随心拖动排序和删除。
    那么问题来了，我们怎么通过html5来实现呢？
1.首先要保证移动端支持`tap`,`longtap`,`touch`,`drag`等事件，因此引入了mui.js,当然根据项目需求，可以选择zepto.js等前端框架；
2.图标不停抖动的效果需要用到`CSS3`的`animation`,`transfrom`
```css
/*循环线性抖动，一个周期0.5s*/
.shake {
				-webkit-transform-origin: center center;
				-webkit-animation-name: shake-rotate;
				-webkit-animation-duration: 0.5s;
				-webkit-animation-timing-function: linear;
				-webkit-animation-iteration-count: infinite;
			}
/*最大旋转2.5度，2.5deg正好，基本能达到ios图标抖动的效果*/
@-webkit-keyframes shake-rotate {
				0% {
					-webkit-transform: rotate(0deg);
				}
				12.5% {
					-webkit-transform: rotate(1.25deg);
				}
				25% {
					-webkit-transform: rotate(2.5deg);
				}
				37.5% {
					-webkit-transform: rotate(1.25deg);
				}
				50% {
					-webkit-transform: rotate(0deg);
				}
				62.5% {
					-webkit-transform: rotate(-1.25deg);
				}
				75% {
					-webkit-transform: rotate(-2.5deg);
				}
				87.5% {
					-webkit-transform: rotate(-1.25deg);
				}
				100% {
					-webkit-transform: rotate(0deg);
				}
			}
```
3.最关键的一点，排序和删除的功能，使用sortable.js来实现，不过最新的版本还是有些小瑕疵，因此我在源码的基础上做了一些修改
  具体的瑕疵或bug如下：
  
  - 在移动端如果滑动排序的速度很快，有闪烁效果
  - 排序时没有延时,targetEl在dragEl刚drop时就开始移动了
  - targetEl和dragEl间的兄弟结点移动时没有动画，移动时很粗糙
  - dragEl在浮起拖动时，没有缩放效果

```javascript
//新增了两个自定义属性，来改善排序效果
var sort = new Sortable(document.getElementById(""), {
				chosenClass: 'sort-chosen',
				ghostClass: 'sort-ghost',
				delay: 150,
				animation: 400,
				handle: '.drag-handle',
				//-------- 自定义属性
				isDropAnimation: false, //DragDrop时是否对DragEl启用滑动效果
				ghostScale:1.2,//DragGhostEl 缩放效果
				//--------
				onStart: function( /**Event*/ evt) { // 拖拽
				},
				onEnd: function( /**Event*/ evt) { // 拖拽
					var itemEl = evt.item;
					var timespan = evt.timeStamp - touchtime;
					if (timespan < 200) {} else if (itemEl.offsetLeft == item_offset.left && itemEl.offsetTop == item_offset.top) {} else {
						//reset_order();
					}
					touchtime = null;
				},
			});
```


- - -
具体代码在这[PHILLYX/SORTABLE/SORT3.HTML](https://github.com/phillyx/MUIDemos/blob/master/examples/PHILLYXDEMOS/sortable/sort3.html)