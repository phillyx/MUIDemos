为什么要用rem
  - 参考文章[web app变革之rem](http://isux.tencent.com/web-app-rem.html)
  - 公司使用的`375*667`（也就是**iPhone6**）作为缩放比例标准，设计师是按照750px的标准出图
  - 为了保证在不同的屏幕下显示效果基本等同，为此规定了缩放比例 `document.documentElement.clientWidth` / 根字体大小25 = 15
  - 这里的根字体大小可以按照喜好自定义
  - 因此在计算`rem`值时,需要按照设计师给定的`px`值除以`25`，如给定字体大小为`15px`，那么计算出来的`rem`是`15/25=.6rem`
  - 下面的css只是罗列了基本常见的机型，实际上通过`js`来计算更易读易维护，如下
```css
/*默认根字体最大值50px*/	
/*测试一下看看是不是所有的比例都是15*/
html {
    font-size: 50px
}

body {
    font-size: 24px
}

@media screen and (min-width: 320px) {
    html {
        font-size:21.333333333333332px
    }

    body {
        font-size: 12px
    }
}

@media screen and (min-width: 360px) {
    html {
        font-size:24px
    }

    body {
        font-size: 12px
    }
}

@media screen and (min-width: 375px) {
    html {
        font-size:25px
    }

    body {
        font-size: 12px
    }
}

@media screen and (min-width: 384px) {
    html {
        font-size:25.6px
    }

    body {
        font-size: 14px
    }
}

@media screen and (min-width: 400px) {
    html {
        font-size:26.666666666666668px
    }

    body {
        font-size: 14px
    }
}

@media screen and (min-width: 414px) {
    html {
        font-size:27.6px
    }

    body {
        font-size: 14px
    }
}

@media screen and (min-width: 424px) {
    html {
        font-size:28.266666666666667px
    }

    body {
        font-size: 14px
    }
}

@media screen and (min-width: 480px) {
    html {
        font-size:32px
    }

    body {
        font-size: 15.36px
    }
}

@media screen and (min-width: 540px) {
    html {
        font-size:36px
    }

    body {
        font-size: 17.28px
    }
}

@media screen and (min-width: 720px) {
    html {
        font-size:48px
    }

    body {
        font-size: 23.04px
    }
}

@media screen and (min-width: 750px) {
    html {
        font-size:50px
    }

    body {
        font-size: 24px
    }
}
```
```js
(function(doc, win) {
	var docEl = doc.documentElement,
		resizeEvt = ‘orientationchange’ in window ? ‘orientationchange’ : ‘resize’,
		recalc = function() {
			var clientWidth = docEl.clientWidth;
			if (!clientWidth) return;
			/*选定一款机型作为缩放标准*/
			docEl.style.fontSize = 25 * (clientWidth / 375) + ‘px’;
			/*根字体最大50px*/
			docEl.style.fontSize = docEl.style.fontSize > 50 ? 50 : docEl.style.fontSize;
		};
	if (!doc.addEventListener) return;
	win.addEventListener(resizeEvt, recalc, false);
	doc.addEventListener(‘DOMContentLoaded’, recalc, false);
})(document, window);
```
为了减少同学的工作量，就做了一个pexilToRem的对照表，如下

|  px    |   rem  |
| ------ | ------ |
|  1px   |  0.04rem |
|  2px   |  0.08rem |
|  3px   |  0.12rem |
|  4px   |  0.16rem |
|  5px   |  0.2rem |
|  6px   |  0.24rem |
|  7px   |  0.28rem |
|  8px   |  0.32rem |
|  9px   |  0.36rem |
|  10px  |  0.4rem |
|  11px  |  0.44rem |
|  12px  |  0.48rem |
|  13px  |  0.52rem |
|  14px  |  0.56rem |
|  15px  |  0.6rem |
|  16px  |  0.64rem |
|  17px  |  0.68rem |
|  18px  |  0.72rem |
|  19px  |  0.76rem |
|  20px  |  0.8rem |
|  21px  |  0.84rem |
|  22px  |  0.88rem |
|  23px  |  0.92rem |
|  24px  |  0.96rem |
|  25px  |  1rem |
|  26px  |  1.04rem |
|  27px  |  1.08rem |
|  28px  |  1.12rem |
|  29px  |  1.16rem |
|  30px  |  1.2rem |
|  31px  |  1.24rem |
|  32px  |  1.28rem |
|  33px  |  1.32rem |
|  34px  |  1.36rem |
|  35px  |  1.4rem |
|  36px  |  1.44rem |
|  37px  |  1.48rem |
|  38px  |  1.52rem |
|  39px  |  1.56rem |
|  40px  |  1.6rem |
|  41px  |  1.64rem |
|  42px  |  1.68rem |
|  43px  |  1.72rem |
|  44px  |  1.76rem |
|  45px  |  1.8rem |
|  46px  |  1.84rem |
|  47px  |  1.88rem |
|  48px  |  1.92rem |
|  49px  |  1.96rem |
|  50px  |  2rem |

以上是直接在控制台转换的
```js
var pexilToRem=[];
for(var i=1;i<51;i++){
  pexilToRem.push({'px':i+'px','rem':i/25+'rem'})
}
console.table(pexilToRem)
```
当然也可以用scss
```js
$browser-default-font-size: 25px !default;//变量的值可以根据自己需求定义
@function pxTorem($px){//$px为需要转换的字号
    @return $px / $browser-default-font-size * 1rem;
}
```
