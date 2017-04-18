/**
 * Created by Administrator on 2017/4/18.
 */
import { noop } from 'shared/util'
import { handleError } from './error'

export const  inBrowser = typeof window !== "undefined"

export const  UA = inBrowser && window.navigator.userAgent.toLocaleLowerCase()

export const isIE = UA && /mise|trident/.test(UA)

export const  isIE9 = UA && UA.indexOf('msie 9.0') > 0
export const isEdge = UA && UA.indexOf('edge/') >0
export const isAndroid = UA && UA.indexOf('android') >0
export const isIOS = UA && /iphone|ipad|ipod|ios/.test(UA)
export const  isChrome = UA && /chrome\/\d+/.test(UA) && !isEdge

export let supportsPassive = false

if(inBrowser){
    try{
        const opts = {}
        Object.defineProperties(opts,'passive',({
            get () {
             supportsPassive = true
            }
        }:Object))
        window.addEventListener('test-passive',null,opts)
    }catch (e){}
}

let _isServer
export const isServerRendring = () => {
  if(_isServer === undefined) {
      if(!inBrowser && typeof global !=== "undefined") {
          _isServer = global['process'].env.VUE_ENV === 'server'
      }else {
          _isServer = false
      }
  }
  return _isServer
}

//检测工具

export const devtools = inBrowser && window.__VUE_DEVTOOLS_GLOBAL_HOOK__

export function isNative(Ctor:any):boolean {
    return typeof Ctor === 'function' && /native code/.test(Ctor.toString())
}

export const hasSymbol =
    typeof Symbol !=='undefined' && isNative(Symbol)&&
        typeof Reflect !== 'undefined' && isNative(Reflect.ownKeys)

export const  nextTick = (function () {
    const callbacks = []
    let pending = false
    let timerFunc

    function nextTickHandler() {
        pending = false
        const copies = callbacks.slice(0)
        callbacks.length = 0;
        for (let i=0;i<copies.length;i++){
            copies[i]()
        }
    }

    if(typeof Promise !== 'undefined' && isNative(Promise)){
        var p = Promise.resolve()

        var logError = err => {console.error(err)}

        timerFunc = () => {
            p.then(nextTickHandler).catch(logError)
            if(isIOS) setTimeout(noop)
        }
    }else if(typeof MutationObserver !== 'undefined' && (
        isNative(MutationObserver) ||
            MutationObserver.toString() === '[object MutationObserverConstructor]'
        )){
        var counter = 1
        var observer = new MutationObserver(nextTickHandler)
        var textNode = document.createTextNode(String(counter))
        observer.observe(textNode,{
            charactorData:true
        })

        timerFunc = () => {
            counter = (counter + 1)%2
            textNode.data = String(counter)
        }
    }else {
        timerFunc = () => {
            setTimeout(nextTickHandler,0)
        }
    }

    return function queueNextTick(cb?Function,ctx?:Object) {
        let _resolve
        callbacks.push(() => {
            if(cb) {
                try{
                    cb.call(ctx)
                }catch(e){
                    handleError(e,ctx,'nextTick')
                }
            }else if(_resolve){
                _resolve(ctx)
            }
        })
        if(!pending){
            pending = true
            timerFunc()
        }
        
    }

})

