'use strict';
function isFunction(x) {//判断是否是真正的
	return Object.prototype.toString.call(x) === '[object Function]';
};

var map = Array.prototype.map ? function (a, f) { return a.map(f) } : function (a, f) {//兼容ES3的map方法

	var result = [];
	for (var i = 0, len = a.length; i < len; i++) {
		if (i in a) result[i] = f.call(null, a[i], i, a);
	}
	return result;

};

var reduce = Array.prototype.reduce ? function (a, f, initial) {//兼容ES3的reduce方法
	if (arguments.length > 2) {
		return a.reduce(f, initial)
	} else {
		return a.reduce(f);
	}
} : function (a, f, initial) {
	var i = 0, len = a.length, accumulator;
	if (arguments.length > 2) accumulator = initial;
	else {
		if (len == 0) throw TypeError();
		while (i < len) {
			if (i in a) {
				accumulator = a[i++];
				break;
			} else {
				i++;
			}
		}
		if (i == len) throw TypeError();
	}

	while (i < len) {
		if (i in a) {
			accumulator = f.call(undefined, accumulator, a[i], i, a);
			i++;
		}
	}
	return accumulator;
};

function not(f) { //not
	return function () {
		var result = f.apply(this, arguments);
		return !result;
	};
};

var even = function (x) {// 判断 a 是否为偶数的函数
	return x % 2 === 0;
};

function mapper(f) {//mapper
	return function (a) { return map(a, f) };
};

function compose(f, g) {//return new function
	return function () {
		return f.call(this, g.apply(this, arguments));
	}
};

function array(a, n) { return Array.prototype.slice.call(a, n || 0); }

function partialLeft(f/*, ... */) {//这个函数的实参传递至左侧
	var args = arguments;
	return function () {
		var a = array(args, 1);
		a = a.concat(array(arguments));
		return f.apply(this, a);
	}
};

function partialRight(f /*, ...*/) {//这个函数的实参传递至右侧
	var args = arguments;
	return function () {
		var a = array(arguments);
		a = a.concat(array(args, 1));
		return f.apply(this, a);
	}
};

function partial(f/*, ...*/) {
	var args = arguments;
	return function () {
		var a = array(args, 1);
		var i = 0, j = 0;
		for (; i < a.length; i++) {
			if (a[i] === undefined) a[i] = arguments[j++];
			a = a.concat(array(arguments, j));
			return f.apply(this, a);
		}
	}
};

function memorize(f) {//返回f（） 的带有记忆功能的版本
	var cache = {};

	return function () {
		var key = arguments.length + Array.prototype.join.call(arguments, '');
		if (key in cache) return cache[key];
		else return cache[key] = f.apply(this, arguments);
	}

};

function inherit(p) { //
	if (p == null) throw TypeError();
	if (Object.cretat) return Object.cretat(p);
	var t = typeof p;
	if (t !== 'object' && t !== 'function') throw TypeError();

	function f() { };
	f.prototype = p;
	return new f();
};

function extend(o, p) {//扩展
	for (var prop in p) {
		o[prop] = p[prop]
	}
	return o;
};

function Complex(real, imaginary) {//创建虚数和实数的对象
	if (isNaN(real) || isNaN(imaginary)) throw new TypeError();
	this.r = real;
	this.i = imaginary;
};

Complex.prototype.add = function (that) {//返回一个新的计算和值的复数对象
	return new Complex(this.r + that.r, this.i + that.i);
};

Complex.prototype.mul = function (that) {//当前复数乘以另一个复数，并返回一个新的计算乘积之后的复数对象
	return new Complex(this.r * that.r - this.i * that.i, this.r * that.i + this.i * that.r);
};

Complex.prototype.mag = function () {//计算复数的模，复数的模定义为原点到复平面的距离
	return Math.sqrt(this.r * this.r + this.i * this.i);
};

Complex.prototype.neg = function () {//复数的求负运算
	return new Complex(-this.r, -this.i);
};

Complex.prototype.toString = function () {//将复数对象转换为一个字符串
	return '{' + this.r + ',' + this.i + '}';
};

Complex.prototype.equals = function (that) {
	return that != null &&
		that.constructor === Complex &&
		this.r === that.r && this.i === that.i;
};

Complex.ZERO = new Complex(0, 0);

Complex.ONE = new Complex(1, 0);

Complex.I = new Complex(0, 1);

Complex.parse = function (s) {
	try {
		var m = Complex._format.exec(s);
		return new Complex(parseFloat(m[1]), parseFloat(m[2]));
	} catch (x) {
		throw new TypeError('Can\'t parse' + s + 'as a complex number.');
	}
};

Complex._format = /^\{([^,]+),([^}]+)\}$/;

