##基于plus.downloader的图片懒加载功能，支持本地缓存
####简单说一下
	在app中，对一些变动不频繁的图片数据（如个人头像等），是需要存储在本地的。我相信这对大多数的app都是强需求的。
####怎么使用呢
`img`标签默认都有`data-src`属性，用来存放网络链接，`src`属性初始是最好给一个默认本地图片链接，下载好会自动替换掉
```HTML
<img data-src="远程链接" src="默认图片">
```
1. 如果在列表中，通过下拉刷新、上拉刷新加载数据，加载下一页的时候可以如下做：
一次新增多条数据时，为避免重复渲染页面及重新下载正在下载中的图片等问题，新增的`img`要设置`data-pageno`属性,如下使用`arttemplate`写的模板
```html
<script id="tmpl" type="text/html">
	{{each items as item i}}
			<li class="mui-table-view-cell" data-id='{{item.id}}'>
              <img data-src="{{item.url}}" data-pageno="{{item.pageno}}" src="img/default.png">
			</li>
	{{/each}}
</script>
```
在js中怎么用呢
```js
var html = template('tmpl', data);
document.querySelector("#pullrefresh").innerHTML += html;
lazyImg.pageno=data.pageno;
lazyImg.lazyLoad();
```

2. 如果不需要分页或者零散的数据，直接添加`lazy`类就可以了
```html
<img data-src="远程链接" src="默认图片" class="lazy">
```
然后直接调用`lazyImg.lazyLoad()`就可以了

###注意
`lazyimg.js`是结合`cache.js`一齐使用的，代码都已提交至`github`
地址在[https://github.com/phillyx/MUIDemos/tree/master/js/lazyimg.js](https://github.com/phillyx/MUIDemos/tree/master/js/lazyimg.js)
也可直接使用合并后的代码[https://github.com/phillyx/MUIDemos/tree/master/dist/common.js](https://github.com/phillyx/MUIDemos/tree/master/dist/common.js)