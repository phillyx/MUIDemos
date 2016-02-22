/**
 * @description 判断身份证号码
 * @param {Object} num
 */
function isIDCardNum(num) {
	num = num.toUpperCase();
	//身份证号码为15位或者18位，15位时全为数字，18位前17位为数字，最后一位是校验位，可能为数字或字符X。
	if (!(/(^\d{15}$)|(^\d{17}([0-9]|X)$)/.test(num))) {
		return '输入的身份证号长度不对，或者号码不符合规定！\n15位号码应全为数字，18位号码末位可以为数字或X。';
	}
	//校验位按照ISO 7064:1983.MOD 11-2的规定生成，X可以认为是数字10。
	//下面分别分析出生日期和校验位
	var len, re;
	len = num.length;
	if (len == 15) {
		re = new RegExp(/^(\d{6})(\d{2})(\d{2})(\d{2})(\d{3})$/);
		var arrSplit = num.match(re);

		//检查生日日期是否正确
		var dtmBirth = new Date('19' + arrSplit[2] + '/' + arrSplit[3] + '/' + arrSplit[4]);
		var bGoodDay;
		bGoodDay = (dtmBirth.getYear() == Number(arrSplit[2])) && ((dtmBirth.getMonth() + 1) == Number(arrSplit[3])) && (dtmBirth.getDate() == Number(arrSplit[4]));
		if (!bGoodDay) {
			return '输入的身份证号里出生日期不对！';
		} else {
			//将15位身份证转成18位
			//校验位按照ISO 7064:1983.MOD 11-2的规定生成，X可以认为是数字10。
			var arrInt = new Array(7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2);
			var arrCh = new Array('1', '0', 'X', '9', '8', '7', '6', '5', '4', '3', '2');
			var nTemp = 0,
				i;
			num = num.substr(0, 6) + '19' + num.substr(6, num.length - 6);
			for (i = 0; i < 17; i++) {
				nTemp += num.substr(i, 1) * arrInt[i];
			}
			num += arrCh[nTemp % 11];
			return true;
		}
	}
	if (len == 18) {
		re = new RegExp(/^(\d{6})(\d{4})(\d{2})(\d{2})(\d{3})([0-9]|X)$/);
		var arrSplit = num.match(re);

		//检查生日日期是否正确
		var dtmBirth = new Date(arrSplit[2] + "/" + arrSplit[3] + "/" + arrSplit[4]);
		var bGoodDay;
		bGoodDay = (dtmBirth.getFullYear() == Number(arrSplit[2])) && ((dtmBirth.getMonth() + 1) == Number(arrSplit[3])) && (dtmBirth.getDate() == Number(arrSplit[4]));
		if (!bGoodDay) {
			return '输入的身份证号里出生日期不对！';
		} else {
			//检验18位身份证的校验码是否正确。
			//校验位按照ISO 7064:1983.MOD 11-2的规定生成，X可以认为是数字10。
			var valnum;
			var arrInt = new Array(7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2);
			var arrCh = new Array('1', '0', 'X', '9', '8', '7', '6', '5', '4', '3', '2');
			var nTemp = 0,
				i;
			for (i = 0; i < 17; i++) {
				nTemp += num.substr(i, 1) * arrInt[i];
			}
			valnum = arrCh[nTemp % 11];
			if (valnum != num.substr(17, 1)) {
				//$("#tip").html('18位身份证的校验码不正确！应该为：' + valnum);
				return '18位身份证的校验码不正确！';
			}
			return true;
		}
	}
	return '18位身份证的校验码不正确！';
};
/***
 * chizhenming
 * js 工具类
 */
