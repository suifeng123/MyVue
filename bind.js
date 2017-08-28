function bind(fn,ctx){
	//使用闭包
	function boundFn(a){
		var l = arguments.length;
		return l 
		    ? l > 1
		       ? fn.apply(ctx,arguments)
		          : fn.call(ctx,a)
		        :fn.call(ctx)
	}
	// 记录原始的长度
	boundFn._length = fn.length;
	return boundFn;
}

var obj = {
	name: 'Function f1',
	showName: function(a){
		console.log('函数的名字是:'+a);
	}
};

var obj2 = {
	name: 'Function f2'
};

bind(obj.showName,obj2)(obj2.name);