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
     def(value,'__obj__',this);
     if(Array.isArray(value)){
         var augment = hasProto?protoAugment:copyAugment;
         augment(value,arrayMethods,arrayKeys);
     }else{
         this.walk(value);
     }
 }

 Observer.prototype.walk = function walk(obj) {
    var keys = Object.keys(obj);
    for(var i=0;i<keys.length;i++){
        defineReactive$$1(obj,keys[i],obj[keys[i]]);
    }
 };

       //监控一个数组的选项
    Observer.prototype.observeArray = function observeArray(items) {
         for(var i=0,l = items.length;i<l;i++){
             observer(items[i]);
         }

    };

    function protoAugment(target,src) {
        target.__proto__ = src;

    }

   function copyAugment(target,src,keys) {
       for(var i=0,l=keys.length;i<l;i++){
           var key = keys[i];
           def(target,key,src[key]);
       }
   }

    /**
     * 创造一个值得监控器实例
     * 如果成功监控的话，返回一个新的监控值
     * 或者返回一个存在的监控器如果这个值已经存在了
     */

    function observe(value,asRootData) {
        if(isObject(value)) return;
        var ob;
        if(hasOwn(value,'__ob__')&& value.__ob__ instanceof Observer){
            ob = value.__ob__;
        }else if(
            observerState.shouldConvert &&
                !isServerRendering() &&
            (Array.isArray(value)|| isPlainObject(value))&&
                Object.isExtensible(value)&& !value._isVue
        ){
            ob = new Object(value);

        }

        if(asRootData && ob){
                ob.vmCount++;
        }
        return ob;

    }

    function defineReactive$$1(
        ob,
        key,
        val,
        customSetter
    ) {
        var dep = new Dep();
      var property = Object.getOwnPropertyDescriptor(obj,key);

    }

   //计算属性的源码
    function initComputed (vm,computed) {
         var watchers = vm._computedWatchers = Object.create(null);

         for(var key in computed){
             //获取所有的需要计算的属性
             var userDef = computed[key];
             var getter = typeof userDef === 'function'? userDef:userDef.get;

             {
                 if(getter === undefined){
                     warn(
                         ("No getter function has been defined for computed property \"" + key + "\"."),
                         vm
                     );
                     getter = noop;
                 }
             }
             //创建内部非监视器用于计算属性
             watchers[key] = new Watch(vm,getter,noop,computedWatcherOptions);
             //组件定义的计算属性已经在组件属性上的被定义了  我们只需要
             if(!(key in vm)){
                 defineComputed(vm,key,userDef);
             }
         }
    }

    function definedComputed (target,key,userDef){
        if(typeof userDef === 'function') {
            sharedPropertyDefinition.get = createComputedGetter(key);
            sharedPropertyDefinition.set = noop;
        }else {
            sharedPropertyDefinition.get = userDef.get?userDef.cache !== false ?createComputedGetter(key):userDef.get:noop;
            sharedPropertyDefinition.set = userDef.set?userDef.set:noop;
        }
        Object.defineProperties(target,key,sharedPropertyDefinition);
    }

    function createComputedGetter(key) {
        return function computedGetter() {
            var watcher = this._computedWatchers && this._computedWatchers[key];
            if(watcher) {
                if(watcher.dirty){
                    watcher.evalute();
                }
                if(Dep.target) {
                    watcher.depend();
                }
                return watcher.value;
            }
        }

    }

    //检测devtools工具
    var devtools = inBrowser && window.__VUE_DEVTOOLS_GLOBAL_HOOK__;

    function isNative(Ctor){
            return /native code/.test(Ctor.toString())
    }

    var hasSymbol = typeof Symbol !== 'undefined' && isNative(Symbol) &&
                    typeof Reflect !== 'undefined' && isNative(Reflect.ownKeys);

    //延迟一个异步任务
    var nextTick = (function () {
        var callbacks = [];
        var pending = false;
        var timerFunc;
        
        function nextTickHandler() {
            pending = false;
            var copies = callbacks.slice(0);//数组的深度复制
            callbacks.length = 0;
            for(var i = 0; i < copies.length; i++){
                copies[i]();
            }
        }

        if(typeof Promise !== 'undefined' && isNative(Promise)){
            var p = Promise.resolve();
            var logError = function (err) {
                console.log(err);

            }
            timerFunc = function () {
                p.then(nextTickHandler).catch(logError);
                if(isIOS) { setTimeout(noop); }
            };
        }else if(typeof MutationObserver !== 'undefined' && (isNative(MutationObserver)||
            MutationObserver.toString() === '[object MutationObserverConstructor]')){
            var counter = 1;
            var observer = new MutationObserver(nextTickHandler);
            var textNode = document.createTextNode(String(counter));
            observer.observe(textNode,{
                characterData: true
            });
            timerFunc = function () {
                counter = (counter + 1)%2;
            };
        }else {
            timerFunc = function () {
                setTimeout(nextTickHandler,0);

            }
        }

        return function queueNextTick(cb,ctx) {
            var _resolve;
            callbacks.push(function () {
                if(cb) { cb.call(ctx); }
                if(_resolve){ __resolve(ctx); }
            });
            if(!pending){
                pending = true;
                timerFunc();
            }

            if(!cb && typeof Promise !== 'undefined'){
                return new Promise(function (resolve) {
                    _resolve = resolve;

                })
            }

        }

        
    })();

    var _Set;

    if(typeof Set !== 'undefined' && isNative(Set)){
        _Set = Set;
    }else  {
        _Set = (function () {
            function Set() {
                this.set = Object.create(null);
            }
            Set.prototype.has = function has(key) {
                return this.set[key] == true;
            }
            Set.prototype.add = function add(key) {
                this.set[key] = true;
            }
            Set.prototype.clear = function clear() {
                this.set = Object.create(null);
            }

            return Set;
        }());
    }

    var warn = noop;
    var tip = noop;
    var formatComponentName;

    {
       var hasConsole = typeof console !== 'undefined';
       var classifyRE = /(?:^|[-_])(\w)/g;
       var classify = function(str) {
           return str.replace(classifyRE,function (c) {
               return c.toUpperCase();

           }).replace(/[-_]/g,'');
       };
        warn = function(msg,vm) {
            if(hasConsole && (!config.silent)){
                console.error("[Vue warn]:" + msg + " "+(
                    vm?formatLocation(formatComponentName(vm)):''
                    ) );
            }
        };

        tip = function (msg,vm) {
            if(hasConsole && (!config.slient)) {
                console.warn("[Vue tip:]"+msg+" "+(
                    vm?formatLocation(formatComponentName(vm)):" "
                    ));
            }

        };

        formatComponentName = function(vm,includeFile) {
            if(vm.$root === vm){
                return '<Root>'
            }
            var name = typeof vm === 'string'
            ?vm : typeof vm === 'function' && vm.options
            ? vm.options.name : vm._isVue ? vm.$options.name || vm.$options._componentTag:vm.name;
            var file = vm._isVue && vm.$options.__file;
            if (!name && file) {
                var match = file.match(/([^/\\]+)\.vue$/);
                name = match && match[1];
            }

            return (
                (name ? ("<" + (classify(name)) + ">") : "<Anonymous>") +
                (file && includeFile !== false ? (" at " + file) : '')
            )
        };

        var formatLocation = function (str) {
            if (str === "<Anonymous>") {
                str += " - use the \"name\" option for better debugging messages.";
            }
            return ("\n(found in " + str + ")")
        };



    }

    var arrayProto = Array.prototype;
    var arrayMethods = Object.create(arrayProto);[
        'push',
        'pop',
        'shift',
        'unshift',
        'splice',
        'sort',
        'reverse'
    ]
        .forEach(function (method) {
            // cache original method
            var original = arrayProto[method];
            def(arrayMethods, method, function mutator () {
                var arguments$1 = arguments;

                // avoid leaking arguments:
                // http://jsperf.com/closure-with-arguments
                var i = arguments.length;
                var args = new Array(i);
                while (i--) {
                    args[i] = arguments$1[i];
                }
                var result = original.apply(this, args);
                var ob = this.__ob__;
                var inserted;
                switch (method) {
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
                if (inserted) { ob.observeArray(inserted); }
                // notify change
                ob.dep.notify();
                return result
            });
        });
    /*   */
    var arrayKeys = Object.getOwnPropertyNames(arrayKeys);

    var observerState = {
        shouldConvert: true,
        isSettingProps: false
    };
 var Observer = function Observer(value) {
     this.value = value;
     this.dep = new Dep();
     this.vmCount = 0;
     def(value,'__obj__',this);
     if(Array.isArray(value)) {
         var augment = hasProto ? protoAugment:copyAugment;
         augment(value,arrayMethods,arrayKeys);
         this.observeArray(value);
     }else {
         this.walk(value);
     }
 }

Observer.prototype.walk = function walk(obj) {
    var keys = Object.keys(obj);
    for(var i=0;i<keys.length;i++){
        defineReactive$$1(obj,keys[i],obj[keys[i]]);
    }
}

Observer.prototype.observeArray = function observeArray(items) {
     for(var i=0,l=items.length;i<l;i++){
         observe(items[i]);
     }
};

 function protoAugment (target,src) {
     target.__proto__ = src;

 }

 function copyAugment(target,src,keys) {
     for(var i=0,l=keys.length;i<l;i++){
         var key = keys[i];
         def(target,key,src[key]);
     }

 }
  function observe(value,asRootData) {
     if(!isObject(value)){
         return
     }
     var ob;
     if(hasOwn(value,'__ob__') && value.__ob__ instanceof Observer){
         ob = value.__ob__;
     }else if(observerState.shouldConvert && !isServerRendering() && (Array.isArray(value)|| isPlainObject(value))
     &&Object.isExtensible(value) && !value._isVue){
         ob = new Observer(value);
     }

     if(asRootData && ob){
         ob.vmCount++;
     }
     return ob
  }

  function defineReactive$$1 (
      obj,
      key,
      val,
      customSetter
  ){
     var dep = new Dep();
     var property = Object.getOwnPropertyDescriptor(obj,key);
     if(property && property.configurable === false){
         return
     }
     var getter = property && property.get;
     var setter = property && property.set;
     var childOb = observe(val);
     Object.defineProperty(obj,key,{
         enumberable: true,
        configurable: true,
         get: function reactiveGetter() {
             var value = getter?getter.call(obj):val;
             if(Dep.target){
                dep.depend();
                if(childOb){
                    childOb.dep.depend();
                }
                if(Array.isArray(value)){
                    dependArray(value);
                }
             }
             return value
         },
         set: function reactiveSetter(newVal) {
             var value = getter?getter.call(obj):val;
             if(newVal === value || (newVal!==newVal && value!==value)){
                 return
             }
             if("development" !== 'production' && customSetter){
                 customSetter();
             }
             if(setter){
                 setter.call(obj,newVal);
             }else{
                 val = newVal;
             }
             childOb = observe(newVal);
             dep.notify();
         }
     });
  }
    function set (target, key, val) {
        if (Array.isArray(target) && typeof key === 'number') {
            target.length = Math.max(target.length, key);
            target.splice(key, 1, val);
            return val
        }
        if (hasOwn(target, key)) {
            target[key] = val;
            return val
        }
        var ob = (target ).__ob__;
        if (target._isVue || (ob && ob.vmCount)) {
            "development" !== 'production' && warn(
                'Avoid adding reactive properties to a Vue instance or its root $data ' +
                'at runtime - declare it upfront in the data option.'
            );
            return val
        }
        if (!ob) {
            target[key] = val;
            return val
        }
        defineReactive$$1(ob.value, key, val);
        ob.dep.notify();
        return val
    }

    function del (target, key) {
        if (Array.isArray(target) && typeof key === 'number') {
            target.splice(key, 1);
            return
        }
        var ob = (target ).__ob__;
        if (target._isVue || (ob && ob.vmCount)) {
            "development" !== 'production' && warn(
                'Avoid deleting properties on a Vue instance or its root $data ' +
                '- just set it to null.'
            );
            return
        }
        if (!hasOwn(target, key)) {
            return
        }
        delete target[key];
        if (!ob) {
            return
        }
        ob.dep.notify();
    }

    function dependArray (value) {
        for (var e = (void 0), i = 0, l = value.length; i < l; i++) {
            e = value[i];
            e && e.__ob__ && e.__ob__.dep.depend();
            if (Array.isArray(e)) {
                dependArray(e);
            }
        }
    }

    var strats = config.optionMergeStrategies;

    {
        strats.el = strats.propsData = function (parent,child,vm,key) {
            if(!vm) {
                warn(
                    "option \"" + key + "\" can only be used during instance " +
                    'creation with the `new` keyword.'
                );
            }
            return defaultStrat(parent,child);
        };
    }

    function mergeData(to,from){
        if(!from) {return to}
        var key,toVal,fromVal;
        var keys = Object.keys(from);
        for(var i=0;i<keys.length;i++){
            key = keys[i];
            toVal = to[key];
            fromVal = from[key];
            if(!hasOwn(to,key)){
                set(to,key,fromVal);
            }else if(isPlainObject(toVal) && isPlainObject(fromVal)){
                mergeData(toVal,fromVal);
            }
        }
        return to
    }

    strats.data = function (
        parentVal,
        childVal,
        vm
    ) {
        if (!vm) {
            // in a Vue.extend merge, both should be functions
            if (!childVal) {
                return parentVal
            }
            if (typeof childVal !== 'function') {
                "development" !== 'production' && warn(
                    'The "data" option should be a function ' +
                    'that returns a per-instance value in component ' +
                    'definitions.',
                    vm
                );
                return parentVal
            }
            if (!parentVal) {
                return childVal
            }
            // when parentVal & childVal are both present,
            // we need to return a function that returns the
            // merged result of both functions... no need to
            // check if parentVal is a function here because
            // it has to be a function to pass previous merges.
            return function mergedDataFn () {
                return mergeData(
                    childVal.call(this),
                    parentVal.call(this)
                )
            }
        } else if (parentVal || childVal) {
            return function mergedInstanceDataFn () {
                // instance merge
                var instanceData = typeof childVal === 'function'
                    ? childVal.call(vm)
                    : childVal;
                var defaultData = typeof parentVal === 'function'
                    ? parentVal.call(vm)
                    : undefined;
                if (instanceData) {
                    return mergeData(instanceData, defaultData)
                } else {
                    return defaultData
                }
            }
        }
    };

    function mergeHook (
        parentVal,
        childVal
    ) {
        return childVal
            ? parentVal
                ? parentVal.concat(childVal)
                : Array.isArray(childVal)
                    ? childVal
                    : [childVal]
            : parentVal
    }

    config._lifecycleHooks.forEach(function (hook) {
        strats[hook] = mergeHook;
    });

    function mergeAssets(parentVal,childVal){
        var res = Object.create(parentVal || null);
        return childVal?extend(res,childVal):res;
    }

    config._assetTypes.forEach(function(type){
        strats[type+'s'] = mergeAssets;
    });

    strats.watch = function (parentVal,childVal) {
        if(!childVal){ return Object.create(parentVal || null)}
        if(!parentVal) {
            return childVal
        }
        var ret = {};
        extend(ret,parentVal);
        for(var key in childVal) {
            var perent = ret[key];
            var child = childVal[key];
            if(parent && Array.isArray(parent)){
                parent = [parent];
            }

            ret[key] = parent ? parent.concat(child):[child];
        }

        return ret;

    }

    strats.props =
        strats.methods =
            strats.computed = function (parentVal, childVal) {
                if (!childVal) { return Object.create(parentVal || null) }
                if (!parentVal) { return childVal }
                var ret = Object.create(null);
                extend(ret, parentVal);
                extend(ret, childVal);
                return ret
            };


    var defaultStrat = function (parentVal, childVal) {
        return childVal === undefined
            ? parentVal
            : childVal
    };

    function checkComponents (options) {
        for(var key in options.components){
            var lower = key.toLowerCase();
            if(isBuiltInTag(lower) || config.isReservedTag(lower)){
                warn(
                    'Do not use built-in or reserved HTML elements as component ' +
                    'id: ' + key
                );
            }
        }
    }

function normalizeProps(options) {
        var props = options.props;
        if(props){return}
        var res = {};
        var i,val,name;
        if(Array.isArray(props)){
            i = props.length;
            while(i--){
                val = props[i];
                if(typeof val === 'string'){
                    name = camelize(val);
                    res[name] = {type:null};
                }else{
                    warn('props must be strings when using arrya syntax.');
                }
            }
        }else if(isPlainObject(props)){
            for(var key in props){
                val = props[key];
                name = camelize(key);
                res[name] = isPlainObject(val)?val:{type:null};
            }
        }
        options.props = res;
}

    function normalizeDirectives (options) {
        var dirs = options.directives;
        if (dirs) {
            for (var key in dirs) {
                var def = dirs[key];
                if (typeof def === 'function') {
                    dirs[key] = { bind: def, update: def };
                }
            }
        }
    }







})
