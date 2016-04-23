##MUI - 封装localStorage与plus.storage
	在使用plus.storage频繁地存取数据时，可以感觉到明显的卡顿，而且很耗内存，
    在切换到localstorage时虽然效率很高，页面渲染速度明显变快了，且手机发热不明显，不过又遇到了存储瓶颈（一般<=5M）,
    因此折中采取了plus.storage与localStorage混合的方案：
    	当localStorage达到存储瓶颈时切换到plus.storage

封装的方法基本上和`plus.storage`没区别。关于`plus.storage`参考[http://www.html5plus.org/doc/zh_cn/storage.html](http://www.html5plus.org/doc/zh_cn/storage.html)
###接口
1. `getItem`
通过键`key`检索获取应用存储的值
```js
var item=myStorage.getItem(key);
```
 - 参数`key`: `DOMString`必选
   存储的键值
 - 返回值`DOMString` : 键`key`对应应用存储的值，如果没有则返回`null`。
 - 说明：方法内部默认先从`localStorage`取值，没有再从`plus.Storage`取值
2. `setItem`
修改或添加键值(key-value)对数据到应用数据存储中
```js
void myStorage.setItem(key, value);
```
 - 说明：方法默认将数据存储在`localStorage`中，超出`localStorage`容量限制则存到`plus.storage`中
3. `getLength`
获取`localStorage`中保存的键值对的个数
```js
var len=myStorage.getLength();
```
4. `getLengthPlus`
获取`plus.storage`中保存的键值对的个数
5. `removeItem`
通过`key`值删除键值对存储的数据
```js
void myStorage.removeItem();
```
6. `clear`
清除应用所有的键值对存储数据
```js
void myStorage.clear();
```
7. `key`
获取`localStorage`键值对中指定索引值的key值
```js
var foo = myStorage.key(index);
```
8. `keyPlus`
获取`plus.storage`键值对中指定索引值的key值
```js
var foo = myStorage.keyPlus(index);
```
9. `getItemByIndex`
通过键`key`检索获取应用存储`localStorage`的值
```js
var item=myStorage.getItemByIndex(index);
```
 - 参数`index`: `Number`必选 存储键值的索引
 - 返回值`DOMString` : 键`key`对应应用存储的值，如果没有则返回`null`。
10. `getItemByIndexPlus`
通过键`key`检索获取应用存储的值
```js
var item=myStorage.getItemByIndexPlus(index);
```
 - 参数`index`: `Number`必选 存储键值的索引
 - 返回值`DOMString` : 键`key`对应应用存储的值，如果没有则返回`null`。

11. `getItems`
通过键`key`检索获取应用存储的值
```js
var items=myStorage.getItems(key)
```
 - 参数 `key`: `Number`可选 存储键值的索引
 - 返回值`Array`：不传`key`参则返回所有对象，否则返回含有该key的对象
12. `removeItemByKeys`
清除指定前缀的存储对象
```js
void myStorage.removeItemBykeys(keys,cb)
```
 - 参数`keys`：`DOMString`或`Array`, 必选 `keys`为`String`,方法内部自动转换为`Array`
 - 参数`cb`：`Function` 可选  回调函数


###说明
以上方法经常用到的还是`getItem` `setItem`
`getItems`在测试或控制台查看时倒是偶尔用得到
`removeItemBykeys`是结合本地文件`common.cache.clear`缓存清除时一齐使用的

- - -
代码已分享到github
地址在[https://github.com/phillyx/MUIDemos/tree/master/js/myStorage.js](https://github.com/phillyx/MUIDemos/tree/master/js/myStorage.js)
也可直接使用合并后的代码[https://github.com/phillyx/MUIDemos/tree/master/dist/common.js](https://github.com/phillyx/MUIDemos/tree/master/dist/common.js)

