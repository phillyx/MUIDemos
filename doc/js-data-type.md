###js的基本数据类型有哪些？
`ECMAScript`中有5中简单数据类型（也称为基本数据类型）: `Undefined`、`Null`、`Boolean`、`Number`和`String`。还有1中复杂的数据类型————`Object`，`Object`本质上是由一组无序的名值对组成的。

其中`Undefined`、`Null`、`Boolean`、`Number`都属于基本类型。`Object`、`Array`和`Function`则属于引用类型，`String`有些特殊，具体的会在下面展开分析。

####变量
`ECMAScript`中用`var`关键字来定义变量，因为`js`是弱类型的，所以无法确定变量一定会存储什么值，也就不知道变量到底会是什么类型，而且变量的类型可以随时改变。

这就是`ECMAScript`是松散类型的来由，所谓松散类型就是可以用来保存任何类型的数据。

*ps:*
*`es6`中新增了`let`命令来声明变量、`const`命令声明一个只读的常量。*

*`let`的用法类似于`var`，但是所声明的变量，只在`let`命令所在的代码块内有效。*

*`const`一旦声明，常量的值就不能改变。*

*关于`let`、`const`这里不做展开讨论，可以参考 [阮一峰 - ECMAScript 6 入门](http://es6.ruanyifeng.com/#docs/let)*
*
####typeof 操作符
由于`js`中的变量是松散类型的，所以它提供了一种检测当前变量的数据类型的方法，也就是typeof关键字.
通过`typeof`关键字，对这5种数据类型会返回下面的值（以字符串形式显示)
`undefined`    ----------   如果值未定义                       `Undefined`

`boolean`      ----------     如果这个值是布尔值             ` Boolean`

`string`        ----------     如果这个值是字符串             ` String`

`number`      ----------     如果这个值是数值类型           `Number`

`object`        ----------     如果这个值是对象或`null` `Object`

需要注意的是`typeof null`返回为`object`,因为特殊值`null`被认为是一个空的对象引用。

####Undefined
`Undefined`类型只有一个值，即特殊的`undefined`。在使用`var`声明变量但未对其加以初始化时，这个变量的值就是`undefined`。不过，一般建议尽量给变量初始化，但是在早期的`js`版本中是没有规定`undefined`这个值的，所以在有些框架中为了兼容旧版浏览器，会给`window`对象添加`undefined`值。
```js
window['undefined'] = window['undefined'];  
//或者
window.undefined = window.undefined;  
```
####Null
`Null`类型是第二个只有一个值的数据类型，这个特殊的值是`null`。从逻辑角度来看，`null`值表示一个空对象指针，而这也正是使用`typeof`操作符检测`null`时会返回`object`的原因。
```js
  var car = null;
  console.log(typeof car); // "object"
```
如果定义的变量准备在将来用于保存对象，那么最好将该变量初始化为`null`而不是其他值。这样一来，只要直接检测`null`值就可以知道相应的变量是否已经保存了一个对象的引用了。
例如：
```js
  if(car != null){
    //对car对象执行某些操作
  }
```
实际上，undefined值是派生自null值的，因此ECMA-262规定对它们的相等性测试要返回true。
```js
console.log(undefined == null); //true
```
尽管null和undefined有这样的关系，但它们的用途完全不同。无论在什么情况下都没有必要把一个变量的值显式地设置为undefined，可是同样的规则对null却不适用。换句话说，只要意在保存对象的变量还没有真正保存对象，就应该明确地让该变量保存null值。这样做不仅可以体现null作为空对象指针的惯例，而且也有助于进一步区分null和undefined。

####Boolean
该类型只有两个字面值：true和false。这两个值与数字值不是一回事，因此true不一定等于1，而false也不一定等于0。

虽然Boolean类型的字面值只有两个，但JavaScript中所有类型的值都有与这两个Boolean值等价的值。要将一个值转换为其对应的Boolean值，可以调用类型转换函数Boolean()，例如：
```js
    var message = 'Hello World';
    var messageAsBoolean = Boolean(message);
```
在这个例子中，字符串message被转换成了一个Boolean值，该值被保存在messageAsBoolean变量中。可以对任何数据类型的值调用Boolean()函数，而且总会返回一个Boolean值。至于返回的这个值是true还是false，取决于要转换值的数据类型及其实际值。下表给出了各种数据类型及其对象的转换规则。

