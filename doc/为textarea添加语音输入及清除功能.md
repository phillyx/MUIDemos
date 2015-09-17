##为textarea添加语音输入和清除的功能
**mui**支持input输入框语音输入和清除的功能，只需要添加相关css类即可.
代码如下
```
                    <div class="mui-input-row">
						<label>Input</label>
						<input type="text" class="mui-input-clear" placeholder="带清除按钮的输入框">
					</div>

					<div class="mui-input-row">
						<label>Input</label>
						<input type="text" class="mui-input-speech mui-input-clear" placeholder="语音输入">
					</div>
```
如果我们想要给**textarea**也添加相同的功能应该怎么做呢？
**mui.js**肯定对**input**封装了相关的事件，果然
[input.plugin.js](https://github.com/dcloudio/mui/blob/master/js/input.plugin.js)
我们看最后
```
$.ready(function() {
		$($.classSelector('.input-row input')).input();
	});
```
对**input**添加原生方法，**textarea**是不是也可以这样做呢？试一试
```
<div class="mui-input-row" style="margin: 10px 5px;">
					<textarea id="textarea" rows="5" placeholder="多行文本框" class="mui-input-speech mui-input-clear"></textarea>
				</div>
```
```
 mui.ready(function() {
				mui('.mui-input-row textarea').input();
			});
```
测试一下，完全可以。
不过有一个小问题，语音输入封装的是科大讯飞的识别软件，在转换为文字的时候*，,.。*不区分全角半角重复加载，所以要添加相关事件进行替换
```
        //语音识别完成事件
		document.getElementById("search").addEventListener('recognized', function(e) {
			console.log(e.detail.value);
			this.value=e.detail.value.replace(/，/g,'').replace(/,。/g,'。');
			console.log(this.value);
		});
```