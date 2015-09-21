##myStorage在ios safari无痕浏览模式下的解决方案
---
今天看到了这个帖子[LocalStorage 在 Private Browsing 下的一个限制](http://bluereader.org/article/426505), 吓尿了，如果用户开启了无痕浏览，app几乎就废了，虽然做了plus.storage的兼容，不过会很慢很慢滴。
赶紧测试一下。。。。
还好，暂时没问题。
我这小心肝终于平静了。

万一，万一，万一有影响呢，还是做下容错吧，代码放到了github上，这里就不贴出来了。

---

[myStorageForPrivateBrowing](https://github.com/phillyx/MUIDemos/blob/master/js/myStorageForPrivateBrowsing.js)