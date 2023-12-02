import { obsever } from "./observe/index.js"

// 挂载_init方法 
export function initMixin(Vue) { // 将vue作为参数传进来
    // 初始化options
    Vue.prototype._init = function(options){
        const vm = this
        // 建立$options
        vm.$optins = options // vm.$options 获取用户配置
        // 初始化状态（包括data,props,watch，......）
       initState(vm) 
    }
}
// 总方法
function initState(vm) {
    const opts = vm.$optins // 获取所有选项
    // 初始化data
    if (opts.data) {
        initData(vm)
    }
}
// 初始化data
function initData(vm) {
    let data = vm.$optins.data // data可能是函数和对象
    // 如果是函数就执行拿到数据 不是就直接拿到
    data = typeof data === "function"? data.call(this) : data
    console.log(data)
    // 进行数据劫持 vue2中使用obj.defineproperty
    obsever(data)
    // 赋值给_data
    vm._data = data
    // 将vm._data进行二次代理
    for (let key in data) {
        proxy(vm, '_data',key)
    }
}

// 将_data的东西代理到vm实例上 啥意思呢 就是 之前是通过vm._data.name获取name,现在是可以通过vm.data获取
function proxy(vm,targert,key) {
    // 重新定义vm的属性
    Object.defineProperty(vm,key,{
        get() {
            return vm[targert][key]
        },
        set(newValue) {
            vm[targert][key] = newValue
        }
    })
}