Complex.prototype.conj=function(){ return new Complex(this.r, -this.i)};

if(!Function.prototype.bind){
	Function.prototype.bind=function(){}
};

Number.prototype.time=function(f, context){
	var n=Number(this);
	for(var i=0; i<n; i++) f.call(context, i);
}

String.prototype.trim=String.prototype.trim || function(){
	if(!this) return this;
	return this.replace(/^\s+|\s+$/g, '');
};

Function.prototype.getName=function(){
	return this.name || this.toString().match(/function\s*([^()*]\(/)[1];
};

function typeAndVule(x){ //9.5.2 constructor 属性检测
	if(x==null) return 'Null';

	switch(x.constructor){
		case Number: return 'Number' + x;
		case String: return 'String:"' + x +'"';
		case Date: return 'Date:' + x;
		case RegExp: return 'RegExp: '+x;
		case Complex: return 'Complex: '+x;
	}

};

function type(o){  //9-4 以字符串的形式返回o的类型//

	var t, c, n; //type, class, name//
	//处理 null 和NaN的情况//
	if(o===null) return 'null';
	if(o!==o) return 'NaN';

	//返回typeof 的值不是Object 则使用这个值//
	if((c=classof(o)) !=='Object') return c;

	//如果对象构造函数的名字存在的话，则返回它//
	if(o.constructor && typeof o.constructor==='function' && (n=o.constructor.getName())){ return n}

	//其他的类型都无法判别，一律返回object//
	return 'Object';
}

function classof(o){ //返回对象的类//
	return Object.prototype.toString.call(o).slice(8, -1)
};

function quacks(o/*, ... */){
	for(var i=1; i<arguments.length; i++){
		var arg=arguments[i];
		switch(typeof arg){

			case 'string':
				 if(typeof o[arg] !=='function') return false;
				 continue;

			case 'function':
				  arg=arg.prototype;

			case 'object':
				  for(var m in arg){
					  if(typeof arg[m]!=='function') continue;
					  if(typeof o[m]=='function') return false;
				  }
		}
	}
	return true;
};

//值的任意集合
//这是一个构造函数 集合数据保存在对象的属性里， 集合中值的个数//
function Set(){
	this.values={};
	this.n=0;
	this.add.apply(this, arguments); //把所有参数都添加进这个集合
}

//将每个参数都添加至集合中//
Set.prototype.add=function(){
	for(var i=0; i<arguments.length; i++){
		var val=arguments[i], str=Set._v2s(val);

		if(!this.values.hasOwnProperty(str)){
			this.values[str]=val;
			this.n++;
		}

	}
	return this;
};

//从集合删除元素，这些元素由参数指定//
Set.prototype.remove=function(){
	for(var i=0; i<arguments.length; i++){
		var str=Set._v2s(arguments[i]);
		if(this.values.hasOwnProperty(str)){
			delete this.values[str];
			this.n--;
		}
	}
	return this;
};

//如果集合包含这个值，则返回true 否则，返回false//
Set.prototype.contains=function(values){
	return this.values.hasOwnProperty(Set._v2s(value));
};

//返回集合的大小//
Set.prototype.size=function(){
	return this.n;
};

//遍历集合中的所有元素，在指定的上下文中调用f//
Set.prototype.foreach=function(f, context){
	for(var s in this.values){
		if(this.values.hasOwnProperty(s))
		f.call(context, this.values[s]);
	}
};

//这是一个内部函数，用以将任意JavaScript值和唯一的字符串对应起来//
Set._v2s=function(val){
	switch(val){
		case undefined: return 'u';
		case null: return 'n';
		case true: return 't';
		case false: return 'f';
		default:switch(typeof val){
			case 'number': return '#'+val;
			case 'string': return '"'+val;
			default: return '@'+objectId(val);
		}
	}

	function objectId(o){
		var prop='[**objectid**]';
		if(!o.hasOwnProperty(prop)){
			o[prop]=Set._v2s.next++;

		}
		return o[prop];
	}
};

function enumeration(namesToValues){
	//
	var enumeration=function(){ throw 'can\'t instantiate Enumerations'; };
	var proto=enumeration.prototype={
		constructor:enumeration,
		toString:function(){return this.name; },
		valueOf:function(){ return this.value; },
		toJSON:function(){ return this.name; }
	};

	//用以存放枚举对象的数组
	enumeration.values=[];

	//现在创建新类型的实例
	for(name in namesToValues){
		var e = inherit(proto);
		e.name=name;
		e.value=namesToValues[name];
		enumeration[name]=e;
		enumeration.values.push(e);
	}

	//一个类方法，用来对类的实例进行迭代
	enumeration.foreach=function(f, c){
		for(var i=0; i<this.values.length; i++){
			f.call(c, this.values[i]);
		}
	};
	return enumeration;
};

extend(Set.prototype, {

	toString:function(){
		var s='{',
		i=0;
		this.foreach(function(v){ s+=((i++>0) ? ',' :'') +v; });
		return s+'}';

	},
	//类似toString， 但是对于所有的值都将调用toLocalString（）
	toLocalString:function(){
		var s='{', i=0;
		this.foreach(function(v){
			if(i++>0) s+=', ';
			if(v==null) s+=v;
			else s+=v.toLocalString();
		})

		return s+ '}';
	},
	//将集合转换为值数组
	toArray:function(){
		var a=[];
		this.foreach(function(v){
			a.push(v);
		});
		return a;
	}
});

//对于要从JSON转为字符串的集合都被当做数组来对待
Set.prototype.toJSON=Set.prototype.toArray;

Set.prototype.equals=function(that){
	if(this===that) return true;

	//如果that 对象不是集合，它和this不相等
	//我们用到instanceof 使得这个方法可以用于set的任何子类
	//或者可以通过 this.constructor==that.constructor 来加强检查的严格程度
	if(!(that instanceof Set)) return false;

	if(this.size() != that.size()) return false;

	try{
		this.foreach(function(v){ if(!that.contains(v)) throw false; });
		return true;
	}catch(x){
		if(x===false) return false;
		throw x;
	}
};

var generic={
	toString:function(){
		var s='[';
		var n=0;
		if(this.constructor && this.constructor.name)
		s+=this.constructor.name + ': ';

		for(var name in this){
			if(!this.hawOwnProperty(name)) continue;
			var value=this[name];
			if(typeof value ==='function') continue;
			if(n++) s+=', ';
			s+=name + '=' + value;
		}

		return s+']';

	},
	//通过比较this和that的构造函数和实例属性来判断它们是否相等
	//这种方法只适合于那些实例属性是原始值的情况，原始值可以通过‘===’来比较
	//这里还处理一种特殊情况，就是忽略有set类添加的特殊属性

	equals:function(that){
		if(that==null) return false;
		if(this.constructor !==that.constructor) return false;
		for(var name in this){
			if(name ==="|**objectid**|") continue;
			if(!this.hasOwnProperty(name)) continue;
			if(this[name] !==that[name]) return false;
		}
		return true;
	}
};

function Range(from, to){
	//不要将端点保存为对象的属性，
	//相反定义存取器函数来返回端点的值
	//这些值都保存在闭包中

	this.from=function(){ return from;}
	this.to  =function(){ return to ;}

}

Range.prototype={
	constructor:Range,

	includes:function(x){ return this.from() <= x && x<=this.to()},

	foreach:function(f){
		for(var x=Math.ceil(this.from()), max=this.to(); x<=max; x++) f(x);
	},

	toString:function(){ return '(' +this.from() + '...' +this.to() +')'}
}

//ajax
var ajax = (function () {

            function createXhr() {
                var xmlhttp;
                if (window.XMLHttpRequest) {
                    var xhr = new XMLHttpRequest();
                }
                return xhr;
            }

            function serializeData(option) {
                var data = option.data, dataT = [], sendData = "";
                if (data) {
                    if (typeof data === "String") {
                        sendData = data;
                    } else {
                        for (var x in data) {
                            dataT.push(x + "=" + data[x]);
                        }
                        sendData = dataT.join("&");
                    }
                }
                return sendData;
            }

            function ajax(option) {

                var xhr = createXhr(), x;

                if (!xhr) {
                    return;
                }

                var async = typeof option.async === "undefined" ? true : option.async;

                xhr.onreadystatechange = function () {
                    if (xhr.readyState == 4) {
                        if ((xhr.status >= 200 && xhr.status < 300) || xhr.status == 304) {
                            if (typeof option.success === "function") {
                                option.success(xhr.responseText);
                            }
                        } else {
                            if (typeof option.error === "function") {
                                option.error(xhr);
                            }
                        }

                    }
                }

                xhr.open(option.method, option.url, async);

                if (option.header) {
                    for (x in option.header) {
                        xhr.setRequestHeader(x, option.header[x]);
                    }
                }

                var sendData = serializeData(option);

                xhr.send(sendData);
            }

            return ajax;

        })();

        ajax({
            url: "/meJs/README.md",
            method: "GET",
            data: {name: "贺林"},
            header: {'Content-Type': 'application/x-www-form-urlencoded','Content-Type':'text/xml'},
            success: function (data) {
                console.log(data)
            },
            error: function (xhr) {
                console.log(xhr);
            }
        });
