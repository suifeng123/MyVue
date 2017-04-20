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

    var camelizeRE = /-(\w)/g;
    var camelize = cached(function (str) {
        return str.replace(hyphenateRE,'$1-$2')
            .replace(hyphenateRE,'$1-$2')
            .toLowerCase()
    });
   //简易版的绑定，比原生的绑定要快
    function bind(fn,ctx) {
        function boundFn(a) {
            var l = arguments.length;
            return l?l>1?fn.apply(ctx,arguments):fn.call(ctx,a):fn.call(ctx)

        }
        boundFn._length = fn.length;
        return boundFn
    }
    //将一个与数组相似的数组转化为真正的数组
    function toArray(list,start) {
        start = start || 0;
        var i = list.length- start;
        var ret = new Array(i);
        while(i--){
            ret[i] = list[i+start];
        }
    }
    //将属性混入对象中
    function extend (to,from) {
        for(var key in from)
            to[key] = from[key]
        return to;
    }
    
    function  isObject(obj) {
        return obj !== null  && typeof obj === 'object'
    }

    var toString = Object.prototype.toString;
    var OBJECT_STRING = '[object Object]';

    function isPlainObject(obj) {
        return toString.call(obj) === OBJECT_STRING

    }

    function toObject(arr) {
        var res = {};

        for(var i=0;i<arr.length;i++){
            if(arr[i]){
                extend(res,arr[i]);
            }
        }
       return res;
    }
     //一个不做任何操作的函数
    function noop(){}
   //执行一个函数，总是返回false
    var no = function () {
        return false;
    };

    var identity = function (_) {
        return _;

    };

    //创建一个静态的keys
    function getStaticKeys(modules) {
        return modules.reduce(function (keys,m) {
            return keys.concat(m.staticKeys || [])
        },[]).join(',')
    }

    function looseEqual(a,b) {
        var isObjectA = isObject(a);
        var isObjectB = isObject(b);
        if(isObjectA && isObjectB){
            try{
                return JSON.stringify(a) === JSON.stringify(b)
            }catch (e){
                return a === b
            }
        }else if(!isObjectA && !isObjectB){
            return String(a) === String(b)
        }else {
            return false
        }
    }

    function looseIndexOf(arr,val) {
        for(var i=0;i<arr.length;i++){
         if(looseEqual(arr[i],val)){return i}
        }
        return -1
    };

//确保一个函数只被调用一次
    function once(fn) {
        var called = false;
        return function () {
            if(!called){
                called = true;
                fn();
            }
        }

    }

    var config = {
        optionMergeStrategies: Object.create(null),
        silent: false,
        productionTip:"development"!=="production",
        devtools:"development"!=="production",
        performance: false,
        errorHandler:null,
        ignoredElements: [],
        keyCodes: Object.create(null),
        isReservedTag:no,
        isUnknowElement:no,
        getTagNamespace: noop,
        mustUseProp:no,
        _assetTypes: [
          'component',
            'directive',
            'filter'
        ],
        _lifecycleHooks: [
            'beforeCreate',
            'created',
            'beforeMount',
            'updated',
            'beforeDestroy',
            'destroyed',
            'activated',
            'deactivated'
        ],

        _maxUpdateCount: 100


    };

    var emptyObject = Object.freeze({});
    
    function isReserved(str) {
        var c = (str+'').charCodeAt(0);
        return c === 0x24 || c === 0x5F
    }

    function def(obj,key,val,enumerable) {
        Object.defineProperties(obj,key,{
            value:val,
            enumerable: !!enumerable,
            writable:true,
            configurable:true
        })
    }

    var bailRE = /[^\w.$]/;
    
    function parsePath(path) {
        if(bailRE.test(path)){
            return
        }
        var segments = path.split('.');
        return function (obj) {
            for(var i=0;i<segments.length;i++){
                if(!obj){return}
                obj = obj[segments[i]];
            }
            return obj;
        }
    }

    var hasProto = '__proto__' in {};

    var inBrowser = typeof window !== 'undefined';
    var UA = inBrowser && window.navigator.userAgent.toLowerCase();
    var isIE = UA && /msie|trident/.test(UA);
    var isIE9 = UA && UA.indexOf('msie 9.0') > 0;
    var isEdge = UA && UA.indexOf('edge/') > 0;
    var isAndroid = UA && UA.indexOf('android') > 0;
    var isIOS = UA && /iphone|ipad|ipod|ios/.test(UA);
    var isChrome = UA && /chrome\/\d+/.test(UA) && !isEdge;