//日期格式化 
//示例： 
//alert(new Date().Format("yyyy年MM月dd日")); 
//alert(new Date().Format("MM/dd/yyyy")); 
//alert(new Date().Format("yyyyMMdd")); 
//alert(new Date().Format("yyyy-MM-dd hh:mm:ss"));
Date.prototype.format = function(format) {
	var o = {
		"M+": this.getMonth() + 1, //month 
		"d+": this.getDate(), //day 
		"h+": this.getHours(), //hour 
		"m+": this.getMinutes(), //minute 
		"s+": this.getSeconds(), //second 
		"q+": Math.floor((this.getMonth() + 3) / 3), //quarter 
		"S": this.getMilliseconds() //millisecond 
	}

	if (/(y+)/.test(format)) {
		format = format.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
	}

	for (var k in o) {
		if (new RegExp("(" + k + ")").test(format)) {
			format = format.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k] : ("00" + o[k]).substr(("" + o[k]).length));
		}
	}
	return format;
};
//
var stringDate = function(dates) {
	if (dates) {
		var dateArray = dates.split("-");
		if (dateArray) {
			
			return new Date(dateArray[0],(+dateArray[1]-1) , dateArray[2]);
		}
	}else{
		return new Date();
	}
}
/*
* @description 判断当前参数是否是空值
*/
function isNull(str) {
	if (!str || str == "" || str == "null" || str == "undefined") {
		return true;
	} else {
		return false;
	}
};
/*
* @description js替换对象
*/
var extendObj = function(target, source) {
	for (var p in source) {
		if (source.hasOwnProperty(p)) {
			target[p] = source[p];
		}
	}

	return target;
};
//判断正整数
function checkRate(input) {
	var re = /^[1-9]+[0-9]*]*$/;

	if (!re.test(input)) {
		return false;
	} else {
		return true;
	}
}


Date.prototype.addDay = function(num) {
	this.setDate(this.getDate() + num);
	return this;
}

Date.prototype.addMonth = function(num) {
	var tempDate = this.getDate();
	this.setMonth(this.getMonth() + num);
	if (tempDate != this.getDate())
		this.setDate(0);
	return this;
}

Date.prototype.addYear = function(num) {
	var tempDate = this.getDate();
	this.setYear(this.getYear() + num);
	if (tempDate != this.getDate())
		this.setDate(0);
	return this;
}
Date.prototype.Format = function(formatStr) {
	var str = formatStr;
	var week = ['日', '一', '二', '三', '四', '五', '六'];

	var timezoneOffset = this.getTimezoneOffset();
	this.setTime(this.getTime() + timezoneOffset * 60 * 1000 + 480 * 60 * 1000);

	str = str.replace(/yyyy|YYYY/, this.getFullYear());
	str = str.replace(/yy|YY/, (this.getYear() % 100) > 9 ? (this.getYear() % 100).toString() : '0' + (this.getYear() % 100));

	str = str.replace(/MM/, (this.getMonth() + 1) > 9 ? (this.getMonth() + 1).toString() : '0' + (this.getMonth() + 1));
	str = str.replace(/M/g, (this.getMonth() + 1));

	str = str.replace(/w|W/g, week[this.getDay()]);

	str = str.replace(/dd|DD/, this.getDate() > 9 ? this.getDate().toString() : '0' + this.getDate());
	str = str.replace(/d|D/g, this.getDate());

	str = str.replace(/hh|HH/, this.getHours() > 9 ? this.getHours().toString() : '0' + this.getHours());
	str = str.replace(/h|H/g, this.getHours());
	str = str.replace(/mm/, this.getMinutes() > 9 ? this.getMinutes().toString() : '0' + this.getMinutes());
	str = str.replace(/m/g, this.getMinutes());

	str = str.replace(/ss|SS/, this.getSeconds() > 9 ? this.getSeconds().toString() : '0' + this.getSeconds());
	str = str.replace(/s|S/g, this.getSeconds());

	return str;
}

function StringBuilder(value) {
	this.strings = new Array("");
	this.append(value);
}
StringBuilder.prototype.append = function(value) {
	if (value) {
		this.strings.push(value);
	}
}
StringBuilder.prototype.clear = function() {
	this.strings.length = 1;
}
StringBuilder.prototype.toString = function() {
	return this.strings.join("");
}
StringBuilder.prototype.append = function(value) {
	if (value) {
		this.strings.push(value);
	}
}
StringBuilder.prototype.clear = function() {
	this.strings.length = 1;
}
StringBuilder.prototype.toString = function() {
	return this.strings.join("");
}

