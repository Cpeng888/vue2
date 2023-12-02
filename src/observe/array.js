// 重写数组中的七个方法

let oldArrayProto = Array.prototype // 获取数组的原型

// 创建一个以Array.prototype 为原型的 对象
export let newArrayProto = Object.create(oldArrayProto)
let methods = [
    'push',
    'pop',
    'shift',
    'unshift',
    'reverse',
    'sort',
    'splice'
]

// 重写方法
methods.forEach(method => {
    // 更改新的arr原型方法，但是执行旧的方法
    newArrayProto[method] = function (...args) {
        const res = oldArrayProto[method].call(this, ...args) // 内部调用原来的方法，函数的劫持，切片编程
        // 拿到Observe的this
        let ob = this.__ob__  
        // 我们需要对新增的数据再次进行劫持
        let inserted
        switch (method) {
            case 'push':
            case 'push':
                inserted = args
                break;
            case 'splice':
                inserted = args.slice(2)
            default:
                break;
        }
        // 如果inserted存在 对新增的内容再次进行检测
        if (inserted) {
            ob.obseverArray(inserted)
        }
        return res
    }
})