|数据类型|转换为true的值|转换为false的值|
|----|----|----|
|Boolean|true|false|
|String|任何非空的字符串|""(空字符串)|
|Number|任何非0数值（包括无穷大）|0和NAN|
|Object|任何对象|null|
|Undefined|不适用|undefined|

```js
    var message = 'Hello World';
    if(message)
    {
        alert("Value is true");
    }
```
运行这个示例，就会显示一个警告框，因为字符串message被自动转换成了对应的Boolean值（true）。由于存在这种自动执行的Boolean转换，因此确切地知道在流控制语句中使用的是什么变量至关重要。

*ps:使用!!操作符转换布尔值*
!!一般用来将后面的表达式强制转换为布尔类型的数据（boolean），也就是只能是true或者false;

对null与undefined等其他用隐式转换的值，用!操作符时都会产生true的结果，所以用两个感叹号的作用就在于将这些值转换为“等价”的布尔值；
```js
var foo;  
alert(!foo);//undifined情况下，一个感叹号返回的是true;  
alert(!goo);//null情况下，一个感叹号返回的也是true;  
var o={flag:true};  
var test=!!o.flag;//等效于var test=o.flag||false;  
alert(test);
```
这段例子，演示了在undifined和null时，用一个感叹号返回的都是true,用两个感叹号返回的就是false,所以两个感叹号的作用就在于，如果明确设置了变量的值（非null/undifined/0/”“等值),结果就会根据变量的实际值来返回，如果没有设置，结果就会返回false。

还有其他的小技巧，可以参考这[12个JavaScript技巧](http://web.jobbole.com/86146/)

####Number
这种类型用来表示整数和浮点数值，还有一种特殊的数值，即NaN（非数值 Not a Number）。这个数值用于表示一个本来要返回数值的操作数未返回数值的情况（这样就不会抛出错误了）。例如，在其他编程语言中，任何数值除以0都会导致错误，从而停止代码执行。但在JavaScript中，任何数值除以0会返回NaN，因此不会影响其他代码的执行。

NaN本身有两个非同寻常的特点。首先，任何涉及NaN的操作（例如NaN/10）都会返回NaN，这个特点在多步计算中有可能导致问题。其次，NaN与任何值都不相等，包括NaN本身。例如，下面的代码会返回false。
```js
alert(NaN == NaN);    //false
```
####String
String类型用于表示由零或多个16位Unicode字符组成的字符序列，即字符串。字符串可以由单引号(')或双引号(")表示。

**String类型的特殊性**

string类型有些特殊，因为字符串具有可变的大小，所以显然它不能被直接存储在具有固定大小的变量中。由于效率的原因，我们希望JS只复制对字符串的引用，而不是字符串的内容。但是另一方面，字符串在许多方面都和基本类型的表现相似，而字符串是不可变的这一事实（即没法改变一个字符串值的内容），因此可以将字符串看成**行为与基本类型相似的不可变引用类型**

Boolean、Number、String 这三个是Javascript中的基本包装类型，也就是这三个其实是一个构造函数，他们是Function的实例，是引用类型，至于这里的String与以上说的String是同名，是因为其实上文说的String是指字符串，这里的String指的是String这个构造函数，上面那么写，是为了更好的理解，因为Javascript是松散类型的。我们可以看下String实例化的例子：
```js
var name = String("jwy");
alert(typeof name);//"object"
var author = "Tom";
alert(typeof name);//"string"
```
至于author这个会有length，substring等等这些方法，其实是String这里的方面，string只是String的一个实例，类似于C#中的String，和string，只不过这里特殊一点。

注意，typeof 变量  如果值是"string" 的话，也就是这个变量是字符串，在Javascript中，字符串是基本类型，而在C#或Java中，字符串是引用类型，但是Javascript中的String是引用类型，因为它是Javascript中定义好的基本包装类型，在C#中，String跟string其实是一样的。

是不是有点绕？具体的引用类型和值类型的解析看这里[javascript的基本类型和引用类型](http://www.jb51.net/article/74897.htm)


*ps:内部转正，要求开放性简答三个问题*

>*题目一：  css权重是什么？*

>*题目二：js的基本数据类型有哪些？*

>*题目三：页面优化的方式有哪些？*

![](http://img2.imgtn.bdimg.com/it/u=382608122,1442631365&fm=21&gp=0.jpg)

本帖只是简要的copy了一些**JavaScript高级程序设计（第三版）**内容，外加了自己侧重的角度，看本帖的朋友还是要看书啊，这里只是做个参考。