function HashMap() {
	/** Map ��С **/
	var size = 0;
	/** ���� **/
	var entry = [];

	/** �� **/
	this.put = function(key, value) {
			if (!this.containsKey(key)) {
				size++;
			}
			entry[key] = value;
		}
		/** ȡ **/
	this.get = function(key) {
			return this.containsKey(key) ? entry[key] : null;
		}
		/** ɾ�� **/
	this.remove = function(key) {
			if (this.containsKey(key) && (
				delete entry[key])) {
				size--;
			}
		}
		/** �Ƿ�� Key **/
	this.containsKey = function(key) {
			return (key in entry);
		}
		/** �Ƿ�� Value **/
	this.containsValue = function(value) {
			for (var prop in entry) {
				if (entry[prop] == value) {
					return true;
				}
			}
			return false;
		}
		/** ���� Value **/
	this.values = function() {
			var values = new Array();
			for (var prop in entry) {
				values.push(entry[prop]);
			}
			return values;
		}
		/** ���� Key **/
	this.keys = function() {
			var keys = new Array();
			for (var prop in entry) {
				keys.push(prop);
			}
			return keys;
		}
		/** Map Size **/
	this.size = function() {
			return size;
		}
		/* ��� */
	this.clear = function() {
		size = 0;
		entry = new Object();
	}
}

/*
 * 方法:Array.removeAt(Index)
 * 功能:删除数组元素.
 * 参数:Index删除元素的下标.
 * 返回:在原数组上修改数组
 */

Array.prototype.removeAt = function(Index) {
		if (isNaN(Index) || Index > this.length) {
			return false;
		}
		for (var i = 0, n = 0; i < this.length; i++) {
			if (this[i] != this[Index]) {
				this[n++] = this[i]
			}
		}
		this.length -= 1
	}
/*
 * 方法:Array.remove(obj)
 * 功能:删除数组元素.
 * 参数:要删除的对象.
 * 返回:在原数组上修改数组
 */

Array.prototype.remove = function(obj) {
		if (null == obj) {
			return;
		}
		for (var i = 0, n = 0; i < this.length; i++) {
			if (this[i] != obj) {
				this[n++] = this[i];
			}
		}
		this.length -= 1
	}
/*
 * 方法:Array.Contains(obj)
 * 功能:确定某个元素是否在数组中.
 * 参数:要查找的Object对象
 * 返回:找到返回true,否则返回false;
 */
Array.prototype.Contains = function(obj) {
		if (null == obj) {
			return false;
		}
		var c = false;
		for (var i = 0, n = 0; i < this.length; i++) {
			if (this[i] == obj) {
				c = true;
			}
		}
		return c;
	}
/*
 * 方法:Array.IndexOf(obj)
 * 功能:搜索指定的Object,并返回第一个匹配项从零开始的索引
 * 参数:要查找的Object对象
 * 返回:找到返回该元素在数组中的索引,否则返回-1
 */
Array.prototype.IndexOf = function(obj) {
		if (null == obj) {
			return;
		} {
			for (var i = 0, n = 0; i < this.length; i++) {
				if (this[i] == obj) {
					return i;
				}
			}
		}

		return -1;
	}
/*
 * 方法:Array.Clear()
 * 功能:消空数组元素.
 * 参数:无.
 * 返回:空数组
 */
Array.prototype.Clear = function() {
	this.length = 0;
}

//省略字符串
String.prototype.part = function(str, number, count) {
	if (str.length > number) {
		return str = str.substring(0, count) + "....";
	}
}
String.prototype.replaceAll = function(s1, s2) {
	return this.replace(new RegExp(s1, "gm"), s2);
};
String.formatmodel = function(str, model) {
	for (var k in model) {
		var re = new RegExp("{" + k + "}", "g");
		str = str.replace(re, model[k]);
	}
	return str;
};

var base64_keyStr = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";

String.prototype.ToCharArray = function() {
		return this.split("");
	}
	// 倒序
String.prototype.Reverse = function() {
		return this.split("").reverse().join("");
	}
	// 是否包含指定字符
String.prototype.IsContains = function(str) {
		return (this.indexOf(str) > -1);
	}
	// 判断是否为空
String.prototype.IsEmpty = function() {
		return this == "";
	}
	// 判断是否是数字
String.prototype.IsNumeric = function() {
		var tmpFloat = parseFloat(this);
		if (isNaN(tmpFloat))
			return false;
		return true;
	}
	// 判断是否是整数
String.prototype.IsInt = function() {
		if (this == "NaN")
			return false;
		return this == parseInt(this).toString();
	}
	// 合并多个空白为一个空白
String.prototype.resetBlank = function() {
		return this.replace(/s+/g, "");
	}
	// 除去左边空白
String.prototype.LTrim = function() {
		return this.replace(/(^\s*)/g, "");
	}
	// 除去右边空白
