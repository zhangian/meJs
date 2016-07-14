function isFunction(x){//判断是否是真正的
	return Object.prototype.toString.call(x)==='[object Function]';
};

var map=Array.prototype.map ? function(a, f){return a.map(f)} : function(a,f){//兼容ES3的map方法

	var result=[];
	for(var i=0, len=a.length; i<len; i++){
		if(i in a) result[i]=f.call(null, a[i], i, a);
	}
	return result;

};

var reduce=Array.prototype.reduce ? function(a, f, initial){//兼容ES3的reduce方法
	if(arguments.length>2){
		return a.reduce(f, initial)
	}else{
		return a.reduce(f);
	}
}:function(a, f, initial){
	var i=0, len=a.length, accumulator;
	if(arguments.length > 2) accumulator=initial;
	else{
		if(len==0) throw TypeError();
		while(i<len){
			if( i in a){
				accumulator = a[i++];
				break;
			}else{
				i++;
			}
		}
		if(i==len) throw TypeError();
	}

	while(i<len){
		if(i in a){
			accumulator =f.call(undefined, accumulator, a[i], i, a);
			i++;
		}
	}
	return accumulator;
};

function not(f){ //not
	return function(){
		var result=f.apply(this, arguments);
		return !result;
	};
};

var even=function(x){// 判断 a 是否为偶数的函数
	return x%2===0;
};

function mapper(f){//mapper
	return function(a){ return map(a, f)};
};

function compose(f,g){//return new function
	return function(){
		return f.call(this, g.apply(this, arguments));
	}
};

function array(a, n){ return Array.prototype.slice.call(a, n||0); }

function partialLeft(f/*, ... */){//这个函数的实参传递至左侧
	var args=arguments;
	return function(){
		var a=array(args, 1);
		a=a.concat(array(arguments));
		return f.apply(this, a);
	}
};

function partialRight(f /*, ...*/){//这个函数的实参传递至右侧
	var args=arguments;
	return function(){
		var a=array(arguments);
		a=a.concat(array(args, 1));
		return f.apply(this, a);
	}
};

function partial(f/*, ...*/){
	var args=arguments;
	return function(){
		var a=array(args, 1);
		var i=0, j=0;
		for(; i<a.length; i++){
			if(a[i]===undefined) a[i]=arguments[j++];
		a=a.concat(array(arguments, j));
		return f.apply(this, a);	
		}
	}
}
