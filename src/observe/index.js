
import { newArrayProto } from "./array.js"
// 检测类
class Obsever {
    constructor(data) {
        // 给数据添加标识 就是给每个data都添加个__ob__属性，如果有这个属性就说明已经每监测了
        Object.defineProperty(data,'__ob__', {
            value:this, // 这样就可以调用Observer的方法
            enumerable:false // 将__ob__变成不可枚举的的属性，如果不添加这个属性就会一直循环递归
        })
        // object.defineProperty只能劫持已经存在的属性（vue里面会维持单独写一些api, $set $delete）
        if (Array.isArray(data)) {
            // 重写方法 七个变异方法
            data.__proto__ = newArrayProto
            this.obseverArray(data) // 数组中的对象时刻以监控到数据的变化
        } else {
            this.walk(data)
        }
    }
    walk(data) {
        // 循环对象对属性依次劫持
        // "重新定义" 属性
        Object.keys(data).forEach(key => defineReactive(data, key, data[key]))
    }
    // 数组单独进行检测
    obseverArray(data) {
        data.forEach(item => obsever(item))
    }
}


// 数据劫持
export const obsever = function (data) {
    // 对这个对象进行劫持

    // 只能对象进行劫持
    if (typeof data !== "object" || data === null) return
    // 说明已经被代理过了
    if( data.__ob__ instanceof Obsever) return data.__ob__
    return new Obsever(data)
}

// taget是对象和 key是属性明 value是属性值
export function defineReactive(target, key, value) { // value是一个闭包
    // 属性值是对象或者数组也要进行劫持
    obsever(value) // 对所有的对象都进行属性劫持 进行递归
    Object.defineProperty(target, key, {
        // 取值的时候
        get() {
            console.log('我取值了')
            return value
        },
        // 设置值的时候
        set(newValue) {
            console.log(`我被设置了${newValue}`)
            if (newValue === value) return
            value = newValue
            obsever(newValue) // 设置完后也要立即进行检测
        }
    })
}