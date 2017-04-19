/**
 * Created by Administrator on 2017/4/18.
 */
(function (global,factory) {
    typeof  exports === 'object' && typeof module !== 'undefined' ? module.exports = factory():
        typeof define === 'function' && define.amd? define(factory):
            (global.Vue = factory());
})(this,function () { 'use strict'

    function _toString(val) {
      return val == null ?'':typeof val === 'object'?JSON.stringify(val,null,2):String(val)

    }

    function toNumber(val) {
       var n = parseFloat(val);
       return isNaN(n)?val:n

    }

    function makeMap(str,expectsLowerCase) {
        var map = Object.create(null);
        var list = str.split(',');
        for(var i=0;i<list.length;i++){
            map[list[i]] = true;
        }

        return expectsLowerCase?function (val) {
            return map[val.toLocaleLowerCase()];

            }:function (val) {
                return map[val];

            }

    }

    /**
     * 检查一个标志是否是内置的标志
     */

    var isBuiltInTag = makeMap('slot,component',true);
    /**
     * 从一个数移除出数组
     */

    function remove(arr,item) {
        if(arr.length){
            var index = arr.indexOf(item);
        }
        if(index>-1){
            arr.splice(index,1);
        }

    }
    //检测对象是否具有某个属性
    var hasOwnProperty = Object.prototype.hasOwnProperty;  //将一个属性赋予

    function hasOwn(obj,key) {
        return hasOwnProperty.call(obj,key)
    }
    //检测一个值是否是原始值
    function isPrimitive (value) {
        return typeof  value === 'string' || typeof value === 'number'
    }
    //创建一个 缓存版的纯粹的函数
    function cached(fn) {
        var cache = Object.create(null);
        return (function cachedFn(str) {
            var hit = cache[str];
            return hit || (cache[str] = fn(str))

        })
    }

})