String.prototype.RTrim = function() {
		return this.replace(/(\s*$)/g, "");
	}
	// 除去两边空白
String.prototype.trim = function() {
		return this.replace(/(^\s*)|(\s*$)/g, "");
	}
	// 保留数字
String.prototype.getNum = function() {
		return this.replace(/[^d]/g, "");
	}
	// 保留字母
String.prototype.getEn = function() {
		return this.replace(/[^A-Za-z]/g, "");
	}
	// 保留中文
String.prototype.getCn = function() {
		return this.replace(/[^u4e00-u9fa5uf900-ufa2d]/g, "");
	}
	// 获取字节长度
String.prototype.ByteLength = function() {
		return this.replace(/[^\x00-\xff]/g, "aa").length;
	}
	// 从左截取指定长度的字串
String.prototype.left = function(n) {
		return this.slice(0, n);
	}
	// 从右截取指定长度的字串
String.prototype.right = function(n) {
		return this.slice(this.length - n);
	}
	// HTML编码
String.prototype.HTMLEncode = function() {
		var re = this;
		var q1 = [/x26/g, /x3C/g, /x3E/g, /x20/g];
		var q2 = ["&", "<", ">", " "];
		for (var i = 0; i < q1.length; i++)
			re = re.replace(q1[i], q2[i]);
		return re;
	}
	// 获取Unicode
String.prototype.Unicode = function() {
		var tmpArr = [];
		for (var i = 0; i < this.length; i++)
			tmpArr.push("&#" + this.charCodeAt(i) + ";");
		return tmpArr.join("");
	}
	// 指定位置插入字符串
String.prototype.Insert = function(index, str) {
		return this.substring(0, index) + str + this.substr(index);
	}
	/**
	 * 判断字符串是否以指定的字符串开始
	 */
String.prototype.startsWith = function(str) {
		return this.substr(0, str.length) == str;
	}
	/**
	 * 判断字符串是否以指定的字符串开始，忽略大小写
	 */
String.prototype.iStartsWith = function(str) {
		return this.substr(0, str.length).iEquals(str);
	}
	/**
	 * 判断字符串是否以指定的字符串结束
	 */
String.prototype.endsWith = function(str) {
		return this.substr(this.length - str.length) == str;
	}
	/**
	 * 判断字符串是否以指定的字符串结束，忽略大小写
	 */
String.prototype.iEndsWith = function(str) {
		return this.substr(this.length - str.length).iEquals(str);
	}
	/**
	 * 忽略大小写比较字符串 注：不忽略大小写比较用 == 号
	 */
String.prototype.iEquals = function(str) {
		return this.toLowerCase() == str.toLowerCase();
	}
	/**
	 * 比较字符串，根据结果返回 -1, 0, 1
	 */
String.prototype.compareTo = function(str) {
	if (this == str) {
		return 0;
	} else if (this < str) {
		return -1;
	} else {
		return 1;
	}
};
/**
 * 忽略大小写比较字符串，根据结果返回 -1, 0, 1
 */
String.prototype.iCompareTo = function(str) {
	return this.toLowerCase().compareTo(str.toLowerCase());
}

String.prototype.encode64 = function() {
	var output = "";
	var chr1, chr2, chr3 = "";
	var enc1, enc2, enc3, enc4 = "";
	var i = 0;
	var input = this.toString();
	do {
		chr1 = input.charCodeAt(i++);
		chr2 = input.charCodeAt(i++);
		chr3 = input.charCodeAt(i++);

		enc1 = chr1 >> 2;
		enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
		enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
		enc4 = chr3 & 63;

		if (isNaN(chr2)) {
			enc3 = enc4 = 64;
		} else if (isNaN(chr3)) {
			enc4 = 64;
		}

		output = output + base64_keyStr.charAt(enc1) + base64_keyStr.charAt(enc2) + base64_keyStr.charAt(enc3) + base64_keyStr.charAt(enc4);
		chr1 = chr2 = chr3 = "";
		enc1 = enc2 = enc3 = enc4 = "";
	} while (i < input.length);

	return output;
}
String.prototype.StringFormat = function() {
	if (arguments.length == 0)
		return null;
	var str = arguments[0];
	for (var i = 1; i < arguments.length; i++) {
		var re = new RegExp('\\{' + (i - 1) + '\\}');
		str = str.replace(re, arguments[i]);
	}
	return str;
}
String.prototype.decode64 = function(input) {
	var output = "";
	var chr1, chr2, chr3 = "";
	var enc1, enc2, enc3, enc4 = "";
	var i = 0;

	if (input.length % 4 != 0) {
		return "";
	}
	var base64test = /[^A-Za-z0-9\+\/\=]/g;
	if (base64test.exec(input)) {
		return "";
	}

	do {
		enc1 = base64_keyStr.indexOf(input.charAt(i++));
		enc2 = base64_keyStr.indexOf(input.charAt(i++));
		enc3 = base64_keyStr.indexOf(input.charAt(i++));
		enc4 = base64_keyStr.indexOf(input.charAt(i++));

		chr1 = (enc1 << 2) | (enc2 >> 4);
		chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
		chr3 = ((enc3 & 3) << 6) | enc4;

		output = output + String.fromCharCode(chr1);

		if (enc3 != 64) {
			output += String.fromCharCode(chr2);
		}
		if (enc4 != 64) {
			output += String.fromCharCode(chr3);
		}

		chr1 = chr2 = chr3 = "";
		enc1 = enc2 = enc3 = enc4 = "";

	} while (i < input.length);

	return output;
};


