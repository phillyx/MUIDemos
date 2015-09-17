##html5视频播放自动全屏，暂停退出全屏等功能
在参考了[html5 video fullScreen全屏实现方式](http://my.oschina.net/ososchina/blog/349660)及司徒正美的书《[javascript框架设计](https://s.taobao.com/search?q=javascript%E6%A1%86%E6%9E%B6%E8%AE%BE%E8%AE%A1&commend=all&ssid=s5-e&search_type=item&sourceId=tb.index&spm=a21bo.7724922.8452-taobao-item.2&initiative_id=tbindexz_20150810)》287页相关代码后，在Safari上实现了视频播放自动全屏、暂停退出全屏等功能。代码是否兼容其他浏览器，未测。
```javascript
var videoF = (function() {
				var tmpV = {};
				var video_playing;
				/**
				 * @description 切换内容列时暂停当前播放的视频
				 */
				function pausedVBeforeChangeLi() {
					if (video_playing && !video_playing.ended && !video_playing.paused) {
						video_playing.pause();
					}
				};
				tmpV.pausedVBeforeChangeLi=	pausedVBeforeChangeLi;
				/**
				 * @description 播放全屏 很诡异，这个方法居然不可用
				 * @param {Object} element
				 */
				function launchFullScreen(element) {
					if (element.requestFullScreen) {
						element.requestFullScreen();
					} else if (element.mozRequestFullScreen) {
						element.mozRequestFullScreen();
					} else if (element.webkitRequestFullScreen) {
						element.webkitRequestFullScreen();
					}
				};
				/**
				 * @description 取消全屏 这个方法也是不可用
				 * @param {Object} elem
				 */
				function cancelFullScrren(elem) {
					elem = elem || document;
					if (elem.cancelFullScrren) {
						elem.cancelFullScrren();
					} else if (elem.mozCancelFullScreen) {
						elem.mozCancelFullScreen();
					} else if (elem.webkitCancelFullScreen) {
						console.log("webkitCancelFullScreen");
						elem.webkitCancelFullScreen();
					}
				};
				/**
				 * @return 返回支持的全屏函数 从网上找到了这段代码，具体网址忘记了，返回支持的全屏方法，在Safari上可用
				 * @param {Object} elem
				 */
				function fullscreen(elem) {
					var prefix = 'webkit';
					if (elem[prefix + 'EnterFullScreen']) {
						return prefix + 'EnterFullScreen';
					} else if (elem[prefix + 'RequestFullScreen']) {
						return prefix + 'RequestFullScreen';
					};
					return false;
				};
				/**
				 * @description video相关事件的绑定
				 * @param {Object} v
				 */
				function videoEvent(v) {
					var video = v,
						doc = document;
					video.addEventListener('play', function() {
						//每次只能播放一个视频对象
						if (video_playing && video_playing !== this) {
							console.log('multi')
							pausedVBeforeChangeLi();
						}
						video_playing = this;
						console.log('play');
						var fullscreenvideo = fullscreen(video);
						video[fullscreenvideo]();
					});
					video.addEventListener('click', function() {
                    	//点击时如果在播放，自动全屏；否则全屏并播放
						console.log('click')
						if (this.paused) {
							console.log('paused');
							this.play();
						} else {
							var fullscreenvideo = fullscreen(video);
							video[fullscreenvideo]();
						}
					})
					video.addEventListener('pause', function(e) {
						this.webkitExitFullScreen();
					});
					video.addEventListener("webkitfullscreenchange", function(e) {
                    	//TODO 未侦听到该事件
						console.log(3);
						if (!doc.webkitIsFullScreen) { //退出全屏暂停视频
							video.pause();
						};
					}, false);
					video.addEventListener("fullscreenchange ", function(e) {
						console.log(31);
						if (!doc.webkitIsFullScreen) { //退出全屏暂停视频
							video.pause();
						};
					}, false);
					video.addEventListener('ended', function() {
                    	//播放完毕，退出全屏
						console.log(4)
						this.webkitExitFullScreen();
					}, false);
				};
				tmpV.videoEvent = videoEvent;
				return tmpV;
			}());
```

另外如果对video的添加poster属性的话，如果需要对样式进行调整，如poster的宽度要和设定的宽度相等，建议如下做
```CSS
video {
	width: 490px;//固定宽度
	display: block;
	margin: 0 auto;
	object-fit: cover;
	}
```
object-fit这个属性太神奇了，有了这个属性就不需要再对DOM元素添加一个浮层等额外的代码开销了，省时又省力。
具体的object-fit介绍看[这个链接](http://www.w3cplus.com/css3/css3-object-fit-and-object-position-properties.html)