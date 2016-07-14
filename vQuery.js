function isFunction(x){//判断是否是真正的
	return Object.prototype.toString.call(x)==='[object Function]';
}