function dateLe(startDate, endDate) {
	if (startDate && endDate) {
		startDate = startDate.replace(/-/g, "/");
		endDate = endDate.replace(/-/g, "/");
		var dt1 = new Date(Date.parse(startDate));
		var dt2 = new Date(Date.parse(endDate));
		return (dt1 <= dt2);
	} else {
		return false;
	}
}

function dateLt(startDate, endDate) {
	if (startDate && endDate) {
		startDate = startDate.replace(/-/g, "/");
		endDate = endDate.replace(/-/g, "/");
		var dt1 = new Date(Date.parse(startDate));
		var dt2 = new Date(Date.parse(endDate));
		return (dt1 < dt2);
	} else {
		return false;
	}
}

function dateGt(startDate, endDate) {
	if (startDate && endDate) {
		startDate = startDate.replace(/-/g, "/");
		endDate = endDate.replace(/-/g, "/");
		var dt1 = new Date(Date.parse(startDate));
		var dt2 = new Date(Date.parse(endDate));
		return (dt1 > dt2);
	} else {
		return false;
	}
}

function dateGe(startDate, endDate) {
	if (startDate && endDate) {
		startDate = startDate.replace(/-/g, "/");
		endDate = endDate.replace(/-/g, "/");
		var dt1 = new Date(Date.parse(startDate));
		var dt2 = new Date(Date.parse(endDate));
		return (dt1 >= dt2);
	} else {
		return false;
	}
}

function getLocationHref() {
	return document.location.href;
}

function checkLength(strTemp) {
	var i, sum;
	sum = 0;
	for (i = 0; i < strTemp.length; i++) {
		if ((strTemp.charCodeAt(i) >= 0) && (strTemp.charCodeAt(i) <= 255)) {
			sum = sum + 1;
		} else {
			sum = sum + 2;
		}
	}
	return sum;
}

function getRandomNumber(min, max) {
	var range = max - min;
	var rand = Math.random();
	return (min + Math.round(rand * range));
}

function isJson(obj) {
	var isjson = typeof(obj) == "object" && Object.prototype.toString.call(obj).toLowerCase() == "[object object]" && !obj.length;
	return isjson;
}

function strToJson(str) {
	var json = eval('(' + str + ')');
	return json;
};

function checkDate(startDate, endDate) {
	var sDate = new Date(startDate.replace(/\-/g, "\/"));
	var eDate = new Date(endDate.replace(/\-/g, "\/"));
	if (sDate > eDate) {
		return false;
	}
	return true;
}

function parseURL() {
	var url = document.baseURI || document.URL;
	url = decodeURI(url);
	var parse = url.match(/^(([a-z]+):\/\/)?([^\/\?#]+)\/*([^\?#]*)\??([^#]*)#?(\w*)$/i);
	var query = parse[5];
	var arrtmp = query.split("&");
	var queryMap = new HashMap();
	for (i = 0; i < arrtmp.length; i++) {
		num = arrtmp[i].indexOf("=");
		if (num > 0) {
			name = arrtmp[i].substring(0, num);
			value = arrtmp[i].substr(num + 1);
			queryMap.put(name, value);
		}
	}
	return queryMap;
}