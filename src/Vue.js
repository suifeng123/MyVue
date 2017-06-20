/**
 * Created by Administrator on 2017/4/18.
 */
(function (global,factory) {
    typeof  exports === 'object' && typeof module !== 'undefined' ? module.exports = factory():
        typeof define === 'function' && define.amd? define(factory):
            (global.Vue = factory());
})(this,function () {
    'use strict'

    function _toString(val) {
        return val == null ? '' : typeof val === 'object' ? JSON.stringify(val, null, 2) : String(val)

    }

    function toNumber(val) {
        var n = parseFloat(val);
        return isNaN(n) ? val : n

    }

    function makeMap(str, expectsLowerCase) {
        var map = Object.create(null);
        var list = str.split(',');
        for (var i = 0; i < list.length; i++) {
            map[list[i]] = true;
        }

        return expectsLowerCase ? function (val) {
                return map[val.toLocaleLowerCase()];

            } : function (val) {
                return map[val];

            }

    }

    /**
     * 检查一个标志是否是内置的标志
     */

    var isBuiltInTag = makeMap('slot,component', true);

    /**
     * 从一个数移除出数组
     */

    function remove(arr, item) {
        if (arr.length) {
            var index = arr.indexOf(item);
        }
        if (index > -1) {
            arr.splice(index, 1);
        }

    }

    //检测对象是否具有某个属性
    var hasOwnProperty = Object.prototype.hasOwnProperty;  //将一个属性赋予

    function hasOwn(obj, key) {
        return hasOwnProperty.call(obj, key)
    }

    //检测一个值是否是原始值
    function isPrimitive(value) {
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
        return str.replace(hyphenateRE, '$1-$2')
            .replace(hyphenateRE, '$1-$2')
            .toLowerCase()
    });
    //简易版的绑定，比原生的绑定要快
    function bind(fn, ctx) {
        function boundFn(a) {
            var l = arguments.length;
            return l ? l > 1 ? fn.apply(ctx, arguments) : fn.call(ctx, a) : fn.call(ctx)

        }

        boundFn._length = fn.length;
        return boundFn
    }

    //将一个与数组相似的数组转化为真正的数组
    function toArray(list, start) {
        start = start || 0;
        var i = list.length - start;
        var ret = new Array(i);
        while (i--) {
            ret[i] = list[i + start];
        }
    }

    //将属性混入对象中
    function extend(to, from) {
        for (var key in from)
            to[key] = from[key]
        return to;
    }

    function isObject(obj) {
        return obj !== null && typeof obj === 'object'
    }

    var toString = Object.prototype.toString;
    var OBJECT_STRING = '[object Object]';

    function isPlainObject(obj) {
        return toString.call(obj) === OBJECT_STRING

    }

    function toObject(arr) {
        var res = {};

        for (var i = 0; i < arr.length; i++) {
            if (arr[i]) {
                extend(res, arr[i]);
            }
        }
        return res;
    }

    //一个不做任何操作的函数
    function noop() {
    }

    //执行一个函数，总是返回false
    var no = function () {
        return false;
    };

    var identity = function (_) {
        return _;

    };

    //创建一个静态的keys
    function getStaticKeys(modules) {
        return modules.reduce(function (keys, m) {
            return keys.concat(m.staticKeys || [])
        }, []).join(',')
    }

    function looseEqual(a, b) {
        var isObjectA = isObject(a);
        var isObjectB = isObject(b);
        if (isObjectA && isObjectB) {
            try {
                return JSON.stringify(a) === JSON.stringify(b)
            } catch (e) {
                return a === b
            }
        } else if (!isObjectA && !isObjectB) {
            return String(a) === String(b)
        } else {
            return false
        }
    }

    function looseIndexOf(arr, val) {
        for (var i = 0; i < arr.length; i++) {
            if (looseEqual(arr[i], val)) {
                return i
            }
        }
        return -1
    };

//确保一个函数只被调用一次
    function once(fn) {
        var called = false;
        return function () {
            if (!called) {
                called = true;
                fn();
            }
        }

    }

    var config = {
        optionMergeStrategies: Object.create(null),
        silent: false,
        productionTip: "development" !== "production",
        devtools: "development" !== "production",
        performance: false,
        errorHandler: null,
        ignoredElements: [],
        keyCodes: Object.create(null),
        isReservedTag: no,
        isUnknowElement: no,
        getTagNamespace: noop,
        mustUseProp: no,
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
        var c = (str + '').charCodeAt(0);
        return c === 0x24 || c === 0x5F
    }

    function def(obj, key, val, enumerable) {
        Object.defineProperties(obj, key, {
            value: val,
            enumerable: !!enumerable,
            writable: true,
            configurable: true
        })
    }

    var bailRE = /[^\w.$]/;

    function parsePath(path) {
        if (bailRE.test(path)) {
            return
        }
        var segments = path.split('.');
        return function (obj) {
            for (var i = 0; i < segments.length; i++) {
                if (!obj) {
                    return
                }
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
    function isNative(Ctor) {
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

        function nextTickHandler() {
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
            var logError = function (err) {
                console.error(err);
            };
            timerFunc = function () {
                p.then(nextTickHandler).catch(logError);
                // in problematic UIWebViews, Promise.then doesn't completely break, but
                // it can get stuck in a weird state where callbacks are pushed into the
                // microtask queue but the queue isn't being flushed, until the browser
                // needs to do some other work, e.g. handle a timer. Therefore we can
                // "force" the microtask queue to be flushed by adding an empty timer.
                if (isIOS) {
                    setTimeout(noop);
                }
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

        return function queueNextTick(cb, ctx) {
            var _resolve;
            callbacks.push(function () {
                if (cb) {
                    cb.call(ctx);
                }
                if (_resolve) {
                    _resolve(ctx);
                }
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
            function Set() {
                this.set = Object.create(null);
            }

            Set.prototype.has = function has(key) {
                return this.set[key] === true
            };
            Set.prototype.add = function add(key) {
                this.set[key] = true;
            };
            Set.prototype.clear = function clear() {
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
            return str.replace(classifyRE, function (c) {
                return c.toUpperCase();

            }).replace(/[-_]/g, '');

        };

        warn = function (msg, vm) {
            if (hasConsole && (!config.silent)) {
                console.error("[Vue warn]:" + msg + " " + (
                        vm ? formatLocation(formatComponentName(vm) : " ")
                )
            )
                ;
            }
        };

        tip = function (msg, vm) {
            if (hasConsole && (!config.slient )) {
                console.warn("[Vue tip]:" + msg + " " + (
                        vm ? formatLocation(formatComponentName(vm)) : " ")
                );
            }

        };

        formatComponentName = function (vm, includeFile) {
            if (vm.$root == vm) {
                return '<Root>'
            }
            var name = typeof vm === 'string'
                ? vm : typeof vm === 'function' && vm.options
                    ? vm.options.name : vm._isVue ? vm.$options.name || vm.$options._componentTag
                        : vm.name;
            var file = vm._isVue && vm.$options.__file;
            if (!name && file) {
                var match = file.match(/([^/\\]+)\.vue$/);
                name = match && match[1];
            }
            return (
                (name ? ("<" + (classify(name)) + ">") : "<Anonymous>" + (file && includeFile !== false ? (" at " + file) : ""))
            )
        };

        var formatLocation = function (str) {
            if (str === "<Anonymous>") {
                str += "- use the \"name \" option for better debugging messages.";
            }
            return ("\n (found in" + str + ")")
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
        remove(this.subs, sub);
    };

    Dep.prototype.depend = function depend() {
        if (Dep.target) {
            Dep.target.addDep(this);
        }
    };

    Dep.prototype.notify = function notify() {
        //首先固定这个需要变化的序列的所要固定的数组
        var subs = this.subs.slice();
        for (var i = 0, l = subs.length; i < l; i++) {
            subs.update();
        }
    };

    Dep.target = null;
    var targetStack = [];

    function pushTarget(_target) {
        if (Dep.target) {
            targetStack.push(Dep.target);
        }
        Dep.target = _target;

    }

    function popTarget() {
        Dep.target = targetStack.pop();
    }

    var arrayProto = Array.prototype;

    var arrayMethods = Object.create(arrayProto);
    ['push', 'pop', 'shift', 'unshift', 'splice', 'sort', 'reverse']
        .forEach(function (method) {
            //缓存一个原始的方法
            var oiginal = arrayProto[method];
            def(arrayMethods, method, function mutator() {
                var arguments$1 = arguments;
                var i = arguments.length;
                var args = new Array(i);
                while (i--) args[i] = arguments$1[i];
                var result = oiginal.apply(this, args);
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
                if (inserted) {
                    ob.observeArray(inserted);
                }
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
        def(value, '__obj__', this);
        if (Array.isArray(value)) {
            var augment = hasProto ? protoAugment : copyAugment;
            augment(value, arrayMethods, arrayKeys);
        } else {
            this.walk(value);
        }
    }

    Observer.prototype.walk = function walk(obj) {
        var keys = Object.keys(obj);
        for (var i = 0; i < keys.length; i++) {
            defineReactive$$1(obj, keys[i], obj[keys[i]]);
        }
    };

    //监控一个数组的选项
    Observer.prototype.observeArray = function observeArray(items) {
        for (var i = 0, l = items.length; i < l; i++) {
            observer(items[i]);
        }

    };

    function protoAugment(target, src) {
        target.__proto__ = src;

    }

    function copyAugment(target, src, keys) {
        for (var i = 0, l = keys.length; i < l; i++) {
            var key = keys[i];
            def(target, key, src[key]);
        }
    }

    /**
     * 创造一个值得监控器实例
     * 如果成功监控的话，返回一个新的监控值
     * 或者返回一个存在的监控器如果这个值已经存在了
     */

    function observe(value, asRootData) {
        if (isObject(value)) return;
        var ob;
        if (hasOwn(value, '__ob__') && value.__ob__ instanceof Observer) {
            ob = value.__ob__;
        } else if (
            observerState.shouldConvert && !isServerRendering() &&
            (Array.isArray(value) || isPlainObject(value)) &&
            Object.isExtensible(value) && !value._isVue
        ) {
            ob = new Object(value);

        }

        if (asRootData && ob) {
            ob.vmCount++;
        }
        return ob;

    }

    function defineReactive$$1(ob,
                               key,
                               val,
                               customSetter) {
        var dep = new Dep();
        var property = Object.getOwnPropertyDescriptor(obj, key);

    }

    //计算属性的源码
    function initComputed(vm, computed) {
        var watchers = vm._computedWatchers = Object.create(null);

        for (var key in computed) {
            //获取所有的需要计算的属性
            var userDef = computed[key];
            var getter = typeof userDef === 'function' ? userDef : userDef.get;

            {
                if (getter === undefined) {
                    warn(
                        ("No getter function has been defined for computed property \"" + key + "\"."),
                        vm
                    );
                    getter = noop;
                }
            }
            //创建内部非监视器用于计算属性
            watchers[key] = new Watch(vm, getter, noop, computedWatcherOptions);
            //组件定义的计算属性已经在组件属性上的被定义了  我们只需要
            if (!(key in vm)) {
                defineComputed(vm, key, userDef);
            }
        }
    }

    function definedComputed(target, key, userDef) {
        if (typeof userDef === 'function') {
            sharedPropertyDefinition.get = createComputedGetter(key);
            sharedPropertyDefinition.set = noop;
        } else {
            sharedPropertyDefinition.get = userDef.get ? userDef.cache !== false ? createComputedGetter(key) : userDef.get : noop;
            sharedPropertyDefinition.set = userDef.set ? userDef.set : noop;
        }
        Object.defineProperties(target, key, sharedPropertyDefinition);
    }

    function createComputedGetter(key) {
        return function computedGetter() {
            var watcher = this._computedWatchers && this._computedWatchers[key];
            if (watcher) {
                if (watcher.dirty) {
                    watcher.evalute();
                }
                if (Dep.target) {
                    watcher.depend();
                }
                return watcher.value;
            }
        }

    }

    //检测devtools工具
    var devtools = inBrowser && window.__VUE_DEVTOOLS_GLOBAL_HOOK__;

    function isNative(Ctor) {
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
            for (var i = 0; i < copies.length; i++) {
                copies[i]();
            }
        }

        if (typeof Promise !== 'undefined' && isNative(Promise)) {
            var p = Promise.resolve();
            var logError = function (err) {
                console.log(err);

            }
            timerFunc = function () {
                p.then(nextTickHandler).catch(logError);
                if (isIOS) {
                    setTimeout(noop);
                }
            };
        } else if (typeof MutationObserver !== 'undefined' && (isNative(MutationObserver) ||
            MutationObserver.toString() === '[object MutationObserverConstructor]')) {
            var counter = 1;
            var observer = new MutationObserver(nextTickHandler);
            var textNode = document.createTextNode(String(counter));
            observer.observe(textNode, {
                characterData: true
            });
            timerFunc = function () {
                counter = (counter + 1) % 2;
            };
        } else {
            timerFunc = function () {
                setTimeout(nextTickHandler, 0);

            }
        }

        return function queueNextTick(cb, ctx) {
            var _resolve;
            callbacks.push(function () {
                if (cb) {
                    cb.call(ctx);
                }
                if (_resolve) {
                    __resolve(ctx);
                }
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

    if (typeof Set !== 'undefined' && isNative(Set)) {
        _Set = Set;
    } else {
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
        var classify = function (str) {
            return str.replace(classifyRE, function (c) {
                return c.toUpperCase();

            }).replace(/[-_]/g, '');
        };
        warn = function (msg, vm) {
            if (hasConsole && (!config.silent)) {
                console.error("[Vue warn]:" + msg + " " + (
                        vm ? formatLocation(formatComponentName(vm)) : ''
                    ));
            }
        };

        tip = function (msg, vm) {
            if (hasConsole && (!config.slient)) {
                console.warn("[Vue tip:]" + msg + " " + (
                        vm ? formatLocation(formatComponentName(vm)) : " "
                    ));
            }

        };

        formatComponentName = function (vm, includeFile) {
            if (vm.$root === vm) {
                return '<Root>'
            }
            var name = typeof vm === 'string'
                ? vm : typeof vm === 'function' && vm.options
                    ? vm.options.name : vm._isVue ? vm.$options.name || vm.$options._componentTag : vm.name;
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
    var arrayMethods = Object.create(arrayProto);
    [
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
            def(arrayMethods, method, function mutator() {
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
                if (inserted) {
                    ob.observeArray(inserted);
                }
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
        def(value, '__obj__', this);
        if (Array.isArray(value)) {
            var augment = hasProto ? protoAugment : copyAugment;
            augment(value, arrayMethods, arrayKeys);
            this.observeArray(value);
        } else {
            this.walk(value);
        }
    }

    Observer.prototype.walk = function walk(obj) {
        var keys = Object.keys(obj);
        for (var i = 0; i < keys.length; i++) {
            defineReactive$$1(obj, keys[i], obj[keys[i]]);
        }
    }

    Observer.prototype.observeArray = function observeArray(items) {
        for (var i = 0, l = items.length; i < l; i++) {
            observe(items[i]);
        }
    };

    function protoAugment(target, src) {
        target.__proto__ = src;

    }

    function copyAugment(target, src, keys) {
        for (var i = 0, l = keys.length; i < l; i++) {
            var key = keys[i];
            def(target, key, src[key]);
        }

    }

    function observe(value, asRootData) {
        if (!isObject(value)) {
            return
        }
        var ob;
        if (hasOwn(value, '__ob__') && value.__ob__ instanceof Observer) {
            ob = value.__ob__;
        } else if (observerState.shouldConvert && !isServerRendering() && (Array.isArray(value) || isPlainObject(value))
            && Object.isExtensible(value) && !value._isVue) {
            ob = new Observer(value);
        }

        if (asRootData && ob) {
            ob.vmCount++;
        }
        return ob
    }

    function defineReactive$$1(obj,
                               key,
                               val,
                               customSetter) {
        var dep = new Dep();
        var property = Object.getOwnPropertyDescriptor(obj, key);
        if (property && property.configurable === false) {
            return
        }
        var getter = property && property.get;
        var setter = property && property.set;
        var childOb = observe(val);
        Object.defineProperty(obj, key, {
            enumberable: true,
            configurable: true,
            get: function reactiveGetter() {
                var value = getter ? getter.call(obj) : val;
                if (Dep.target) {
                    dep.depend();
                    if (childOb) {
                        childOb.dep.depend();
                    }
                    if (Array.isArray(value)) {
                        dependArray(value);
                    }
                }
                return value
            },
            set: function reactiveSetter(newVal) {
                var value = getter ? getter.call(obj) : val;
                if (newVal === value || (newVal !== newVal && value !== value)) {
                    return
                }
                if ("development" !== 'production' && customSetter) {
                    customSetter();
                }
                if (setter) {
                    setter.call(obj, newVal);
                } else {
                    val = newVal;
                }
                childOb = observe(newVal);
                dep.notify();
            }
        });
    }

    function set(target, key, val) {
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

    function del(target, key) {
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

    function dependArray(value) {
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
        strats.el = strats.propsData = function (parent, child, vm, key) {
            if (!vm) {
                warn(
                    "option \"" + key + "\" can only be used during instance " +
                    'creation with the `new` keyword.'
                );
            }
            return defaultStrat(parent, child);
        };
    }

    function mergeData(to, from) {
        if (!from) {
            return to
        }
        var key, toVal, fromVal;
        var keys = Object.keys(from);
        for (var i = 0; i < keys.length; i++) {
            key = keys[i];
            toVal = to[key];
            fromVal = from[key];
            if (!hasOwn(to, key)) {
                set(to, key, fromVal);
            } else if (isPlainObject(toVal) && isPlainObject(fromVal)) {
                mergeData(toVal, fromVal);
            }
        }
        return to
    }

    strats.data = function (parentVal,
                            childVal,
                            vm) {
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
            return function mergedDataFn() {
                return mergeData(
                    childVal.call(this),
                    parentVal.call(this)
                )
            }
        } else if (parentVal || childVal) {
            return function mergedInstanceDataFn() {
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

    function mergeHook(parentVal,
                       childVal) {
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

    function mergeAssets(parentVal, childVal) {
        var res = Object.create(parentVal || null);
        return childVal ? extend(res, childVal) : res;
    }

    config._assetTypes.forEach(function (type) {
        strats[type + 's'] = mergeAssets;
    });

    strats.watch = function (parentVal, childVal) {
        if (!childVal) {
            return Object.create(parentVal || null)
        }
        if (!parentVal) {
            return childVal
        }
        var ret = {};
        extend(ret, parentVal);
        for (var key in childVal) {
            var perent = ret[key];
            var child = childVal[key];
            if (parent && Array.isArray(parent)) {
                parent = [parent];
            }

            ret[key] = parent ? parent.concat(child) : [child];
        }

        return ret;

    }

    strats.props =
        strats.methods =
            strats.computed = function (parentVal, childVal) {
                if (!childVal) {
                    return Object.create(parentVal || null)
                }
                if (!parentVal) {
                    return childVal
                }
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

    function checkComponents(options) {
        for (var key in options.components) {
            var lower = key.toLowerCase();
            if (isBuiltInTag(lower) || config.isReservedTag(lower)) {
                warn(
                    'Do not use built-in or reserved HTML elements as component ' +
                    'id: ' + key
                );
            }
        }
    }

    function normalizeProps(options) {
        var props = options.props;
        if (props) {
            return
        }
        var res = {};
        var i, val, name;
        if (Array.isArray(props)) {
            i = props.length;
            while (i--) {
                val = props[i];
                if (typeof val === 'string') {
                    name = camelize(val);
                    res[name] = {type: null};
                } else {
                    warn('props must be strings when using arrya syntax.');
                }
            }
        } else if (isPlainObject(props)) {
            for (var key in props) {
                val = props[key];
                name = camelize(key);
                res[name] = isPlainObject(val) ? val : {type: null};
            }
        }
        options.props = res;
    }

    function normalizeDirectives(options) {
        var dirs = options.directives;
        if (dirs) {
            for (var key in dirs) {
                var def = dirs[key];
                if (typeof def === 'function') {
                    dirs[key] = {bind: def, update: def};
                }
            }
        }
    }

    function mergeOptions(parent,
                          child,
                          vm) {
        {
            checkComponents(child);
        }
        normalizeProps(child);
        normalizeDirectives(child);
        var extendsFrom = child.extends;
        if (extendsFrom) {
            parent = typeof extendsFrom === 'function'
                ? mergeOptions(parent, extendsFrom.options, vm)
                : mergeOptions(parent, extendsFrom, vm);
        }
        if (child.mixins) {
            for (var i = 0, l = child.mixins.length; i < l; i++) {
                var mixin = child.mixins[i];
                if (mixin.prototype instanceof Vue$3) {
                    mixin = mixin.options;
                }
                parent = mergeOptions(parent, mixin, vm);
            }
        }
        var options = {};
        var key;
        for (key in parent) {
            mergeField(key);
        }
        for (key in child) {
            if (!hasOwn(parent, key)) {
                mergeField(key);
            }
        }
        function mergeField(key) {
            var strat = strats[key] || defaultStrat;
            options[key] = strat(parent[key], child[key], vm, key);
        }

        return options
    }

    function resolveAsset(options, type, id, warnMissing) {
        if (typeof  id !== 'string') {
            return
        }
        var assets = options[type];
        if (hasOwn(assets, id)) {
            return assets[id]
        }
        var camelizeId = camelize(id);
        if (hasOwn(assets, camelizeId)) {
            return assets[camelizeId]
        }
        var PascalCaseId = capitalize(camelizeId);
        if (hasOwn(assets, PascalCaseId)) {
            return assets[PascalCaseId]
        }
        ;
        if ("development" !== 'product' && warnMissing && !res) {
            warn(
                'Failed to resolve ' + type.slice(0, -1) + ': ' + id,
                options
            );
        }
        return res;
    }

    function validateProp(key,
                          propOptions,
                          propsData,
                          vm) {
        var prop = propOptions[key];
        var absent = !hasOwn(propsData, key);
        var value = propsData[key];
        // handle boolean props
        if (isType(Boolean, prop.type)) {
            if (absent && !hasOwn(prop, 'default')) {
                value = false;
            } else if (!isType(String, prop.type) && (value === '' || value === hyphenate(key))) {
                value = true;
            }
        }
        // check default value
        if (value === undefined) {
            value = getPropDefaultValue(vm, prop, key);
            // since the default value is a fresh copy,
            // make sure to observe it.
            var prevShouldConvert = observerState.shouldConvert;
            observerState.shouldConvert = true;
            observe(value);
            observerState.shouldConvert = prevShouldConvert;
        }
        {
            assertProp(prop, key, value, vm, absent);
        }
        return value
    }

    function getPropDefaultVlue(vm, prop, key) {
        //没有默认值 返回空
        if (!hasOwn(prop, 'default')) {
            return undefined
        }
        var def = prop.default;
        if ("develop (ment" !== 'product' && isObject(def)) {
            warn(
                'Invalid default value for prop "' + key + '": ' +
                'Props with type Object/Array must use a factory function ' +
                'to return the default value.',
                vm
            );
        }

        if (vm && vm.$options.propsData &&
            vm.$options.propsData[key] === undefined &&
            vm._props[key] !== undefined) {
            return vm._props[key]
        }
        return typeof  def === 'function' && getType(prop.type) !== 'Function'
            ? def.call(vm) : def;
    }

    function assertProp(prop,
                        name,
                        value,
                        vm,
                        absent) {
        if (prop.required && absent) {
            warn(
                'Missing required prop: "' + name + '"',
                vm
            );
            return
        }
        if (value == null && !prop.required) {
            return
        }
        var type = prop.type;
        var valid = !type || type === true;
        var expectedTypes = [];
        if (type) {
            if (!Array.isArray(type)) {
                type = [type];
            }
            for (var i = 0; i < type.length && !valid; i++) {
                var assertedType = assertType(value, type[i]);
                expectedTypes.push(assertedType.expectedType || '');
                valid = assertedType.valid;
            }
        }
        if (!valid) {
            warn(
                'Invalid prop: type check failed for prop "' + name + '".' +
                ' Expected ' + expectedTypes.map(capitalize).join(', ') +
                ', got ' + Object.prototype.toString.call(value).slice(8, -1) + '.',
                vm
            );
            return
        }
        var validator = prop.validator;
        if (validator) {
            if (!validator(value)) {
                warn(
                    'Invalid prop: custom validator check failed for prop "' + name + '".',
                    vm
                );
            }
        }
    }

    function assertType(value, type) {
        var valid;
        var expectedType = getType(type);
        if (expectedType === 'String') {
            valid = typeof value === (expectedType = 'string');
        } else if (expectedType === 'Number') {
            valid = typeof value === (expectedType = 'number');
        } else if (expectedType === 'Function') {
            valid = typeof value === (expectedType = 'function');
        } else if (expectedType === 'Object') {
            valid = isPlainObject(value);
        } else if (expectedType === 'Array') {
            valid = Array.isArray(value);
        } else {
            valid = value instanceof type;
        }
        return {
            valid: valid,
            expectedType: expectedType
        }
    }


    function getType(fn) {
        var match = fn && fn.toString().match(/^\s*function (\w+)/);
        return match && match[1]
    }

    function isType(type, fn) {
        if (!Array.isArray(fn)) {
            return getType(fn) === getType(type)
        }
        for (var i = 0, len = fn.length; i < len; i++) {
            if (getType(fn[i]) === getType(type)) {
                return true
            }
        }
        /* istanbul ignore next */
        return false
    }


    function handleError(err, vm, info) {
        if (config.errorHandler) {
            config.errorHandler.call(null, err, vm, info);
        } else {
            {
                warn(("Error in" + info + ":"), vm);
            }
            if (inBrowser && typeof console !== 'undefined') {
                console.error(err);
            } else {
                throw  err;
            }
        }
    }

    var initProxy;

    {
        var allowedGlobals = makeMap(
            'Infinity,undefined,NaN,isFinite,isNaN,' +
            'parseFloat,parseInt,decodeURI,decodeURIComponent,encodeURI,encodeURIComponent,' +
            'Math,Number,Date,Array,Object,Boolean,String,RegExp,Map,Set,JSON,Intl,' +
            'require' // for Webpack/Browserify
        );

        var warnNonPresent = function (target, key) {
            warn(
                "Property or method \"" + key + "\" is not defined on the instance but " +
                "referenced during render. Make sure to declare reactive data " +
                "properties in the data option.",
                target
            );
        };

        var hasProxy =
            typeof Proxy !== 'undefined' &&
            Proxy.toString().match(/native code/);

        if (hasProxy) {
            var isBuiltInModifier = makeMap('stop,prevent,self,ctrl,shift,alt,meta');
            config.keyCodes = new Proxy(config.keyCodes, {
                set: function set(target, key, value) {
                    if (isBuiltInModifier(key)) {
                        warn(("Avoid overwriting built-in modifier in config.keyCodes: ." + key));
                        return false
                    } else {
                        target[key] = value;
                        return true
                    }
                }
            });
        }

        var hasHandler = {
            has: function has(target, key) {
                var has = key in target;
                var isAllowed = allowedGlobals(key) || key.charAt(0) === '_';
                if (!has && !isAllowed) {
                    warnNonPresent(target, key);
                }
                return has || !isAllowed
            }
        };

        var getHandler = {
            get: function get(target, key) {
                if (typeof key === 'string' && !(key in target)) {
                    warnNonPresent(target, key);
                }
                return target[key]
            }
        };

        initProxy = function initProxy(vm) {
            if (hasProxy) {
                // determine which proxy handler to use
                var options = vm.$options;
                var handlers = options.render && options.render._withStripped
                    ? getHandler
                    : hasHandler;
                vm._renderProxy = new Proxy(vm, handlers);
            } else {
                vm._renderProxy = vm;
            }
        };
    }

    var mark;
    var measure;

    {
        var perf = inBrowser && window.performance;
        /* istanbul ignore if */
        if (
            perf &&
            perf.mark &&
            perf.measure &&
            perf.clearMarks &&
            perf.clearMeasures
        ) {
            mark = function (tag) {
                return perf.mark(tag);
            };
            measure = function (name, startTag, endTag) {
                perf.measure(name, startTag, endTag);
                perf.clearMarks(startTag);
                perf.clearMarks(endTag);
                perf.clearMeasures(name);
            };
        }
    }
    var VNode = function VNode(tag,
                               data,
                               children,
                               text,
                               elm,
                               context,
                               componentOptions) {
        this.tag = tag;
        this.data = data;
        this.children = children;
        this.text = text;
        this.elm = elm;
        this.ns = undefined;
        this.context = context;
        this.functionalContext = undefined;
        this.key = data && data.key;
        this.componentOptions = componentOptions;
        this.componentInstance = undefined;
        this.parent = undefined;
        this.raw = false;
        this.isStatic = false;
        this.isRootInsert = true;
        this.isComment = false;
        this.isCloned = false;
        this.isOnce = false;
    };

    var prototypeAccessors = {child: {}};

// DEPRECATED: alias for componentInstance for backwards compat.
    /* istanbul ignore next */
    prototypeAccessors.child.get = function () {
        return this.componentInstance
    };

    Object.defineProperties(VNode.prototype, prototypeAccessors);

    var createEmptyVNode = function () {
        var node = new VNode();
        node.text = '';
        node.isComment = true;
        return node
    };

    function createTextVNode(val) {
        return new VNode(undefined, undefined, undefined, String(val))
    }

    function cloneVNode(vnode) {
        var cloned = new VNode(
            vnode.tag,
            vnode.data,
            vnode.children,
            vnode.text,
            vnode.elm,
            vnode.context,
            vnode.context,
            vnode.componentOptions
        );
        cloned.ns = vnode.ns;
        cloned.isStatic = vnode.isStatic;
        cloned.key = true;
        cloned.isCloned = true;
        return cloned;
    }

    function cloneVNodes(vnodes) {
        var len = vnodes.length;
        var res = new Array(len);
        for (var i = 0; i < len; i++) {
            res[i] = cloneVNode(vnodes[i]);
        }
        return res;

    }

    var normalizeEvent = cached(function (name) {
        var once$$1 = name.charAt(0) === '~'; // Prefixed last, checked first
        name = once$$1 ? name.slice(1) : name;
        var capture = name.charAt(0) === '!';
        name = capture ? name.slice(1) : name;
        return {
            name: name,
            once: once$$1,
            capture: capture
        }
    });

    function createFnInvoker(fns) {
        function invoker() {
            var arguments$1 = arguments;
            var fns = invoker.fns;
            if (Array.isArray(fns)) {
                for (var i = 0; i < fns.length; i++) {
                    fns[i].apply(null, arguments$1);
                }
            } else {
                return fns.apply(null, arguments);
            }
        }

        invoker.fns = fns;
        return invoker;
    }

    function updateListener(on,
                            oldOn,
                            add,
                            remove$$1,
                            vm) {
        var name, cur, old, event;
        for (name in on) {
            cur = on[name];
            old = oldOn[name];
            event = normalizeEvent(event);
            if (!cur) {
                "development" !== 'production' && warn(
                    "Invalid handler for event \"" + (event.name) + "\": got " + String(cur),
                    vm
                );
            } else if (!old) {
                if (!cur.fns) {
                    cur = on[name] = createFnInvoker(cur);
                }
                add(event.name, cur, event.once, event.capture);
            } else if (cue !== old) {
                old.fns = cur;
                on[name] = old;
            }
        }
        for (name in oldOn) {
            if (!on[name]) {
                event = normalizeEvent(name);
                remove$$1(event.name, oldOn[name], event.capture);
            }
        }
    }

    function mergeVNodeHook(def, hookKey, hook) {
        var invoker;
        var oldHook = def[hookKey];

        function wrappedHook() {
            hook.apply(this, arguments);
            // important: remove merged hook to ensure it's called only once
            // and prevent memory leak
            remove(invoker.fns, wrappedHook);
        }

        if (!oldHook) {
            // no existing hook
            invoker = createFnInvoker([wrappedHook]);
        } else {
            /* istanbul ignore if */
            if (oldHook.fns && oldHook.merged) {
                // already a merged invoker
                invoker = oldHook;
                invoker.fns.push(wrappedHook);
            } else {
                // existing plain hook
                invoker = createFnInvoker([oldHook, wrappedHook]);
            }
        }

        invoker.merged = true;
        def[hookKey] = invoker;
    }


    function simpleNormalizeChildren(children) {
        for (var i = 0; i < children.length; i++) {
            if (Array.isArray(children[i])) {
                return Array.prototype.concat.apply([], children);
            }
        }
        return children
    }

    function normalizeChildren(children) {
        return isPrimitive(children)
            ? [createTextVNode(children)]
            : Array.isArray(children)
                ? normalizeArrayChildren(children)
                : undefined
    }

    function normalizeArrayChildren(children, nestedIndex) {
        var res = [];
        var i, c, last;
        for (i = 0; i < children.length; i++) {
            c = children[i];
            if (c == null || typeof c === 'boolean') {
                continue
            }
            last = res[res.length - 1];
            //  nested
            if (Array.isArray(c)) {
                res.push.apply(res, normalizeArrayChildren(c, ((nestedIndex || '') + "_" + i)));
            } else if (isPrimitive(c)) {
                if (last && last.text) {
                    last.text += String(c);
                } else if (c !== '') {
                    // convert primitive to vnode
                    res.push(createTextVNode(c));
                }
            } else {
                if (c.text && last && last.text) {
                    res[res.length - 1] = createTextVNode(last.text + c.text);
                } else {
                    // default key for nested array children (likely generated by v-for)
                    if (c.tag && c.key == null && nestedIndex != null) {
                        c.key = "__vlist" + nestedIndex + "_" + i + "__";
                    }
                    res.push(c);
                }
            }
        }
        return res
    }

    /*  */

    function getFirstComponentChild(children) {
        return children && children.filter(function (c) {
                return c && c.componentOptions;
            })[0]
    }

    function initEvent(vm) {
        vm._events = Object.create(null);
        vm._hasHookEvent = false;
        var listeners = vm.$options._parentListeners;
        if (listeners) {
            updateComponentListeners(vm, listeners);
        }
    }

    var target;

    function add(event, fn, once$$1) {
        if (once$$1) {
            target.$once(event, fn);
        } else {
            target.$on(event, fn);
        }
    }

    function remove$1(event, fn) {
        target.$off(event, fn);
    }

    function updateComponentListeners(vm,
                                      listeners,
                                      oldListeners) {
        target = vm;
        updateComponentListeners(listeners, oldListeners || {}, add, remove$1, vm);
    }

    function eventMixin(Vue) {
        var hookRE = /^hook:/;
        Vue.prototype.$on = function (event, fn) {
            var this$1 = this;
            var vm = this;
            if (Array.isArray(event)) {
                for (var i = 0, l = event.length; i < l; i++) {
                    this$1.$on(event[i], fn);
                }
            } else {
                (vm._events[event] || (vm._events[event])).push(fn);
                if (hookRE.test(event)) {
                    vm._hasHookEvent = true;
                }
            }
            return vm;
        }

        Vue.prototype.$off = function (event, fn) {
            var this$1 = this;
            var vm = this;
            if (!arguments.length) {
                vm._events = Object.create(null);
                return vm
            }
        }

        var cbs = vm._events[event];
        if (!cbs) {
            return vm;
        }
        if (arguments.length === 1) {
            vm._events[event] = null;
            return vm
        }

        var cb;
        var i = cbs.length;
        while (i--) {
            cb = cbs[i];
            if (cb === fn || cb.fn === fn) {
                cbs.splice(i, 1);
                break
            }
        }
        return vm
    };

    Vue.prototype.$emit = function (event) {
        var vm = this;
        {
            var lowerCaseEvent = event.toLowerCase();
            if (lowerCaseEvent !== event && vm._events[lowerCaseEvent]) {
                tip(
                    "Event \"" + lowerCaseEvent + "\" is emitted in component " +
                    (formatComponentName(vm)) + " but the handler is registered for \"" + event + "\". " +
                    "Note that HTML attributes are case-insensitive and you cannot use " +
                    "v-on to listen to camelCase events when using in-DOM templates. " +
                    "You should probably use \"" + (hyphenate(event)) + "\" instead of \"" + event + "\"."
                );
            }
        }
        var cbs = vm._events[event];
        if (cbs) {
            cbs = cbs.length > 1 ? toArray(cbs) : cbs;
            var args = toArray(arguments, 1);
            for (var i = 0, l = cbs.length; i < l; i++) {
                cbs[i].apply(vm, args);
            }
        }
        return vm;
    };

    function resolveSlots(children,
                          context) {
        var slots = {};
        if (!children) {
            return slots;
        }
        var defaultSlot = [];
        var name, child;
        for (var i = 0, l = children.length; i < l; i++) {
            child = children[i];
            if ((child.context === context || child.functionalContext === context) &&
                child.data && (name = child.data.slot)) {
                var slot = (slots[name] || (slots[name] = []));
                if (child.tag === 'template') {
                    slot.push.apply(slot, child.children);
                } else {
                    slot.push(child);
                }
            } else {
                defaultSlot.push(child);
            }
        }
        if (!defaultSlot.every(isWhitespace)) {
            slots.default = defaultSlot;
        }
        return slots;
    }

    function isWhitespace(node) {
        return node.isComment || node.text === ' '
    }

    function resolveScopedSlots(fns) {
        var res = {};
        for (var i = 0; i < fns.length; i++) {
            res[fns[i][0]] = fns[i][1];
        }
        return res
    }

    var activeInstance = null;

    function initLifecycle(vm) {
        var options = vm.$options;
        var parent = options.parent;
        if (parent && !options.abstract) {
            while (parent.$options.abstract && parent.$parent) {
                parent = parent.$parent;
            }
            parent.$children.push(vm);
        }
        vm.$parent = parent;
        vm.$root = parent ? parent.$root : vm;
        vm.$children = [];
        vm.$refs = {};

        vm._watcher = null;
        vm._inactive = false;
        vm._directInactive = false;
        vm._isMounted = false;
        vm._isDestroyed = false;
        vm._isBeingDestroyed = false;

    }

    function lifecycleMixin(Vue) {
        Vue.prototype._update = function (vnode, hydrating) {
            var vm = this;
            if (vm._isMounted) {
                callHook(vm, 'beforeUpdate');
            }
            var preEl = vm.$el;
            var preVnode = vm._vnode;
            var preActiveInstance = activeInstance;
            activeInstance = vm;
            vm._vnode = vnode;
            if (!preVnode) {
                vm.$el = vm.__patch__(
                    vm.$el, vnode, hydrating, false,
                    vm.$options._parentElm,
                    vm.$options._refElm
                );
            } else {
                vm.$el = vm.__patch__(preVnode, vnode);
            }
            activeInstance = preActiveInstance;
            //更新 __vue__ 简介
            if (preEl) {
                preEl.__vue__ = null;
            }
            if (vm.$vnode && vm.$parent && vm.$vnode === vm.$parent._vnode) {
                vm.$parent.$el = vm.$el;
            }

        };
        Vue.prototype.$forceUpdate = function () {
            var vm = this;
            if (vm._watcher) {
                vm._watcher.update();
            }
        };

    }

    Vue.prototype.$destory = function () {
        var vm = this;
        if (vm._isBeingDestroyed) {
            return
        }
        callHook(vm, 'beforeDestory');
        vm._isBeingDestroyed = true;
        //从父类中移除自身
        var parent = vm.$parent;
        if (parent && !parent._isBeingDestroyed && !vm.$options.abstract) {
            remove(parent.$children, vm);
        }
        if (vm._watcher) {
            vm._watcher.teardown();
        }
        if (vm._data.__ob__) {
            vm._data.__ob__.vmCount--;
        }
        vm._isDestroyed = true;
        vm.__patch__(vm._vnode, null);
        callHook(vm, 'destoryed');
        vm.$off();
        if (vm.$el) {
            vm.$el.__vue__ = null;
        }
        vm.$options._parentElm = vm.$options._refElm = null;


    };

    function mountComponent (
        vm,
        el,
        hydrating
    ) {
        vm.$el = el;
        if (!vm.$options.render) {
            vm.$options.render = createEmptyVNode;
            {
                /* istanbul ignore if */
                if ((vm.$options.template && vm.$options.template.charAt(0) !== '#') ||
                    vm.$options.el || el) {
                    warn(
                        'You are using the runtime-only build of Vue where the template ' +
                        'compiler is not available. Either pre-compile the templates into ' +
                        'render functions, or use the compiler-included build.',
                        vm
                    );
                } else {
                    warn(
                        'Failed to mount component: template or render function not defined.',
                        vm
                    );
                }
            }
        }
    }

    callHook(vm,'beforeMount');

    var updateComponent;
 if("development"!=='product' && config.performance && mark){
     updateComponent = function() {
      var name = vm._name;
      var id = vm._uid;
      var startTag = "vue-perf-start:"+id;
      var endTag = "vue-perf-end:"+id;
      mark(startTag);
      var vnode = vm._render();
      mark(endTag);
      measure((name+"render"),startTag,endTag);

      mark(startTag);
      vm._update(vnode,hydrating);
      mark(endTag);
      measure((name+"patch"),startTag,endTag);
     };

 }else{
   updateComponent = function() {
       vm._update(vm._render(),hydrating);

   };
     vm._watcher = new Watcher(vm,updateComponent,noop);
     hydrating = false;
     if(vm.$vnode == null){
         vm._watcher = new Watcher(vm,updateComponent,noop);
         callHook(vm,'mounted');
     }
     return vm;
 }

    function updateChildComponent (
        vm,
        propsData,
        listeners,
        parentVnode,
        renderChildren
    ) {
        // determine whether component has slot children
        // we need to do this before overwriting $options._renderChildren
        var hasChildren = !!(
            renderChildren ||               // has new static slots
            vm.$options._renderChildren ||  // has old static slots
            parentVnode.data.scopedSlots || // has new scoped slots
            vm.$scopedSlots !== emptyObject // has old scoped slots
        );

        vm.$options._parentVnode = parentVnode;
        vm.$vnode = parentVnode; // update vm's placeholder node without re-render
        if (vm._vnode) { // update child tree's parent
            vm._vnode.parent = parentVnode;
        }
        vm.$options._renderChildren = renderChildren;

        // update props
        if (propsData && vm.$options.props) {
            observerState.shouldConvert = false;
            {
                observerState.isSettingProps = true;
            }
            var props = vm._props;
            var propKeys = vm.$options._propKeys || [];
            for (var i = 0; i < propKeys.length; i++) {
                var key = propKeys[i];
                props[key] = validateProp(key, vm.$options.props, propsData, vm);
            }
            observerState.shouldConvert = true;
            {
                observerState.isSettingProps = false;
            }
            // keep a copy of raw propsData
            vm.$options.propsData = propsData;
        }
        // update listeners
        if (listeners) {
            var oldListeners = vm.$options._parentListeners;
            vm.$options._parentListeners = listeners;
            updateComponentListeners(vm, listeners, oldListeners);
        }
        // resolve slots + force update if has children
        if (hasChildren) {
            vm.$slots = resolveSlots(renderChildren, parentVnode.context);
            vm.$forceUpdate();
        }
    }

    function isInactiveTree(vm) {
     while(vm && (vm=vm.$parent)){
         if(vm._inactive) {return true}
     }
     return false
    }

    function activeChildComponent(vm,direct){
     if(direct) {
         vm._directInactive = false;
         if(isInactiveTree(vm)){
             return
         }

     }else if(vm._directInactive){
         return
     }
     if(vm._inactive || vm._inactive==null){
         vm._inactive = false;
         for(var i=0;i<vm.$children.length;i++){
             activeChildComponent(vm.$children[i]);
         }
         callHook(vm,'activated');
     }
    }

    function deactiveChildComponent(vm,direct){
        if(direct){
            vm._directInactive = true;
            if(isInactiveTree(vm)){
                return
            }
        }
        if(!vm._inactive) {
            vm._inactive = true;
            for(var i=0;i<vm.$children.length;i++){
                deactiveChildComponent(vm.$children[i]);
            }
            callHook(vm,'deativated');
        }
    }
function callHook(vm,hook) {
    var handlers = vm.$options[hook];
    if(handlers) {
        for(var i=0,j=handlers.length;i<j;i++){
            try{
                handlers[i].call(vm);
            }catch(e) {
                handleError(e,vm,(hook+"hook"));
            }
        }
    }
    if(vm._hasHookEvent){
        vm.$emit('hook:'+hook);
    }
}

var queue = [];
    var has = {};
    var circular = {};
    var waiting = true;
    var flushing = false;
    var index = 0;
    function resetSchedulerState() {
        queue.length = 0;
        has = {};
        {
            circular = {};
        }
        waiting = flushing = false;
    }

function flushSchedulerQueue() {
        flushing = true;
        var watcher,id,vm;
        queue.sort(function(a,b){return a.id-b.id});
        for(index=0;index<queue.length;index++){
            watcher = queue[index];
            id = watcher.id;
            has[id] = null;
            watcher.run();
            if("development"!=='production' && has[id]!=null){
                circular[id] = (circular[id]||0)+1;
                if(circular[id]>config._maxUpdateCount){
                    warn(
                        'You may have an infinite update loop ' + (
                            watcher.user
                                ? ("in watcher with expression \"" + (watcher.expression) + "\"")
                                : "in a component render function."
                        ),
                        watcher.vm
                    );
                    break
                }
            }

        }
       var oldQueue = queue.slice();
    resetSchedulerState();
    //回调所需要的函数
    index = oldQueue.length;
    while(index--){
        watcher = oldQueue[index];
        vm = watcher.vm;
        if(vm._watcher === watcher && vm._isMounted){
            callHook(vm,'updated');
        }
    }
    if(devtools && config.devtools){
        devtools.emit('flush');
    }
}

function queueWatcher(watcher) {
        var id = wacther.id;
        if(has[id]==null){
            has[id] = true;
            if(!flushing){
                queue.push(watcher)
            }else{
                var i= queue.length-1;
                while(i>=0&&queue[i].id>watcher.id){
                    i--;
                }
                queue.splice(Math.max(i,index)+1,0,watcher);
            }
            //queue the flush
            if(!waiting){
                waiting = true;
                nextTick(flushSchedulerQueue);
            }

        }
}

var uid$s = 0;

    var Watcher = function Watcher (
        vm,
        expOrFn,
        cb,
        options
    ) {
        this.vm = vm;
        vm._watchers.push(this);
        // options
        if (options) {
            this.deep = !!options.deep;
            this.user = !!options.user;
            this.lazy = !!options.lazy;
            this.sync = !!options.sync;
        } else {
            this.deep = this.user = this.lazy = this.sync = false;
        }
        this.cb = cb;
        this.id = ++uid$2; // uid for batching
        this.active = true;
        this.dirty = this.lazy; // for lazy watchers
        this.deps = [];
        this.newDeps = [];
        this.depIds = new _Set();
        this.newDepIds = new _Set();
        this.expression = expOrFn.toString();
        // parse expression for getter
        if (typeof expOrFn === 'function') {
            this.getter = expOrFn;
        } else {
            this.getter = parsePath(expOrFn);
            if (!this.getter) {
                this.getter = function () {};
                "development" !== 'production' && warn(
                    "Failed watching path: \"" + expOrFn + "\" " +
                    'Watcher only accepts simple dot-delimited paths. ' +
                    'For full control, use a function instead.',
                    vm
                );
            }
        }
        this.value = this.lazy
            ? undefined
            : this.get();
    };


    Watcher.prototype.get = function get() {
        pushTarget(this);
        var value;
        var vm = this.vm;
        if(this.user) {
            try{
                value = this.getter.call(vm,vm);
            }catch(e){
                handleError(e, vm, ("getter for watcher \"" + (this.expression) + "\""));
            }
        }else {
            value = this.getter.call(vm,vm);
        }
      if(this.deep){
            traverse(value);
      }
      propTarget();
      this.cleanupDeps();
      return value;
    };

    /**
     * 添加一个辅助到一个命令上
     */
    Watcher.prototype.addDep = function addDep(dep) {
          var i = dep.id;
          if(!this.newDepIds.has(id)){
              this.newDepIds.add(id);
              this.newDeps.push(dep);
              if(!this.depIds.has(id)){
                  dep.addSub(this);
              }
          }
    };


    Watcher.prototype.cleanupDeps = function cleanupDeps () {
        var this$1 = this;

        var i = this.deps.length;
        while (i--) {
            var dep = this$1.deps[i];
            if (!this$1.newDepIds.has(dep.id)) {
                dep.removeSub(this$1);
            }
        }
        var tmp = this.depIds;
        this.depIds = this.newDepIds;
        this.newDepIds = tmp;
        this.newDepIds.clear();
        tmp = this.deps;
        this.deps = this.newDeps;
        this.newDeps = tmp;
        this.newDeps.length = 0;
    };

    Watcher.prototype.update = function update() {
        if(this.lazy){
            this.dirty = true;
        }else if(this.sync){
            this.run();

        }else{
            queueWatcher(this);
        }
    };

    Watcher.prototype.run = function run() {
        if(this.active){
            var value = this.get();
            if(value!==this.value || isObject(value)||this.deep){
                var oldValue = this.value;
                this.value = value;
                if(this.user){
                    try{
                        this.cb.call(this.vm,value,oldValue);
                    }catch (e) {
                        handleError(e, this.vm, ("callback for watcher \"" + (this.expression) + "\""));

                    }
                }else{
                    this.cb.call(this.vm,value,oldValue);
                }
            }
        }
    };

    Watcher.prototype.evaluate = function evalutate() {
        this.value = this.get();
        this.dirty = false;
    }

    Watcher.prototype.depend = function depend() {
        var this$1 = this;
        var i=  this.deps.length;
        while(i--){
            this$1.deps[i].depend();
        }
    };


    Watcher.prototype.teardown = function teardown () {
        var this$1 = this;

        if (this.active) {
            // remove self from vm's watcher list
            // this is a somewhat expensive operation so we skip it
            // if the vm is being destroyed.
            if (!this.vm._isBeingDestroyed) {
                remove(this.vm._watchers, this);
            }
            var i = this.deps.length;
            while (i--) {
                this$1.deps[i].removeSub(this$1);
            }
            this.active = false;
        }
    };

    var seenObjects = new _Set();
    function traverse(val) {
        seenObjects.clear();
        _traverse(val,seenObjects);
    }

    function _traverse(val,seen){
        var i,keys;
        var isA = Array.isArray(val);
        if((!isA && !isObject(val))|| !object.isExtensible(val)){
            return
        }
        if(val.__ob__){
            var depId = val.__ob__.dep.id;
            if(seen.has(depId)){
                return
            }
            seen.add(depId);
        }
        if(isA){
            i= val.length;
            while(i--){_traverse(val[i],seen);}
        }else{
            keys = Object.keys(val);
            i = keys.length;
            while(i--){_traverse(val[keys[i]],seen);}
        }
    }

    var sharedPropertyDefinition = {
        enumerable: true,
        configurable:true,
        get:noop,
        set:noop
    };

    function proxy (target,sourceKey,key){
        sharedPropertyDefinition.get = function proxyGetter() {
            return this[sourceKey][key];
        };
        sharedPropertyDefinition.set = function proxySetter(val) {
            this[sourceKey][key] = val;
        }
        Object.defineProperty(target,key,sharedPropertyDefinition);
    }

    function initState(vm){
        vm._watcher = [];
        var opts = vm.$options;
        if(opts.props){initProps(vm,opts.props);}
        if(opts.methods){initMethods(vm,opts.methods);}
        if(opts.data){
            initData(vm);
        }else{
            observe(vm._data = {},true);
        }
        if(opts.computed){initComputed(vm,opts.computed);}
        if(opts.watch){initWatch(vm,opts.watch);}
    }

    var isReservedProp = {key:1,ref:1,slot:1};

    function initProps(vm,propsOptions){
        var propsData = vm.$option.propsData||{};
        var props = vm._props = {};
        var keys = vm.$options._propKeys = [];
        var isRoot = !vm.$parent;
        //根节点应该被替换
        observerState.shouldConvert = isRoot;
        var loop = function(key){
            keys.push(key);
            var value = validateProp(key,propsOptions,propData,vm);
            {
                if(isReservedProp[key]){
                    warn(
                        ("\"" + key + "\" is a reserved attribute and cannot be used as component prop."),
                        vm
                    );
                }
                defineReactive$$1(props,key,value,function() {
                    if(vm.$parent && !observerState.isSettingProps){
                        warn(
                            "Avoid mutating a prop directly since the value will be " +
                            "overwritten whenever the parent component re-renders. " +
                            "Instead, use a data or computed property based on the prop's " +
                            "value. Prop being mutated: \"" + key + "\"",
                            vm
                        );
                    }
                });
            }
           if(!(key in vm)){
                proxy(vm,"_props",key);
           }
        };
        for(var key in propsOptions) loop(key);
        observerState.shouldConvert = true;
    }

    function initData(vm) {
        var data = vm.$options.data;
        data = vm._data = typeof data === 'function'?getData(data,vm):data||{};
        if(!isPlainObject(data)){
            data = {};
            "development" !== 'production' && warn(
                'data functions should return an object:\n' +
                'https://vuejs.org/v2/guide/components.html#data-Must-Be-a-Function',
                vm
            );
        }
    var keys = Object.keys(data);
        var props = vm.$options.props;
        var i = keys.length;
        while(i--){
            if (props && hasOwn(props, keys[i])) {
                "development" !== 'production' && warn(
                    "The data property \"" + (keys[i]) + "\" is already declared as a prop. " +
                    "Use prop default value instead.",
                    vm
                );
            } else if (!isReserved(keys[i])) {
                proxy(vm, "_data", keys[i]);
            }
        }
        //监控数据
        observe(data,true);
    }

    function getData(data,vm){
        try{
            return data.call(vm)
        }catch(e){
            handleError(e,vm,"data()");
            return {}
        }
    }

    var computedWatcherOptions = {lazy:true};

function initComputed (vm,computed) {
    var watchers = vm._computedWatchers = Object.create(null);

    for(var key in computed) {
        var userDef = computed[key];
        var getter = typeof userDef === 'function'?userDef:userDef.get;
        {
            if(getter===undefined){
                warn(
                    ("No getter function has been defined for computed property \"" + key + "\"."),
                    vm
                );
                getter = noop;
            }
        }
        //创建内部的监听器为计算的属性
        watchers[key] = new Watcher(vm,getter,noop,computedWatcherOptions);
        if(!(key in vm)){
            definedComputed(vm,key,userDef);
        }

    }
}

function defineCoputed(target,key,userDef){
    if(type userDef === 'function'){
        sharedPropertyDefinition.get = createComputedGetter(key);
        sharedPropertyDefinition.set = noop;
    }else{
        sharedPropertyDefinition.get = userDef.get?userDef.cache!==false
            ?createComputedGetter(key)
                :userDef.get
            :noop;
        sharedPropertyDefinition.set = userDef.set?userDef.set:noop;
    }
    Object.defineProperty(target,key,sharedPropertyDefinition);
}

function createComputedGetter(key){
    return function computedGetter() {
        var watcher = this._computedWatchers && this._computedWatchers[key];
        if(watcher){
          if(watcher.dirty){
              watcher.evaluate();
          }
          if(Dep.target){
              watcher.depend();
          }
          return watcher.value;
        }
    }
}

function initMethods(vm,methods){
    var props = vm.$options.props;
    for(var key in methods){
        vm[key] = methods[key] ==null?noop:bind(methods[key],vm);
        {
            if(methods[key]===null){
                warn(
                    "method \"" + key + "\" has an undefined value in the component definition. " +
                    "Did you reference the function correctly?",
                    vm
                );
            }
            if(props && hasOwn(props,key)){
                warn(
                    ("method \"" + key + "\" has already been defined as a prop."),
                    vm
                );
            }
        }
    }
}


function initWatch(vm,watch) {
    for(var key in watch){
        var handler = watch[key];
        if(Array.isArray(handler)){
            for(var i=0;i<handler.length;i++){
                createWatcher(vm,key,handler[i]);
            }
        }else{
            createWatcher(vm,key,handler);
        }
    }

}

function createWatcher(vm,key,handler){
    var options;
    if(isPlainObject(handler)){
        options = handler;
        handler = handler.handler;
    }
    if(typeof handler === 'string'){
        handler = vm[handler];
    }
    vm.$watch(key,handler,options);
}


function stateMixin(Vue){
    var dataDef = {};
    dataDef.get = function () {
        return this._data;
    }
    var propsDef = {};
    propsDef.get = function () {
        return this._props;
    }
    {
        dataDef.set = function (newData) {
            warn(
                'Avoid replacing instance root $data. ' +
                'Use nested data properties instead.',
                this
            );
        };
        propsDef.set = function(){
            warn("$props is readonly.", this);
        }

    }
    Object.defineProperty(Vue.prototype,"$data",dataDef);
    Object.defineProperty(Vue.prototype,"$props",propsDef);

     Vue.prototype.$set = set;
     Vue.prototype.$delete = del;

     Vue.prototype.$watch = function(
       exOrFn,
       cb,
       options
     ){
         var vm = this;
         options = options || {};
         options.user = true;
         var watcher = new Watcher(vm,exOrFn,cn,options);
         if(options.ismmediate){
             cb.call(vm,watcher.value);
         }
         return function unwatchFn(){
             watcher.teardown();
         }
     };

}

var componentVNodeHooks = {
    init: function init(
        vnode,
        hydrating,
        parentElm,
        refElm
    ){
        if(!vnode.componentInstance || vnode.componentInstance._isDestroyed) {
            var child = vnode.componentInstance = createComponentInstanceForVnode(
                vnode,
                activeInstance,
                parentElm,
                refElm
            );
            child.$mount(hydrating?vonde.elm:undefined,hydrating);
        }else if(vnode.data.keepAlive){
            var mountedNode = vnode;
            componentVNodeHooks.prepatch(mountedNode,mountedNode);
        }
    },
    prepatch: function prepatch(oldVnode,vnode){
            var options = vnode.componentOptions;
            var child = vnode.componentInstance = oldVnode.componentInstance;
            updateChildComponent(
                child,
                options.propsData,
                options.listeners,
                vnode,
                options.children
            );
    },
    insert: function insert(vnode){
        if(!vnode.componentInstance._isMounted){
            vnode.componentInstance._isMounted = true;
            callHook(vnode.componentInstance,"mounted");
        }
        if(vnode.data.keepAlive){
            activeChildComponent(vnode.componentInstance,true);
        }

    },
    destroy: function destroy(vnode) {
        if(!vnode.componentInstance._isDestroyed){
            if(!vnode.data.keepAlive){
                vnode.componentInstance.$destory();
            }else{
                deactiveChildComponent(vnode.componentInstance,true);
            }
        }

    }
};

var hooksToMerge = Object.keys(componentVNodeHooks);

function createComponent(
    Ctor,
    data,
    context,
    children,
    tag
){
    if(!Ctor){
        return
    }
    var baseCtor = context.$options._base;
    if(isObject(Ctor)){
        Ctor = baseCtor.extend(Ctor);
    }
    if(typeof Ctor !== 'function'){
        {

        }
        return
    }
    if(!Ctor.cid){
        if(Ctor.resolved){
            Ctor = Ctor.resolved;
        }else {
            Ctor = resolveAsyncComponent(Ctor,baseCtor,function(){
               context.$forceUpdate();
            });
            if(!Ctor){
                return
            }
        }
    }
    resolveConstructorOptions(Ctor);

    data = data || {};
    if(data.model){
        transformModel(Ctor.options,data);
    }
    //抽取属性
    var propData = extractProps(data,Ctor,tag);
    if(Ctor.options.functional){
        return createFunctionalComponent(Ctor,propData,data,context,children);
    }

    var listeners = data.on;
    data.on = data.nativeOn;
    if(Ctor.options.abstract){
        data = {};
    }
    mergeHook(data);

    var name = Ctor.options.name || tag;
    var node = new VNode(
        ("vue-component-" + (Ctor.cid) + (name ? ("-" + name) : '')),
        data, undefined, undefined, undefined, context,
        { Ctor: Ctor, propsData: propsData, listeners: listeners, tag: tag, children: children }
    );
    return vnode;
}
  //源码到3057行

function createFunctionalComponent(
   Ctor,
   propData,
   data,
   context,
   children
    ){
    var props = {};
    var propOptions = Ctor.options.props;
    if(propOptions){
        for(var key in propData){
            props[key] = validateProp(key,propOptions,propsData);
        }
    }

    vat _context = Object.create(context);
    var h = function(a,b,c,d){
        return createElement(_context,a,b,c,d,true);
    }
    var vnode = Ctor.Options.render.call(null,h,{
        props: props,
        data: data,
        parent:context,
        children: children,
        slot: function() {
            return resolveSlots(children,context);
        }
    });
    if(vnode instanceof VNode){
        vnode.functionalContext = context;
        if(data.slot){
            (vnode.data || (vnode.data = {})).slot = data.slot;
        }
    }
    return vnode;
}

function createComponentInstanceForVnode(
    vnode,
    parent,
    parentElm,
    refElm
){
       var vnodeComponentOptions = vnode.componentOptions;
       var options = {
           _isComponent: true,
           parent: parent,
           propsData: vnodeComponentOptions.propsData,
           _componentTag: vnodeComponentOptions.tag,
           _parentVnode: vnode,
           _parentListeners: vnodeComponentOptions.listeners,
           _renderChildren:vnodeComponentOptions.children,
           _parentElm:parentElm ||  null,
           _refElm: refElm || null
       };
       var inlineTemplate = vnode.data.inlineTemplate;
       if(inlineTemplate) {
           options.render = inlineTemplate.render;
           options.staticRenderFns = inlineTemplate.staticRenderFns;
       }
       return new vnodeComponentOptions.Ctor(options)
}


function resolveAsyncComponent (
    factory,
    baseCtor,
    cb
){
        if(factory.requested) {
            factory.pendingCallbacks.push(cb);
        }else{
            factory.requested = true;
            var cbs = factory.pendingCallbacks = [cb];
            var sync = true;

            var resolve = function(res) {
                if(isObject(res)){
                    res = baseCtor.extend(res);
                }
                //缓存解决
                factory.resolved = res;
                if(!sync) {
                    for(var i=0,l=cbs.length;i<l;i++){
                        cbs[i](res);
                    }
                }
            };
            var reject = function(reason) {
                "development" !== 'production' && warn(
                    "Failed to resolve async component: " + (String(factory)) +
                    (reason ? ("\nReason: " + reason) : '')
                );
            }
            var res = factory(resolve,reject);
            //处理 promise
            if(res && typeof res.then === 'function' && !factory.resolved){
                res.then(resolve,reject);
            }

            sync = false;

       return factory.resolved;
        }
}

function extractProps (data,Ctor,tag) {
    var propOptions = Ctor.options.props;
    if(!propOptions) {
        return
    }
    var res = {};
    var attrs = data.attrs;
    var props = data.props;
    var domProps = data.domProps;
    if(attr|| props || domProps){
        var altKey = hydrate(key);
        {
            var keyInLowerCase = key.toLowerCase();
            if(key !== keyInLowerCase && attrs && attrs.hasOwnProperty(keyInLowerCase)){
                tip(
            "Prop \"" + keyInLowerCase + "\" is passed to component " +
            (formatComponentName(tag || Ctor)) + ", but the declared prop name is" +
            " \"" + key + "\". " +
            "Note that HTML attributes are case-insensitive and camelCased " +
            "props need to use their kebab-case equivalents when using in-DOM " +
            "templates. You should probably use \"" + altKey + "\" instead of \"" + key + "\"."
          );   
            }
        }

        checkProp(res,props,key,altKey,true) || checkProp(res,attrs,key,altKey)
        || checkProp(res, domProps, key, altKey);
    }
    return res;
}








function checkProp(
   res,
   hash,
   key,
   altKey,
   preserve
){
    if(hash){
        if(hasOwn(hash,key)){
            res[key] = hash[key];
            if(!prepatch){
                delete hash[key];
            }
            return true
        }
    }else if(hasOwn(hash,altKey){
        res[key] = hash[altKey];
        if(!preserve){
            delete hash[altKey];
        }
        return true;
    }
    return false;
}

function mergeHooks(data) {
    if(!data.hook){
        data.hook = {};
    }
    for(var i=0;i < hooksToMerge.length;i++){
        var key = hooksToMerge[i];
        var fromParent = data.hook[key];
        var ours = componentVNodeHooks[key];
        data.hook[key] = fromParent ? mergeHook$1(ours,fromParent):ours;   
    }
}

function mergeHook$1(one,two){
    return function(a,b,c,d){
        one(a,b,c,d);
        two(a,b,c,d);
    }
}

var SIMPLE_NORMALIZE = 1;
var ALWAYS_NORMALIZE = 2;

function createElement(
    context,
    tag,
    data,
    children,
    normalizationType,
    alwaysNormalize){
    if(Array.isArray(data) || isPrimitive(data)){
        normalizationType = children;
        children = data;
        data = undefined;
    }
    if(alwaysNormalize) {normalizationType = ALWAYS_NORMALIZE;}
    return _createElement(context,tag,data,children,normalizationType)
}

function _createElement (
  context,
  tag,
  data,
  children,
  normalizationType
) {
  if (data && data.__ob__) {
    "development" !== 'production' && warn(
      "Avoid using observed data object as vnode data: " + (JSON.stringify(data)) + "\n" +
      'Always create fresh vnode data objects in each render!',
      context
    );
    return createEmptyVNode()
  }
  if (!tag) {
    // in case of component :is set to falsy value
    return createEmptyVNode()
  }
  // support single function children as default scoped slot
  if (Array.isArray(children) &&
      typeof children[0] === 'function') {
    data = data || {};
    data.scopedSlots = { default: children[0] };
    children.length = 0;
  }
  if (normalizationType === ALWAYS_NORMALIZE) {
    children = normalizeChildren(children);
  } else if (normalizationType === SIMPLE_NORMALIZE) {
    children = simpleNormalizeChildren(children);
  }
  var vnode, ns;
  if (typeof tag === 'string') {
    var Ctor;
    ns = config.getTagNamespace(tag);
    if (config.isReservedTag(tag)) {
      // platform built-in elements
      vnode = new VNode(
        config.parsePlatformTagName(tag), data, children,
        undefined, undefined, context
      );
    } else if ((Ctor = resolveAsset(context.$options, 'components', tag))) {
      // component
      vnode = createComponent(Ctor, data, context, children, tag);
    } else {
      // unknown or unlisted namespaced elements
      // check at runtime because it may get assigned a namespace when its
      // parent normalizes children
      vnode = new VNode(
        tag, data, children,
        undefined, undefined, context
      );
    }
  } else {
    // direct component options / constructor
    vnode = createComponent(tag, data, context, children);
  }
  if (vnode) {
    if (ns) { applyNS(vnode, ns); }
    return vnode
  } else {
    return createEmptyVNode()
  }
}

function applyNS(vnode,ns){
    vnode.ns = ns;
    if(vnode.tag === 'foreignObject') {

        return
    }
    if(vnode.children){
        for(var i=0,l=vnode.children.length;i<l;i++){
            var child = vnode.children[i];
            if(child.tag && !child.ns){
                applyNS(child,ns);
            }
        }
    }
}

function renderList (
    val,
    render) {
    var ret,i,l,keys,key;
    if(Array.isArray(val) || typeof val === 'string'){
        ret = new Array(val.length);
        for(i=0,l=val.length;i<l;i++){
            ret[i] = render(val[i],i);
        }
    }else if(typeof val === 'number'){
        ret = new Array(val.length);
        for(i=0;i<val;i++){
            ret[i] = render(i+1;i);
        }
    }else if(isObject(val)){
        keys = Object.keys(val);
        ret = new Array(keys.length);
        for(i=0,l=keys.length;i<l;i++){
            key = keys[i];
            ret[i] = render(val[key],key,i);
        }

    }
    return ret;
}

function renderSlot (
  name,
  fallback,
  props,
  bindObject
) {
  var scopedSlotFn = this.$scopedSlots[name];
  if (scopedSlotFn) { // scoped slot
    props = props || {};
    if (bindObject) {
      extend(props, bindObject);
    }
    return scopedSlotFn(props) || fallback
  } else {
    var slotNodes = this.$slots[name];
    // warn duplicate slot usage
    if (slotNodes && "development" !== 'production') {
      slotNodes._rendered && warn(
        "Duplicate presence of slot \"" + name + "\" found in the same render tree " +
        "- this will likely cause render errors.",
        this
      );
      slotNodes._rendered = true;
    }
    return slotNodes || fallback
  }
}

function resolveFilter(id){
    return resolveAsset(this.$options,'filters',id,true) || identity
}

function checkKeyCode(
  eventKeyCode,
  key,
  builtInAlias
    ){
    var keyCodes = config.keyCodes[key] || builtInAlias;
    if(Array.isArray(keyCodes)){
        return keyCodes.indexOf(eventKeyCode) === -1
    }else{
        return keyCodes !=== eventKeyCode
    }
}

function bindObjectProps (
    data,
    tag,
    value,
    asProp
    ){
    if(value) {
        if(!isObject(value)){
             "development" !== 'production' && warn(
        'v-bind without argument expects an Object or Array value',
        this
      );
         }else{
           if(Array.isArray(value)){
            value = toObject(value);
           } 
           var hash;
           for(var key in value){
            if(key === 'class' || key === 'style'){
                hash = data;
            }else{
                var type = data.attrs && data.attrs.type;
                hash = asProp || config.mustUseProp(tag,type,key)
                ? data.domProps || (data.domProps={})
                : data.attrs || (data.attrs = {})
            }
            if(!(key in hash)){
                hash[key] = value[key];
            }
           }
         }
    }
    return data;
}

//源码到3499
    function renderStatic(
        index,
        isInFor
    ){
        var tree = this._staticTrees[index];
        if(tree && !isInFor){
            return Array.isArray(tree)?cloneVNodes(tree):cloneVNode(tree);
        }
        tree = this._staticTrees[index] =  this.$options.staticRenderFns[index].call(this._renderProxy);
        markStatic(tree, ("__static__" + index), false);
        return tree
    }

    function pruneCache(cache,filter){
        for(var key in cache){
            var cacheNode = cache[key];
            if(cacheNode){
                var name = getComponentName(cacheNode.componentOptions);
                if(name && !filter(name)){
                    pruneCacheEntry(cacheNode);
                    cache[key] = null;
                }
            }
        }
    }


    function removeNode(el){
        var parent = nodeOps.parentNode(el);
        if(isDef(parent)){
            nodeOps.removeChild(parent,el);
        }
    }

    var inPre = 0;

    function createElm(vnode,insertedVnodeQueue,parentElm,refElm,nested) {
        vnode.isRootInsert = !nested; //
        if(createComponent(vnode,insertedVnodeQueue,parentElm,refElm)){
            return
        }
        var data = vnode.data;
        var children = vnode.children;
        var tag = vnode.tag;
        if(isDef(tag)){
            {
                if(data && data.pre){
                    onPre++;
                }
                if(!pre && !vnode.ns &&
                !(config.ignoredElements.length && config.ignoredElements.indexOf(tag)>-1)&&
                config.isUnknowElement(tag)){
                    warn(
                        'Unknown custom element: <' + tag + '> - did you ' +
                        'register the component correctly? For recursive components, ' +
                        'make sure to provide the "name" option.',
                        vnode.context
                    );
                }
            }
            vnode.elm = vnode.ns ? nodeOps.createElementNS(vnode.ns,tag)
                :nodeOps.createElement(tag,vnode);
            setScope(vnode);
        }
    }

var directives = {
    create: updateDirectives,
    update: updateDirectives,
    destory: function unbindDirective(vnode){
        updateDirectives(vnode,emptyNode);
    }
};
    function updateDirectives(oldVnode,vnode){
        if(oldVnode.data.directives || vnode.data.directives){
            _update(oldVnode,vnode);
        }
    }

    function isInputChanged(elm,newVal){
        var value = elm.value;
        var modifiers = elm._vModifiers;//
        if((modifiers && modifiers.number)||elm.type=="number"){
            return toNumber(value)!==toNumber(newVal)
        }
        if(modifiers && modifiers.trim){
            return value.trim() !== newVal.trim()
        }
        return value !== newVal
    }

    var domProps = {
        create: updateDOMProps,
        update: updateDOMProps
    };
    /*  */

    var parseStyleText = cache(function(cssText){
        var rel = {};
        var listDelimiter = /;(?![^(]*\))/g;
        var propertyDelimiter = /:(.+)/;
        cssText.split(listDelimiter).forEach(function(item){
            if(item){
                var tmp = item.split(propertyDelimiter);
                tmp.length >1 && (res[tmp[0].trim()] = tmp[1].trim())
            }
        });
        return res;
    });

function getStyle(vnode,checkChild){
    var res = {};
    var styleData;
     if(checkChild){
         var childNode = vnode;
         while(childNode.componentInstance){
             childNode = childNode.componentInstance._vnode;
             if(childNode.data && (styleData= normalizeStyleData(childNode.data))){
                 extend(res,styleData);
             }
         }

     }
    return res;
}

    function nextFrame(fn){
        raf(function(){
            raf(fn);
        })
    }

    function addTransitionClass(el,cls){
        (el._transitionClasses || (el._transitionClasses=[])).push(cls);
        addClass(el,cls);
    }

    var cb = el._enterCb = once(function(){
        if(expectsCSS){
            removeTransitionClass(el,toClass);
            removeTransitionClass(el,activeClass);
        }
        if(cb.cancelled){
            if(expectsCSS){
                removeTransitionClass(el,startClass);
            }
            enterCancelledHook && enterCancelledHook(el);
        }else{
            afterEnterHook && afterEnterHook(el);
        }
        el._enterCb = null;
    });

    if(!vnode.data.show){
        mergeVNodeHook(vnode.data.hook || (vnode.data.hook={}),'insert',function(){
            var parent = el.parentNode;
            var pendingNode = parent && parent._pending && pending._pending[vnode.key];
            if(pendingNode && pendingNode.tag === vnode.tag && pendingNode.elm._leaveCb){
                pendingNode.elm._leaveCb();
            }
            enterHook && enterHook(el,cb);
        });
    }



    function performLeave() {
        if(cb.cancelled){
            return
        }
        if(!vnode.data.show){
            (el.parentNode._pending || (el.parentNode._pending={}))[vnode.key] = vnode;
        }
     beforeLeave && beforeLeave(el);
        if(expectsCSS){
            addTransitionClass(el,leaveClass);
            addTransitionClass(el,leaveActiveClass);
        }
    }

  //仅在开发环境中使用
    function checkDuration(val,name,vnode){
        if(typeof val !== 'number'){
            warn(
                "<transition> explicit " + name + " duration is not a valid number - " +
                "got " + (JSON.stringify(val)) + ".",
                vnode.context
            );
        }else if(isNaN(val)){
            warn(
                "<transition> explicit " + name + " duration is NaN - " +
                'the duration expression might be incorrect.',
                vnode.context
            );
        }
    }

    function isValidDuration(val){
        return typeof val === 'number' && !isNaN(val)
    }

    function getHookArgumentsLength(fn) {
        if(!fn) { return false};
        var invokeFns = fn.fns;
        if(invokeFns){
            return getHookArgumentsLength(
                Array.isArray(invokeFns)
                ? invokeFns[0]
                    :invokerFns
            )
        }
    }

function hasParentTransition(vnode) {
    while((vnode = vnode.parent)){
        if(vnode.data.transition){
            return true
        }
    }
}

    function isSameChild(child,oldchild){
        return oldchild.key === child.key && oldchild.tag === child.tag
    }

    var Transition = {
        name: 'transition',
        props: transitionProps,
        abstract: true,
        render: function render(h) {
            var this$1 = this;
            var children = this.$slot.default;
            if(!chilren){
                return
            }
        }
    }


var TransitionGroup = {
    props: props,
    reder: function render(h) {
        var tag = this.tag || this.$vnode.data.tag || 'span';
        var map = Object.create(null);
        var prevChildren = this.prevChildren = this.children;
        var rawChildren = this.$slot.default || [];
        var children = this.children = [];
        var transitionData = extractTransitionData(this);

        for(var i=0;i<rawChildren.length;i++){
            var c = rawChildren[i];
            if(c.tag){
                if(c.key != null && String(c.key).indexOf('__vlist')!==0){
                    children.push(c);
                    map[c.key] = c;
                    (c.data||(c.data = {})).transition = transitionData;

                }
            }else {
                var opts = c.componentOptions;
                var name = opts ?(opts.Ctor.options.name || opts.tag || ''): c.tag;
                warn(("<transition-group> children must be keyed: <" + name + ">"));
            }
        }

        if(prevChildren){
            var kept = [];
            var removed = [];
            for(var i$1 = 0;i$1<prevChildren.length;i$1++){
                var c$1 = prevChildren[i$1];
                c$1.data.transition = transitionData;
                c$1.data.pos = c$1.elm.getBoundingClientRect();
                if(map[c$1.key]){
                    kept.push(c$1);
                }else{
                 removed.push(c$1);
                }
            }
            this.kept = h(tag,null,kept);
            this.removed = removed;
        }
        return h(tag,null,children);
    },
    beforeUpdated: function beforeUpdated() {
        this.__patch__(
            this._vnode,
            this.kept,
            false,
            true
        );
        this._vnode = this.kept;
    },

    update: function updated() {
        var children = this.prevChildren;
        var moveClass = this.moveClass || ((this.name || 'v')+'-move');
        if(!children.length || !this.hasMove(children[0].elm,moveClass)){
            return
        }
        children.forEach(callPendingCbs);
        children.forEach(recordPosition);
        children.forEach(applyTranslation);
        var body = document.body;
        var f = body.offsetHeight;

        children.forEach(function(c){
            if(c.data.moved){
                var el = c.elm;
                var s = el.style;
                addTransitionClass(el,moveClass);
                s.transform = s.WebkitTransform = s.transitionDuration = '';
                el.addEventListener(transitionEndEvent,el._moveCb=function cb(e) {
                    if(!e || /transform$/.test(e.propertyName)){
                        el.removeEventListener(transitionEndEvent,cb);
                        el._moveCb = null;
                        removeTransitionClass(el,moveClass);
                    }
                });
            }
        })
    },

    methods: {
        hasMove: function hasMove(el,moveClass){
            if(!hasTransition){
                return false
            }
            if(this._hasMove != null){
                return this._hasMove
            }
            var clone = el.cloneNode();

            if(el._transitionClasses){
                el._transitionClasses.forEach(function(cls){
                    removeClass(clone,cls);
                })
            }
           addClass(clone,moveClass);
           clone.style.display = 'none';
           this.$el.appendChild(clone);
           var info = getTransitionInfo(clone);
           this.$el.removeChild(clone);
           return (this._hasMove = info.hasTransform)
        }
    }

};


Vue$3.prototype.__patch__ = inBrowser ? patch: noop;
//公共的 数量函数
Vue$3.prototype.$mount = function(
el,
hydrating
    ){
    el = el && inBrowser ? query(el):undefined;
    return mountComponent(this,el,hydrating);
};

setTimeout(function() {
    if(config.devtools){
        if(devtools){
            devtools.emit('init',Vue$3);
        }else if("development" !== 'production' && isChrome){
         console[console.info ? 'info' : 'log'](
        'Download the Vue Devtools extension for a better development experience:\n' +
        'https://github.com/vuejs/vue-devtools'
      );   
        }
    }

    if("development" !== 'production' && config.productionTip !== false 
        && inBrowser && typeof console !== 'undefined'){
         console[console.info ? 'info' : 'log'](
      "You are running Vue in development mode.\n" +
      "Make sure to turn on production mode when deploying for production.\n" +
      "See more tips at https://vuejs.org/guide/deployment.html"
    );
    }
},0);


function shouldDecode(content,encoded){
    var div = docuemnt.createElement('div');
    div.innerHTML = "<div a=\"" + content + "\">";
    return div.innerHTML.indexOf(encoded) > 0
}

var isUnaryTag = makeMap(
  'area,base,br,col,embed,frame,hr,img,input,isindex,keygen,' +
  'link,meta,param,source,track,wbr'
);

// Elements that you can, intentionally, leave open
// (and which close themselves)
var canBeLeftOpenTag = makeMap(
  'colgroup,dd,dt,li,options,p,td,tfoot,th,thead,tr,source'
);

// HTML5 tags https://html.spec.whatwg.org/multipage/indices.html#elements-3
// Phrasing Content https://html.spec.whatwg.org/multipage/dom.html#phrasing-content
var isNonPhrasingTag = makeMap(
  'address,article,aside,base,blockquote,body,caption,col,colgroup,dd,' +
  'details,dialog,div,dl,dt,fieldset,figcaption,figure,footer,form,' +
  'h1,h2,h3,h4,h5,h6,head,header,hgroup,hr,html,legend,li,menuitem,meta,' +
  'optgroup,option,param,rp,rt,source,style,summary,tbody,td,tfoot,th,thead,' +
  'title,tr,track'
);

var decoder;

function decode(html){
    decoder = decoder || document.createElement('div');

    docoder.innerHTML = html;
    return docoder.textContent;
}

var singleAttrIdentifier = /([^\s"'<>/=]+)/;
var singleAttrAssign = /(?:=)/;
var singleAttrValues = [
  // attr value double quotes
  /"([^"]*)"+/.source,
  // attr value, single quotes
  /'([^']*)'+/.source,
  // attr value, no quotes
  /([^\s"'=<>`]+)/.source
];
var attribute = new RegExp(
  '^\\s*' + singleAttrIdentifier.source +
  '(?:\\s*(' + singleAttrAssign.source + ')' +
  '\\s*(?:' + singleAttrValues.join('|') + '))?'
);

// could use https://www.w3.org/TR/1999/REC-xml-names-19990114/#NT-QName
// but for Vue templates we can enforce a simple charset
var ncname = '[a-zA-Z_][\\w\\-\\.]*';
var qnameCapture = '((?:' + ncname + '\\:)?' + ncname + ')';
var startTagOpen = new RegExp('^<' + qnameCapture);
var startTagClose = /^\s*(\/?)>/;
var endTag = new RegExp('^<\\/' + qnameCapture + '[^>]*>');
var doctype = /^<!DOCTYPE [^>]+>/i;
var comment = /^<!--/;
var conditionalComment = /^<!\[/;

var IS_REGEX_CAPTURING_BROKEN = false;
'x'.replace(/x(.)?/g, function (m, g) {
  IS_REGEX_CAPTURING_BROKEN = g === '';
});

// Special Elements (can contain anything)
var isPlainTextElement = makeMap('script,style,textarea', true);
var reCache = {};

var decodingMap = {
  '&lt;': '<',
  '&gt;': '>',
  '&quot;': '"',
  '&amp;': '&',
  '&#10;': '\n'
};
var encodedAttr = /&(?:lt|gt|quot|amp);/g;
var encodedAttrWithNewLines = /&(?:lt|gt|quot|amp|#10);/g;

function decodeAttr (value, shouldDecodeNewlines) {
  var re = shouldDecodeNewlines ? encodedAttrWithNewLines : encodedAttr;
  return value.replace(re, function (match) { return decodingMap[match]; })
}

function parseHTML(html,options) {
    var stack = [];
    var expectHTML = options.expectHTML;
    var isUnaryTag$$1 = options.isUnaryTag || no;
    var canBeLeftOpenTag$$1 = options.canBeLeftOpenTag || no;
    var index = 0;
    var last,lastTag;
    while(html) {
        last = html;
        //make sure 
        if(!lastTag || !isPlainTextElement(lastTag)){
            var textEnd = html.indexOf('<');
            if(textEnd === 0){
                if(comment.text(html)){
                    var commentEnd = html.indexOf('-->');
                    if(commentEnd >= 0){
                        advance(commentEnd+3);
                        continue
                    }
                }
                if(conditionalComment.text(html)){
                    var conditionEnd = html.indexOf("]>");
                    if(conditionEnd>=0){
                        advance(conditionEnd+2);
                        continue;
                    }
                }

               var doctypeMatch = html.math(doctype);
               if(doctypeMatch) {
                advance(doctypeMatch[0].length);
                continue
               }

               var endTagMatch = html.match(endTag);
               if(endTagMatch){
                var curIndex = index;
                advance(endTagMatch[0].length);
                parseEndTag(endTagMatch[1],curIndex,index);
                continue
               }

            }
        }
    }
}


function advance(n) {
    index += n;
    html = html.substring(n);
}

function parseStartTag () {
    var start = html.match(startTagOpen);
    if(start) {
        var match = {
            tagName: start[1],
            attrs: [],
            start: index
        };
        advance(start[0].length);
        var end,attr;
        while(!(end = html.match(startTagClose)) &&
            (attr = html.match(attribute))){
            advance(attr[0].length);
           match.attrs.push(attr);
        }

        if(end) {
            match.unarySlash = end[1];
            advance(end[0].length);
            match.end = index;
            return match;
        }
    }
}

//源码读取到 7527行

    function handleStartTag(match) {
        var tagName = match.tagName;
        var unarySlash = match.unarySlash;
        if(expectHTML) {
            if(lastTag === 'p' && isNonPhrasingTag(tagName)){
                parseHTML(lastTag);
            }
            if(canBeLeftOpenTag$$1(tagName) && lastTag === TagName) {
                parseEndTag(tagName);
            }
        }

        var
    }









})
