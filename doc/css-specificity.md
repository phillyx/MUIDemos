###css权重是什么？
####概述
`css Specificity`中文一般译为`css`优先级、`css`权重。相比“权重”，“优先级”更好理解，`mozilla`官方中文文档就翻译为“优先级”。

`Specificity`基于设定的匹配规则，浏览器通过设定好的优先级来判断哪些属性值`DOM`元素最为相关，从而在该`DOM`上应用这些值。

简单理解就是一个`DOM`的某个属性值有多个`css`样式设置，优先级高的那个应用。很多`css`设置不生效的问题，都是因为在某处定义了一个更高的优先级，从而导致该处样式不生效。

优先级的顺序如下：
	important > 内联(style) > ID > 类(class) > 标签(li...) | 伪类(:hover,:focus...) | 属性选择[attr=''] > 伪对象(:before,:after,...) > 通配符(*) > 继承(inherit)
那么如何确定优先级呢？	
####Specificity值的计算
先说结论：

	一般采用10进制的简单相加计算方式。从0开始，一个行内样式+1000，一个id+100，一个属性选择器/class或者伪类+10，一个元素名，或者伪元素+1.
	
具体的css的规则如下：
 
 - A：如果规则是写在标签的style属性中（内联样式），则A=1，否则，A=0. 对于内联样式，由于没有选择器，所以 B、C、D 的值都为 0，即 A=1, B=0, C=0, D=0（简写为 1,0,0,0，下同）。
 - B：计算该选择器中ID的数量。（例如，#header 这样的选择器，计算为 0, 1, 0, 0）。
 - C：计算该选择器中伪类及其它属性的数量（包括类选择器、属性选择器等，不包括伪元素）。 （例如， .logo[id='site-logo'] 这样的选择器，计算为 0, 0, 2, 0）。
 - D：计算该选择器中伪元素及标签的数量。（例如，p:first-letter 这样的选择器，计算为0, 0, 0, 2）。

```css
/*通配选择符(Universal Selector)*/     * {} /* a=0 b=0 c=0 d=0 -> specificity = 0,0,0,0 */
/*类型选择符(Type Selectors)*/		  li {} /* a=0 b=0 c=0 d=1 -> specificity = 0,0,0,1 */
/*类选择符(Class Selectors)*/         .active{color:blue;}/* a=0 b=0 c=1 d=0 -> specificity = 0,0,1,0 */
/*伪类选择符(Pseudo-classes Selectors)*/li:first-line {} /* a=0 b=0 c=0 d=2 -> specificity = 0,0,0,2 */
/*属性选择符(Attribute Selectors)*/   h[title] {color:blue;} /* a=0 b=0 c=1 d=0 -> specificity = 0,0,1,0 */
/*ID选择符(ID Selectors)*/            #sj{ font-size:12px;}  /* a=0 b=1 c=0 d=0 -> specificity = 0,1,0,0 */
/*内联(style)*/                       style="" 				/* a=1 b=0 c=0 d=0 -> specificity = 1,0,0,0 */
/*包含选择符(Descendant Selectors)*/  ul li {} /* a=0 b=0 c=0 d=1+1 -> specificity = 0,0,0,2 */
/*相邻+属性选择符(Adjacent Sibling Selectors)*/ h1 + *[rel=up]{} /* a=0 b=0 c=1 d=1 -> specificity = 0,0,1,1 */
ul ol li.red {} /* a=0 b=0 c=1 d=3 -> specificity = 0,0,1,3 */
li.red.level {} /* a=0 b=0 c=2 d=1 -> specificity = 0,0,2,1 */

```
大多数情况下，按照以上的理解得出的结论是没问题的，不过总有例外，如
```css
body header div nav ul li div p a span em {color: red}
.ctn{color:blue}
```
按照错误的计算方法，样式一的权重值是11，样式二的权重值是10，如果这两条规则用于同一个元素，则该元素应该是红色。实际结果却是蓝色。

因此还有一些基本的规则

####优先级的基本规则
1.相同的权重：以后面出现的选择器为最后规则

假如在外部样式表中，同一个CSS规则你写了两次，那么出现在前面的选择器权重低，你的样式会选择后面的样式：
```css
#content h1 {
  padding: 5px;
}

#content h1 {
  padding: 10px;
}

```
两个选择器的权重都是0，1，0，1，最后那个规则生效。

2.不同的权重，权重值高则生效

Id选择器的优先级比属性选择器高,比如下面的例子里 样式表中#p123的权重明显比[id=p123]的权重要高。
```css
a#a-02 { background-image : url(n.gif); }

a[id="a-02"] { background-image : url(n.png); }

```
3.就近原则

如我在样式表中对DOM定义的样式A,然后我又在html也对DOM定义了B,应用B
```css
.A {
  padding: 5px;
}
```
```html
<style type="text/css">
  .B {
    padding: 10px;
  }
</style>
```
4.无论多少个元素组成的选择器，都没有一个class选择器优先级高。

就是上面的那个例外。

5.无视DOM树的距离

如下样式：
```css
body h1 {
  color: green;
}
html h1 {
  color: purple;
}
```
当它应用在下面的HTML时:

```html
<html>
<body>
  <h1>Here is a title!</h1>
</body>
</html>
```
浏览器会将它渲染成purple;
实际上规则1也适用于此，不过由于其DOM负极标签的不同，故单拎出来特殊化。

6.:not 伪类例外

:not 否定伪类在优先级计算中不会被看作是伪类. 事实上, 在计算选择器数量时还是会把其中的选择器当做普通选择器进行计数.

```css
div.outer p {
  color:orange;
}
div:not(.outer) p {
  color: lime;
}
```
当它被应用在下面的HTML时,就是文字描述效果
```html
<div class="outer">
  <p>orange</p>
  <div class="inner">
    <p>lime</p>
  </div>
</div>
```

7.!important 规则例外

当在一个样式声明上使用 !important 规则时，该样式声明会覆盖CSS中任何其他的声明。

尽管技术上 !important 与优先级毫无关系，但是它们之间直接相互影响。

使用 !important 是一个坏习惯，应该尽量避免，因为这打断了样式表中的固有的级联规则 使得调试找bug变得更加困难了。

当两条相互冲突的带有!important 规则的声明被应用到相同的元素上时，拥有更大优先级的声明将会被采用。

具体的参考[!important_规则例外](https://developer.mozilla.org/zh-CN/docs/Web/CSS/Specificity#!important_规则例外),就不一一粘贴过来了。



*ps:内部转正，要求开放性简答三个问题*

>*题目一：  css权重是什么？*

>*题目二：js的基本数据类型有哪些？*

>*题目三：页面优化的方式有哪些？*

![](http://img2.imgtn.bdimg.com/it/u=382608122,1442631365&fm=21&gp=0.jpg)