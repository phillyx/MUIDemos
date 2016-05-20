##sass开发过程中遇到的几个坑
1.安装sass被墙的问题

	安装完`ruby`后，打开`ruby cmd` 输入`gem install sass`,安装失败，有可能是镜像源的问题，也有可能是墙的问题。
	因为公司内网的奇葩限制，各种墙，非常的不爽。
  - 可以先参考[sass-install](http:w3cplus.com/sassguide/install.html) 安装淘宝镜像
  - 镜像源被墙，安装失败的话，只能使用代理安装了。比较麻烦，可以详细参考以下步骤：
  - 将[cacert.pem](http://files.cnblogs.com/files/phillyx/cacert.rar)文件放到C:\RubyCertificates目录下，没有就新建
  - 接着添加系统环境变量`SSL_CERT_FILE` `C:/RubyCertificates/cacert.pem `,并重启。
       参考图片
       
    ![](http://images.cnblogs.com/cnblogs_com/phillyx/779277/o_20160516114537044.png)
    
  - 移除原生gem镜像
	`gem sources --remove https://rubygems.org/`
  - 添加淘宝gem镜像
	`gem sources --add https://ruby.taobao.org/  --http-proxy http://代理地址/`
  - 安装`sass `
	`gem install sass --http-proxy http://代理地址/`
  
  最后安装成功了，参见图片
  
  ![](http://images.cnblogs.com/cnblogs_com/phillyx/779277/o_20160516114604127.png)

2.sass中文注释报错
  - 打开`C:\Ruby22-x64\lib\ruby\gems\2.2.0\gems\sass-3.4.22\lib\sass\engine.rb`文件
  - 在文件下添加一行`Encoding.default_external = Encoding.find('utf-8')`
  
3.'&: 伪元素'不要加空格，编译报错，`&:before` 一定不要加空格，一定注意不要加空格，一定注意编辑器格式化是有无加空格

4.在`ruby cmd`中 敲击 `sass  –i`  可以开启sass的函数计算
  如`darken(white,70%)` 输出`4d4d4d`
  
5.四则运算的符号前后一定要有空格`1px + 1px + 1px`

以上，遇到了再更