// this needs to be lazy-evaled because vue may be required before
// vue-server-renderer can set VUE_ENV
    var _isServer;
    var isServerRendering = function () {
        if (_isServer === undefined) {
            /* istanbul ignore if */
            if (!inBrowser && typeof global !== 'undefined') {
                // detect presence of vue-server-renderer and avoid
                // Webpack shimming the process
                _isServer = global['process'].env.VUE_ENV === 'server';
            } else {
                _isServer = false;
            }
        }
        return _isServer
    };

// detect devtools
    var devtools = inBrowser && window.__VUE_DEVTOOLS_GLOBAL_HOOK__;

    /* istanbul ignore next */
    function isNative (Ctor) {
        return /native code/.test(Ctor.toString())
    }

    var hasSymbol =
        typeof Symbol !== 'undefined' && isNative(Symbol) &&
        typeof Reflect !== 'undefined' && isNative(Reflect.ownKeys);

    /**
     * Defer a task to execute it asynchronously.
     */
    var nextTick = (function () {
        var callbacks = [];
        var pending = false;
        var timerFunc;

        function nextTickHandler () {
            pending = false;
            var copies = callbacks.slice(0);
            callbacks.length = 0;
            for (var i = 0; i < copies.length; i++) {
                copies[i]();
            }
        }

        // the nextTick behavior leverages the microtask queue, which can be accessed
        // via either native Promise.then or MutationObserver.
        // MutationObserver has wider support, however it is seriously bugged in
        // UIWebView in iOS >= 9.3.3 when triggered in touch event handlers. It
        // completely stops working after triggering a few times... so, if native
        // Promise is available, we will use it:
        /* istanbul ignore if */
        if (typeof Promise !== 'undefined' && isNative(Promise)) {
            var p = Promise.resolve();
            var logError = function (err) { console.error(err); };
            timerFunc = function () {
                p.then(nextTickHandler).catch(logError);
                // in problematic UIWebViews, Promise.then doesn't completely break, but
                // it can get stuck in a weird state where callbacks are pushed into the
                // microtask queue but the queue isn't being flushed, until the browser
                // needs to do some other work, e.g. handle a timer. Therefore we can
                // "force" the microtask queue to be flushed by adding an empty timer.
                if (isIOS) { setTimeout(noop); }
            };
        } else if (typeof MutationObserver !== 'undefined' && (
                isNative(MutationObserver) ||
                // PhantomJS and iOS 7.x
                MutationObserver.toString() === '[object MutationObserverConstructor]'
            )) {
            // use MutationObserver where native Promise is not available,
            // e.g. PhantomJS IE11, iOS7, Android 4.4
            var counter = 1;
            var observer = new MutationObserver(nextTickHandler);
            var textNode = document.createTextNode(String(counter));
            observer.observe(textNode, {
                characterData: true
            });
            timerFunc = function () {
                counter = (counter + 1) % 2;
                textNode.data = String(counter);
            };
        } else {
            // fallback to setTimeout
            /* istanbul ignore next */
            timerFunc = function () {
                setTimeout(nextTickHandler, 0);
            };
        }

        return function queueNextTick (cb, ctx) {
            var _resolve;
            callbacks.push(function () {
                if (cb) { cb.call(ctx); }
                if (_resolve) { _resolve(ctx); }
            });
            if (!pending) {
                pending = true;
                timerFunc();
            }
            if (!cb && typeof Promise !== 'undefined') {
                return new Promise(function (resolve) {
                    _resolve = resolve;
                })
            }
        }
    })();

    var _Set;
    /* istanbul ignore if */
    if (typeof Set !== 'undefined' && isNative(Set)) {
        // use native Set when available.
        _Set = Set;
    } else {
        // a non-standard Set polyfill that only works with primitive keys.
        _Set = (function () {
            function Set () {
                this.set = Object.create(null);
            }
            Set.prototype.has = function has (key) {
                return this.set[key] === true
            };
            Set.prototype.add = function add (key) {
                this.set[key] = true;
            };
            Set.prototype.clear = function clear () {
                this.set = Object.create(null);
            };

            return Set;
        }());
    }

    //一些标记

    var warn = noop;
    var tip = noop;
    var formatComponentName;

    {
        var hasConsole = typeof console !== 'undefined';
        var classifyRE = /(?:^|[-_])(\w)/g;
        var classify = function (str) {
            return str.replace(classifyRE,function (c) {
                return c.toUpperCase();

            }).replace(/[-_]/g,'');

        };

        warn = function (msg,vm) {
            if(hasConsole && (!config.silent)){
                console.error("[Vue warn]:"+msg+" "+(
                    vm?formatLocation(formatComponentName(vm):" ")
                    ));
            }
        };

        tip = function (msg,vm) {
            if(hasConsole && (!config.slient )){
                console.warn("[Vue tip]:"+msg + " "+(
                    vm?formatLocation(formatComponentName(vm)):" ")
                    );
            }

        };

        formatComponentName = function (vm,includeFile) {
            if(vm.$root == vm){
                return '<Root>'
            }
            var name = typeof vm === 'string'
            ?vm : typeof vm === 'function' && vm.options
            ? vm.options.name : vm._isVue ? vm.$options.name || vm.$options._componentTag
                        : vm.name;
            var file = vm._isVue && vm.$options.__file;
            if(!name && file){
                var match = file.match(/([^/\\]+)\.vue$/);
                name = match && match[1];
            }
            return (
                (name ? ("<" + (classify(name))+">"):"<Anonymous>"+(file && includeFile!== false ? (" at "+file):""))
            )
        };

        var formatLocation = function (str) {
            if(str === "<Anonymous>") {
                str += "- use the \"name \" option for better debugging messages.";
            }
            return ("\n (found in" + str +")")
        }

    }

    var uid$1 = 0;

    var Dep = function Dep() {
        this.id = uid$1++;
        this.subs = [];

    };

    Dep.prototype.addSub = function addSub(sub) {
        this.subs.push(sub);
    };

    Dep.prototype.removeSub = function removeSub(sub) {
            remove(this.subs,sub);
    };

    Dep.prototype.depend = function depend() {
         if(Dep.target){
             Dep.target.addDep(this);
         }
    };

  Dep.prototype.notify = function notify() {
    //首先固定这个需要变化的序列的所要固定的数组
      var subs = this.subs.slice();
      for(var i=0,l=subs.length;i<l;i++){
          subs.update();
      }
  };

  Dep.target = null;
  var targetStack = [];

  function pushTarget(_target) {
      if(Dep.target) {
          targetStack.push(Dep.target);
      }
      Dep.target = _target;

  }
  
  function popTarget() {
      Dep.target = targetStack.pop();
  }

  var arrayProto = Array.prototype;

  var arrayMethods = Object.create(arrayProto);
  ['push','pop','shift','unshift','splice','sort','reverse']
      .forEach(function (method) {
          //缓存一个原始的方法
          var oiginal = arrayProto[method];
          def(arrayMethods,method,function mutator() {
              var arguments$1 = arguments;
              var i = arguments.length;
              var args = new Array(i);
              while(i--) args[i] = arguments$1[i];
              var result = oiginal.apply(this,args);
              var ob = this.__ob__;
              var inserted;
              switch (method){
                  case 'push':
                      inserted = args;
                      break
                  case 'unshift':
                      inserted = args;
                      break
                  case 'splice':
                      inserted = args.slice(2);
                      break
              }
              if(inserted){ ob.observeArray(inserted);}
              //通知变化
              ob.dep.notify();
              return result
          });
      });

  var arrayKeys = Object.getOwnPropertyNames(arrayMethods);

 var observerState = {
     shouldConvert: true,
     isSettingProps: false
 };

 var Observer = function Observer(value) {
     this.value = value;
     this.dep = new Dep();
     this.vmCount = 0;
 }



})
